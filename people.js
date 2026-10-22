import * as THREE from './assets/vendor/three.module.js';
import { GLTFLoader } from './assets/vendor/GLTFLoader.js';
import { clone } from './assets/vendor/SkeletonUtils.js';

export const officeOccupants = [
  { id: 'reception', model: 'woman-casual', x: 2.3, z: 4.15, heading: 0 },
  { id: 'studio-near', model: 'woman-cardigan', x: -2.3, z: -1.95, heading: Math.PI, seated: true },
  { id: 'studio-far', model: 'man-casual', x: 1, z: -7, heading: 0, seated: true },
  { id: 'reviewer', model: 'man-suit', x: -5.8, z: -9.4, heading: Math.PI + .5 },
  { id: 'colleague', model: 'woman-casual', x: -4.6, z: -9.7, heading: Math.PI + 1.7 },
  { id: 'support', model: 'man-suit', x: .1, z: -16.75, heading: Math.PI, seated: true },
  { id: 'walker', model: 'man-casual', x: 2.3, z: -1, heading: Math.PI, moving: true },
];

const point = object => object.getWorldPosition(new THREE.Vector3());
function aimBone(bone, child, target, root) {
  const origin = point(bone);
  const from = point(child).sub(origin).normalize();
  const to = target.clone().sub(origin).normalize();
  const delta = new THREE.Quaternion().setFromUnitVectors(from, to);
  const world = bone.getWorldQuaternion(new THREE.Quaternion());
  const parent = bone.parent.getWorldQuaternion(new THREE.Quaternion());
  bone.quaternion.copy(parent.invert().multiply(delta.multiply(world)));
  root.updateMatrixWorld(true);
}

function reachHand(root, side, target, pole) {
  const upper = root.getObjectByName('UpperArm' + side);
  const lower = root.getObjectByName('LowerArm' + side);
  const palm = root.getObjectByName('Palm' + side);
  const shoulder = point(upper), elbow = point(lower), hand = point(palm);
  const upperLength = shoulder.distanceTo(elbow), lowerLength = elbow.distanceTo(hand);
  const direction = target.clone().sub(shoulder);
  const distance = THREE.MathUtils.clamp(direction.length(), Math.abs(upperLength - lowerLength) + .0001, upperLength + lowerLength - .0001);
  direction.normalize();
  const along = (upperLength ** 2 - lowerLength ** 2 + distance ** 2) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2));
  pole = pole.clone().sub(shoulder);
  pole.addScaledVector(direction, -pole.dot(direction)).normalize();
  aimBone(upper, lower, shoulder.clone().addScaledVector(direction, along).addScaledVector(pole, height), root);
  aimBone(lower, palm, shoulder.clone().addScaledVector(direction, distance), root);
  aimBone(palm, root.getObjectByName('MiddleHand' + side), point(palm).add(new THREE.Vector3(0, 0, 1)), root);
}

const restMaterial = new THREE.MeshStandardMaterial({ color: '#455461', roughness: .9 });
export function placeOfficePerson(source, definition) {
  const group = new THREE.Group();
  group.name = 'office-person-' + definition.id;
  const model = clone(source.scene);
  group.add(model);
  model.scale.multiplyScalar(.36);
  const mixer = new THREE.AnimationMixer(model);
  const findClip = name => source.animations.find(clip => clip.name.endsWith('_' + name));
  const clip = findClip(definition.seated ? 'Sitting' : 'Idle');
  if (!clip) throw new Error('Missing character pose: ' + definition.model);
  mixer.clipAction(clip).play();
  mixer.setTime(definition.seated ? clip.duration / 2 : 0);
  group.updateMatrixWorld(true);
  if (definition.seated) {
    // Short cartoon shins rest on an ergonomic footrest instead of floating.
    const seatOffset = definition.model.startsWith('woman-') ? .162 : .155;
    model.position.set(0, seatOffset, .281);
    group.updateMatrixWorld(true);
    for (const [side, x] of [['L', .18], ['R', -.18]]) {
      reachHand(group, side, new THREE.Vector3(x, .92, .45), new THREE.Vector3(x * 2, .95, .15));
    }
    const footTop = new THREE.Box3().setFromObject(model, true).min.y;
    const height = footTop - .06;
    const rest = new THREE.Mesh(new THREE.BoxGeometry(.4, height, .28), restMaterial);
    rest.name = 'footrest';
    rest.position.set(0, .06 + height / 2, .36);
    rest.castShadow = rest.receiveShadow = true;
    group.add(rest);
  } else {
    const floor = new THREE.Box3().setFromObject(model, true).min.y;
    const hips = point(model.getObjectByName('Hips'));
    model.position.set(-hips.x, .06 - floor, -hips.z);
    group.updateMatrixWorld(true);
    if (definition.id === 'reviewer') {
      for (const [side, x] of [['L', .13], ['R', -.13]]) {
        reachHand(group, side, new THREE.Vector3(x, 1.17, .27), new THREE.Vector3(x * 2.8, 1.05, .08));
      }
      const notebook = new THREE.Mesh(new THREE.BoxGeometry(.3, .025, .24), new THREE.MeshStandardMaterial({ color: '#252659', roughness: .9 }));
      notebook.name = 'review-notebook';
      notebook.position.set(0, 1.1, .31);
      notebook.castShadow = true;
      group.add(notebook);
    }
  }
  group.position.set(definition.x, 0, definition.z);
  group.rotation.y = definition.heading;
  group.updateMatrixWorld(true);
  const hips = model.getObjectByName('Hips');
  const restX = hips.position.x, restZ = hips.position.z;
  const idle = mixer.existingAction(clip);
  const walk = definition.moving ? mixer.clipAction(findClip('Walk')) : null;
  let wasMoving = null;
  function update(progress, motion) {
    if (!definition.moving) return;
    if (motion !== wasMoving) {
      mixer.stopAllAction();
      (motion ? walk : idle).reset().play();
      wasMoving = motion;
    }
    const distance = progress * 8;
    mixer.setTime(motion ? distance / 1.1 * walk.getClip().duration : 0);
    hips.position.x = restX;
    hips.position.z = restZ;
    group.position.z = definition.z - distance;
    group.updateMatrixWorld(true);
  }
  return { group, model, mixer, definition, update };
}

export function createOfficePeople(scene, { fallbacks, contactShadow, onChange }) {
  const loader = new GLTFLoader();
  const occupants = [];
  let progress = 0, motion = true;
  function update(nextProgress, nextMotion) {
    progress = nextProgress;
    motion = nextMotion;
    for (const person of occupants) person.update(progress, motion);
  }
  const models = [...new Set(officeOccupants.map(person => person.model))];
  const ready = Promise.allSettled(models.map(async name => {
    const source = await loader.loadAsync(new URL('./assets/people/' + name + '.glb', import.meta.url).href);
    source.scene.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = object.receiveShadow = true;
      // Imported clothing keeps the office's soft, matte material treatment.
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        material.roughness = .9;
        material.metalness = 0;
      }
    });
    for (const definition of officeOccupants.filter(person => person.model === name)) {
      const person = placeOfficePerson(source, definition);
      contactShadow(0, 0, .8, .6, person.group);
      scene.add(person.group);
      occupants.push(person);
      fallbacks[definition.id].group.visible = false;
    }
    update(progress, motion);
    onChange();
  })).then(results => {
    for (const result of results) if (result.status === 'rejected') console.warn('Office character unavailable; keeping its fallback.', result.reason);
    return results;
  });
  return { update, ready, occupants };
}
