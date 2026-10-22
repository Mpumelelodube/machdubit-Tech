import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../assets/vendor/three.module.js';
import { GLTFLoader } from '../assets/vendor/GLTFLoader.js';
import { placeOfficePerson, createOfficePeople, officeOccupants } from '../people.js';

const loader = new GLTFLoader();
const sources = {};
for (const name of new Set(officeOccupants.map(person => person.model))) {
  const data = fs.readFileSync(new URL(`../assets/people/${name}.glb`, import.meta.url));
  sources[name] = await loader.parseAsync(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), '');
}

function snapshot(person) {
  person.group.updateMatrixWorld(true);
  const values = [], vertex = new THREE.Vector3();
  person.model.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
      mesh.getVertexPosition(i, vertex).applyMatrix4(mesh.matrixWorld);
      values.push(vertex.x, vertex.y, vertex.z);
    }
  });
  assert.ok(values.every(Number.isFinite), `${person.definition.id}: finite deformed geometry`);
  return values;
}
function samePose(a, b, message) {
  assert.equal(a.length, b.length);
  assert.ok(a.every((value, i) => Math.abs(value - b[i]) < 1e-6), message);
}

const occupants = officeOccupants.map(definition => placeOfficePerson(sources[definition.model], definition));
for (const person of occupants) {
  snapshot(person);
  if (!person.definition.seated) continue;
  const worldToLocal = person.group.matrixWorld.clone().invert();
  for (const [side, expectedX] of [['L', .18], ['R', -.18]]) {
    const palm = person.model.getObjectByName('Palm' + side).getWorldPosition(new THREE.Vector3()).applyMatrix4(worldToLocal);
    assert.ok(palm.distanceTo(new THREE.Vector3(expectedX, .92, .45)) < .0001, `${person.definition.id}: palm reaches desk`);
  }
  const rest = person.group.getObjectByName('footrest');
  const restTop = rest.position.y + rest.geometry.parameters.height / 2;
  const footBottom = new THREE.Box3().setFromObject(person.model, true).min.y;
  assert.ok(Math.abs(restTop - footBottom) < .00001, `${person.definition.id}: feet meet footrest`);
  const vertex = new THREE.Vector3();
  person.model.traverse(mesh => {
    if (!mesh.isSkinnedMesh) return;
    const { position, skinIndex, skinWeight } = mesh.geometry.attributes;
    for (let i = 0; i < position.count; i++) {
      let joint = 0, weight = 0;
      for (let j = 0; j < 4; j++) {
        if (skinWeight.getComponent(i, j) > weight) {
          weight = skinWeight.getComponent(i, j);
          joint = skinIndex.getComponent(i, j);
        }
      }
      if (!/Arm|Palm|Hand/.test(mesh.skeleton.bones[joint].name)) continue;
      mesh.getVertexPosition(i, vertex).applyMatrix4(mesh.matrixWorld).applyMatrix4(worldToLocal);
      const insideChairBack = Math.abs(vertex.x) < .31 && vertex.y > .48 && vertex.y < 1.12 && vertex.z > -.31 && vertex.z < -.19;
      const insideDesktop = Math.abs(vertex.x) < .825 && vertex.y > .745 && vertex.y < .835 && vertex.z > .25 && vertex.z < 1.05;
      assert.ok(!insideChairBack && !insideDesktop, `${person.definition.id}: arm vertex clears chair and desktop`);
    }
  });
}

const walker = occupants.find(person => person.definition.moving);
const neighbour = occupants.find(person => person.definition.id === 'studio-far');
assert.notEqual(walker.model.getObjectByName('Hips'), neighbour.model.getObjectByName('Hips'), 'clones have independent bones');
const neighbourBefore = snapshot(neighbour);
walker.update(.38, true);
const forwards = snapshot(walker);
walker.update(.84, true);
walker.update(.38, true);
samePose(forwards, snapshot(walker), 'reverse scrolling retraces the same complete skinned pose');
walker.update(.38, false);
const paused = snapshot(walker);
walker.update(.38, false);
samePose(paused, snapshot(walker), 'paused actor holds a stable idle pose');
walker.update(.38, true);
samePose(forwards, snapshot(walker), 'enabling motion restores the same progress-derived walking pose');
samePose(neighbourBefore, snapshot(neighbour), 'walking cannot mutate the seated clone');
assert.equal(walker.group.position.z, walker.definition.z - .38 * 8);

const originalLoad = GLTFLoader.prototype.loadAsync;
const originalWarn = console.warn;
const warnings = [];
let failModel = 'man-casual';
GLTFLoader.prototype.loadAsync = async url => {
  const name = new URL(url).pathname.split('/').at(-1).replace('.glb', '');
  if (name === failModel) throw new Error('Expected missing-model test');
  return sources[name];
};
console.warn = (...args) => warnings.push(args);
try {
  const fallbacks = Object.fromEntries(officeOccupants.map(person => [person.id, { group: new THREE.Group() }]));
  let changes = 0;
  const scene = new THREE.Scene();
  const controller = createOfficePeople(scene, { fallbacks, contactShadow: () => {}, onChange: () => changes++ });
  controller.update(.42, false);
  const results = await controller.ready;
  assert.equal(results.filter(result => result.status === 'rejected').length, 1, 'a failed model does not reject the controller');
  assert.equal(warnings.length, 1);
  assert.equal(changes, 3, 'each successful source requests a redraw');
  assert.equal(controller.occupants.length, 5, 'unaffected sources are still placed');
  for (const definition of officeOccupants) {
    assert.equal(fallbacks[definition.id].group.visible, definition.model === 'man-casual', `${definition.id}: fallback visibility follows source outcome`);
  }
  failModel = null;
  const allFallbacks = Object.fromEntries(officeOccupants.map(person => [person.id, { group: new THREE.Group() }]));
  const successful = createOfficePeople(new THREE.Scene(), { fallbacks: allFallbacks, contactShadow: () => {}, onChange: () => {} });
  successful.update(.42, false);
  await successful.ready;
  assert.equal(successful.occupants.length, 7, 'all models replace their fallbacks after successful loading');
  assert.ok(Object.values(allFallbacks).every(person => !person.group.visible));
  walker.update(.42, false);
  samePose(snapshot(walker), snapshot(successful.occupants.find(person => person.definition.moving)), 'late-loaded walker uses the current paused state and position');
} finally {
  GLTFLoader.prototype.loadAsync = originalLoad;
  console.warn = originalWarn;
}
console.log('PASS: GLB loading, 7 placements, seated hands/feet, independent rigs, deterministic reverse/pause/resume, and per-model failure fallback.');
