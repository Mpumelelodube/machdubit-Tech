import * as THREE from './assets/vendor/three.module.js';
import { cameraStops, journeyProgress } from './journey.js';
import { createOfficePeople } from './people.js';

const container=document.querySelector('#office');
const sections=[...document.querySelectorAll('.chapter')];
const names=['Reception','Our story','The studio','Connected systems','The project room','The product desk','Support workspace','Let’s talk'];
const motionButton=document.querySelector('#motion');
const osMotion=matchMedia('(prefers-reduced-motion: reduce)');
let saved=null;try{saved=localStorage.getItem('machdubit-motion')}catch{}
let motion=saved?saved==='on':!osMotion.matches;
let renderer,scene,camera,frame=0,current=0,target=0,last=0,active=0;
const materials=new Map(),geometries=new Map();
let woodTexture,shadowTexture;
function surfaceTextures(){
 const wood=document.createElement('canvas');wood.width=512;wood.height=128;const c=wood.getContext('2d');c.fillStyle='#b18b63';c.fillRect(0,0,512,128);
 let seed=47;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 for(let i=0;i<220;i++){c.strokeStyle=i%3?'rgba(77,49,27,.10)':'rgba(249,225,183,.14)';c.lineWidth=.3+random();c.beginPath();const y=random()*128;c.moveTo(0,y);c.bezierCurveTo(170,y+random()*6,320,y-3,512,y+random()*4);c.stroke()}
 woodTexture=new THREE.CanvasTexture(wood);woodTexture.colorSpace=THREE.SRGBColorSpace;woodTexture.wrapS=woodTexture.wrapT=THREE.RepeatWrapping;
 const shadow=document.createElement('canvas');shadow.width=shadow.height=64;const ctx=shadow.getContext('2d');const fade=ctx.createRadialGradient(32,32,5,32,32,31);fade.addColorStop(0,'rgba(24,31,36,.45)');fade.addColorStop(.55,'rgba(24,31,36,.18)');fade.addColorStop(1,'rgba(24,31,36,0)');ctx.fillStyle=fade;ctx.fillRect(0,0,64,64);shadowTexture=new THREE.CanvasTexture(shadow);
}
function contactShadow(x,z,w,d,parent=scene){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,opacity:.6}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.106,z);parent.add(mesh)}
function softBox(w,h,d,x,y,z,color,parent=scene){
 const key='rounded'+[w,h,d];if(!geometries.has(key)){const g=new THREE.BoxGeometry(w,h,d,3,3,3),p=g.attributes.position,r=Math.min(.045,w/4,h/4,d/4);for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);const q=new THREE.Vector3(THREE.MathUtils.clamp(v.x,-w/2+r,w/2-r),THREE.MathUtils.clamp(v.y,-h/2+r,h/2-r),THREE.MathUtils.clamp(v.z,-d/2+r,d/2-r));v.sub(q).normalize().multiplyScalar(r).add(q);p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();geometries.set(key,g)}const mesh=new THREE.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function ellipsoid(x,y,z,sx,sy,sz,color,parent=scene){if(!geometries.has('sphere'))geometries.set('sphere',new THREE.SphereGeometry(1,14,10));const mesh=new THREE.Mesh(geometries.get('sphere'),mat(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;parent.add(mesh);return mesh}

function mat(color,extra={}){const key=JSON.stringify([color,extra]);if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.82,...(['#bb9874','#b79770','#b69770','#ba9c7b','#b39979'].includes(color)&&woodTexture?{color:'#ffffff',map:woodTexture,roughness:.68}:{}),...(color==='#a7c6cd'?{roughness:.16,metalness:.08}:{}),...extra}));return materials.get(key)}
function box(w,h,d,x,y,z,color,parent=scene,extra={}){const key=`${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new THREE.BoxGeometry(w,h,d));const mesh=new THREE.Mesh(geometries.get(key),mat(color,extra));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cyl(r1,r2,h,x,y,z,color,parent=scene){const key=`c${r1},${r2},${h}`;if(!geometries.has(key))geometries.set(key,new THREE.CylinderGeometry(r1,r2,h,16));const mesh=new THREE.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function label(text,w,h,x,y,z,{bg='#20284a',fg='#ffffff',size=70}={}){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.round(1024*h/w);const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`500 ${size}px Arial`;ctx.fillText(text,512,canvas.height/2);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));mesh.position.set(x,y,z);scene.add(mesh);return mesh}
function plant(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);cyl(.25,.19,.46,0,.23,0,'#c9c5ba',g);for(let i=0;i<7;i++){const angle=i*2.4;const stem=cyl(.022,.027,.95,Math.sin(angle)*.09,.9,Math.cos(angle)*.09,'#52634a',g);stem.rotation.z=Math.sin(angle)*.2;const leaf=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),mat(i%2?'#5d7856':'#738b5d'));leaf.scale.set(.55,1.8,.9);leaf.position.set(Math.sin(angle)*.2,1.15+(i%3)*.12,Math.cos(angle)*.2);leaf.rotation.z=-Math.sin(angle)*.6;g.add(leaf)}}
function chair(x,z,angle=0,color='#416e8b'){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);contactShadow(0,0,.85,.85,g);softBox(.62,.14,.58,0,.47,0,color,g);softBox(.62,.64,.12,0,.8,.25,color,g);for(const dx of[-.23,.23])for(const dz of[-.2,.2])box(.035,.4,.035,dx,.2,dz,'#303d48',g);return g}
function desk(x,z,angle=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);contactShadow(0,0,2,1.2,g);softBox(1.65,.09,.8,0,.79,0,'#bb9874',g);for(const dx of[-.7,.7])for(const dz of[-.3,.3])box(.045,.75,.045,dx,.375,dz,'#39434b',g);box(.13,.25,.13,0,.94,-.18,'#35424c',g);box(.9,.54,.05,0,1.25,-.2,'#253546',g);box(.83,.46,.01,0,1.25,-.167,'#83b6c7',g);for(let i=0;i<4;i++)box(.45-i*.05,.014,.012,-.12,1.37-i*.065,-.155,i%2?'#e0eee7':'#38667b',g);box(.45,.025,.17,0,.85,.17,'#dce1df',g);box(.12,.02,.17,.4,.85,.18,'#303d48',g);box(.2,.015,.29,-.57,.85,.1,'#f1eee5',g);cyl(.055,.055,.12,.59,.9,-.05,'#e6e0d2',g);return g}

// Procedural fallbacks stay visible until their cartoon character loads.
let walker, officePeople;
function person(x,z,{seated=false,angle=0,shirt='#477b98',skin='#986b4e'}={}){
 const g=new THREE.Group();g.position.set(x,.06,z);g.rotation.y=angle;scene.add(g);
 const hip=seated?.54:.82;
 if(!seated)contactShadow(0,0,.7,.6,g);
 ellipsoid(0,hip+.27,0,.19,.25,.125,shirt,g);
 cyl(.065,.065,.09,0,hip+.53,0,skin,g);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.135,12,10),mat(skin));head.scale.set(.9,1.1,.95);head.position.set(0,hip+.7,0);head.castShadow=true;g.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.14,14,10,0,Math.PI*2,0,Math.PI/2),mat(shirt==='#577b69'?'#3b302c':'#292c31'));hair.position.set(0,hip+.72,.005);hair.scale.z=.94;g.add(hair);
 for(const side of[-1,1])ellipsoid(side*.13,hip+.70,0,.027,.038,.028,skin,g);
 ellipsoid(0,hip+.69,-.13,.026,.032,.028,skin,g);
 const limbs=[];
 for(const side of[-1,1]){
  const leg=new THREE.Group();leg.position.set(side*.105,hip,0);g.add(leg);limbs.push(leg);
  if(seated){box(.135,.12,.36,0,0,-.16,'#344454',leg);box(.12,.39,.12,0,-.22,-.29,'#344454',leg);box(.15,.1,.25,0,-.43,-.35,'#283139',leg)}
  else{box(.135,.69,.15,0,-.345,0,'#344454',leg);box(.16,.11,.26,0,-.715,-.055,'#283139',leg)}
  const arm=new THREE.Group();arm.position.set(side*.25,hip+.42,0);g.add(arm);limbs.push(arm);
  if(seated){
   // Bent elbows and forward forearms keep hands in front of the chair back.
   softBox(.12,.27,.13,0,-.12,-.04,shirt,arm);
   softBox(.10,.10,.28,0,-.19,-.18,skin,arm);
   softBox(.11,.09,.12,0,-.19,-.36,skin,arm);
  }else{box(.12,.31,.13,0,-.14,0,shirt,arm);box(.10,.25,.11,0,-.39,0,skin,arm)}
 }
 return {group:g,limbs};
}
function animatePeople(t){if(!walker)return;const distance=t*8;walker.group.position.z=-1-distance;const stride=motion?Math.sin(distance/.66*Math.PI)*.32:0;walker.limbs[0].rotation.x=stride;walker.limbs[2].rotation.x=-stride;walker.limbs[1].rotation.x=-stride*.7;walker.limbs[3].rotation.x=stride*.7;officePeople?.update(t,motion);}

function build(){surfaceTextures();scene=new THREE.Scene();scene.background=new THREE.Color('#dbe0dc');scene.fog=new THREE.Fog('#dbe0dc',24,65);camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100);renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;container.append(renderer.domElement);
scene.add(new THREE.HemisphereLight('#f9fcff','#897a67',1.35));const sun=new THREE.DirectionalLight('#fff2db',2.65);sun.position.set(7,12,3);sun.target.position.set(0,0,-5);scene.add(sun.target);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:.5,far:45});sun.shadow.bias=-.0003;sun.shadow.normalBias=.02;scene.add(sun);scene.add(new THREE.AmbientLight('#e2ecf2',.18));for(const [x,y,z,intensity,range] of [[-4.12,1.45,5.65,1.4,3],[-2,3.3,-4.5,8,8],[.1,2.4,-17.4,2,4]]){const light=new THREE.PointLight('#ffe8c4',intensity,range,2);light.position.set(x,y,z);scene.add(light)}
// One connected architectural world: the same objects persist throughout the visit.
box(25,.28,34,0,-.17,-5,'#c7c3b7');box(21,.08,29,0,.01,-5,'#dfdcd2');
for(let i=0;i<22;i++)box(.025,.005,29,-10+i*.95,.055,-5,'#d2cdc2');
box(21,4.7,.2,0,2.35,-19.5,'#e6e8e1');box(.2,4.7,29,-10.5,2.35,-5,'#eaebe5');
// Tall blue window frames and the world beyond them.
box(.15,4.7,29,10.5,2.35,-5,'#c6d9de',scene,{transparent:true,opacity:.28});
for(let z=-18;z<10;z+=3.5){box(.18,4.7,.12,10.35,2.35,z,'#435462');box(.2,.1,3.5,10.35,2.5,z+1.75,'#435462');}
box(100,.3,100,0,-.5,0,'#b9c6b9');
for(let i=0;i<12;i++){const x=15+(i%3)*4,z=-28+i*4;box(2.2,2+i%3,2.5,x,(2+i%3)/2-.4,z,'#bac6c2');}
// Reception, wall sign and slatted timber backdrop.
box(6.4,3.6,.18,2.4,1.8,3.1,'#e8e7de');for(let i=0;i<17;i++)box(.055,3.6,.07,-.7+i*.39,1.8,3.23,'#c5b298');
label('machdubit',4.5,.85,2.4,2.5,3.3,{bg:'#e8e7de',fg:'#252659',size:150});label('TECH SOLUTIONS',3,.32,2.4,1.9,3.31,{bg:'#e8e7de',fg:'#354e67',size:65});
box(4.6,1.05,1.05,2.4,.55,5.1,'#dadcd5');box(4.75,.08,1.2,2.4,1.12,5.1,'#b79770');box(4.4,.1,.03,2.4,.12,5.64,'#48a9e1');desk(3.8,4.85,Math.PI);plant(-.6,4.8,1.2);plant(5.7,3.9,1.5);
// Founder's workstation: desk and chair in front of the founder display.
box(3.5,.025,3,-5,.07,6,'#a8bac3');const founderDesk=desk(-5,5.8);founderDesk.scale.x=1.28;chair(-5,6.85);plant(-8,6,1.2);
// Main studio is visible through an open doorway from reception.
for(const x of[-5,-2.3,1]){desk(x,-2.6);chair(x,x===-2.3?-1.95:-1.75);desk(x,-6.4,Math.PI);chair(x,x===1?-7:-7.2,Math.PI);}
box(9,.025,7,-2,.07,-4.4,'#b4bdba'); // rug, below furniture
box(9,.14,.12,-2,3.5,-4.5,'#3e4b51');for(const x of[-5,-2,1]){box(1.8,.06,.32,x,3.45,-4.5,'#ecede3');box(1.65,.015,.26,x,3.41,-4.5,'#ffffe2',scene,{emissive:'#fff5db',emissiveIntensity:.6});}
plant(-8.5,-8.5,1.4);
// Pinboard: graphic work materials rather than fabricated clients or product screens.
box(3.4,2,.12,-6.8,1.8,-11,'#b39979');for(let i=0;i<6;i++)box(.7,.55,.025,-7.8+(i%3)*1,1.35+Math.floor(i/3)*.8,-10.92,i%3?'#e9e5d8':'#70a6c4');
// Glass systems room, racks and connected desk.
box(4,.025,4,6,.08,-4.5,'#c1c9c6');box(.08,3.3,6,3.4,1.65,-6,'#a7c6cd',scene,{transparent:true,opacity:.18,depthWrite:false});for(const z of[-3,-9])box(.1,3.3,.1,3.4,1.65,z,'#53656b');
for(const x of[5,6.3]){box(.85,2.15,.75,x,1.1,-7.5,'#35434f');for(let j=0;j<8;j++){box(.72,.15,.03,x,.3+j*.23,-7.1,'#556570');box(.035,.035,.035,x+.25,.3+j*.23,-7.07,'#75c4d4',scene,{emissive:'#75c4d4',emissiveIntensity:.5});}}
desk(6,-3.5);chair(6,-2.35);plant(8.9,-7.5,1.6);

// Ride263 alcove, with an intentionally textual development presentation.
box(5.6,3.5,.18,5.8,1.75,-14.2,'#252659');label('Ride263',3.4,.55,5.8,3,-14.07,{bg:'#252659',fg:'#ffffff',size:160});label('IN DEVELOPMENT',2.8,.28,5.8,2.52,-14.06,{bg:'#252659',fg:'#88caed',size:65});

const previewLoader=new THREE.TextureLoader();
for(const [x,file] of [[4.55,'fare-preview.webp'],[7.05,'safety-preview.webp']]){
 box(.88,1.5,.05,x,1.48,-14.05,'#19223f');
 const texture=previewLoader.load('./assets/ride263/'+file,requestRender,undefined,()=>{});texture.colorSpace=THREE.SRGBColorSpace;
 const poster=new THREE.Mesh(new THREE.PlaneGeometry(.81,1.44),new THREE.MeshBasicMaterial({map:texture}));poster.position.set(x,1.48,-14.015);scene.add(poster);
}

box(2.3,.12,1.2,5.8,.85,-12.3,'#b79770');for(const x of[4.9,6.7])box(.08,.8,.75,x,.4,-12.3,'#d3d6ce');
// A small standing display is already here in the world before the camera approaches.
box(.65,.95,.07,5.8,1.38,-12.3,'#263c4b');label('Ride263',.58,.72,5.8,1.4,-12.25,{bg:'#e3edf0',fg:'#252659',size:170});box(.3,.04,.25,5.8,.94,-12.3,'#263c4b');plant(8.7,-13.2,1.2);
// Rear meeting area. Furniture dimensions remain constant throughout the route.
box(6,.035,5,-3,.08,-15.4,'#a9b6b7');box(3.3,.12,1.45,-3,.87,-15.4,'#b69770');for(const x of[-4.2,-1.8])box(.12,.8,.7,x,.4,-15.4,'#394752');for(const x of[-4,-2]){chair(x,-14.15,0);chair(x,-16.65,Math.PI)}
box(.7,.02,.45,-3,.95,-15.4,'#f5f0e6');cyl(.1,.08,.3,-3.85,1.08,-15.4,'#cad3cb');
label('Let’s talk.',2.6,.65,-4.5,2.4,-19.36,{bg:'#e6e8e1',fg:'#252659',size:110});plant(-8.3,-17.8,1.7);
// Low cabinetry, books and framed material swatches fill the perimeter.
box(.6,1,5,-9.8,.5,-13,'#ba9c7b');for(let i=0;i<12;i++)box(.25,.25+(i%3)*.1,.12,-9.75,1.2,-15+i*.35,i%2?'#536b83':'#e4ddd0');

// The story, delivery and support live inside the same persistent office.
label('Mpumelelo Dube',3.3,.5,-6.7,2.1,3.32,{bg:'#e8e7de',fg:'#252659',size:110});
label('Founder · Machdubit Tech Solutions',3.3,.35,-6.7,1.65,3.33,{bg:'#e8e7de',fg:'#354e67',size:55});
box(4.6,1.7,.12,-6.3,1.9,3.2,'#e8e7de');
for(const x of[-8,-5.6])box(.07,.8,.3,x,.4,-11,'#53656b');
label('Understand. Build. Launch.',3.8,.45,-6.8,2.55,-10.8,{bg:'#e6e8e1',fg:'#252659',size:75});
desk(.1,-17.4);chair(.1,-16.75);plant(2,-18,1.1);
label('Here to help.',3,.65,.4,2.5,-19.35,{bg:'#e6e8e1',fg:'#252659',size:130});

// A larger founder workstation, with a reading shelf, notebook and task light.
softBox(.46,.035,.32,-5.67,.86,5.96,'#252659');box(.40,.008,.29,-5.67,.883,5.96,'#eee9da');box(.015,.015,.24,-5.48,.9,5.97,'#364653');
box(2.8,1.35,.07,-7.5,.72,3.58,'#ba9c7b');for(const x of[-8.87,-6.13])box(.06,1.35,.45,x,.72,3.8,'#ba9c7b');for(const y of[.22,.77,1.32])box(2.8,.055,.45,-7.5,y,3.8,'#bb9874');
for(let i=0;i<10;i++){const h=.25+(i%3)*.055;box(.10,h,.23,-8.65+i*.19,.8+h/2,3.8,['#405c72','#74847c','#ded8c5'][i%3])}
cyl(.13,.13,.03,-4.12,.86,5.65,'#35424c');box(.025,.65,.025,-4.12,1.19,5.65,'#35424c');const lamp=cyl(.18,.08,.18,-4.12,1.55,5.65,'#c8c7ba');lamp.rotation.z=.2;
contactShadow(2.4,5.1,5.2,1.6);contactShadow(-3,-15.4,4,2.3);

const receptionist=person(2.3,4.15,{angle:Math.PI,shirt:'#252659'});
const studioNear=person(-2.3,-1.95,{seated:true,shirt:'#577b69'});
const studioFar=person(1,-7,{seated:true,angle:Math.PI,shirt:'#527899',skin:'#bb896b'});
const reviewer=person(-5.8,-9.4,{shirt:'#586a87',angle:.5});reviewer.limbs[1].rotation.x=.85;reviewer.limbs[3].rotation.x=.85;softBox(.28,.32,.035,0,1.02,-.38,'#252659',reviewer.group);
const colleague=person(-4.6,-9.7,{shirt:'#a08f77',angle:1.7,skin:'#bc8d6c'});colleague.limbs[3].rotation.x=.8;
const supportPerson=person(.1,-16.75,{seated:true,shirt:'#6b8072',skin:'#bd8e72'});
walker=person(2.3,-1,{shirt:'#a38460'});
officePeople=createOfficePeople(scene,{fallbacks:{reception:receptionist,'studio-near':studioNear,'studio-far':studioFar,reviewer,colleague,support:supportPerson,walker},contactShadow,onChange:requestRender});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.add('no-webgl');cancelAnimationFrame(frame)});renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
}
const positions=new THREE.CatmullRomCurve3(cameraStops.map(p=>new THREE.Vector3(...p.position)),false,'catmullrom',.2);
const looks=new THREE.CatmullRomCurve3(cameraStops.map(p=>new THREE.Vector3(...p.look)),false,'catmullrom',.2);
function updateTarget(){
 const headerBottom=document.querySelector('header').getBoundingClientRect().bottom;
 const chapterTops=sections.map(section=>section.offsetTop);
 target=journeyProgress(scrollY,chapterTops).progress;
 // Browser focus can scroll a sticky control just above its chapter start.
 // Keep that room interactive once its start reaches the fixed header.
 active=journeyProgress(scrollY+headerBottom,chapterTops).active;
 sections.forEach((section,i)=>{const copy=section.querySelector('.copy');const visible=i===active&&copy.getBoundingClientRect().bottom>headerBottom;copy.style.opacity=visible?'1':'0';copy.style.visibility=visible?'visible':'hidden'});
 document.querySelector('#room-name').textContent=names[active];
 document.querySelectorAll('.journey a').forEach((a,i)=>{a.classList.toggle('current',i===active);if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 requestRender();
}
function pose(t){
 const mobile=innerWidth<=800;camera.position.copy(positions.getPoint(t));const look=looks.getPoint(t);
 if(mobile){camera.position.y+=1.8;camera.position.sub(look).multiplyScalar(1.18).add(look)}
 camera.lookAt(look);camera.fov=mobile?52:46;camera.aspect=innerWidth/innerHeight;
 camera.setViewOffset(innerWidth,innerHeight,mobile?0:-innerWidth*.10,mobile?-innerHeight*.23:0,innerWidth,innerHeight);
 camera.updateProjectionMatrix();
}
function render(time){frame=0;if(document.hidden||!renderer)return;const dt=Math.min((time-last)/1000,.1)||.016;last=time;const destination=motion?target:active/(sections.length-1);current=motion?THREE.MathUtils.lerp(current,destination,1-Math.exp(-9*dt)):destination;pose(current);animatePeople(current);renderer.render(scene,camera);if(Math.abs(current-destination)>.0001)frame=requestAnimationFrame(render)}
function requestRender(){if(!frame&&!document.hidden&&renderer&&sections[sections.length-1].getBoundingClientRect().bottom>0)frame=requestAnimationFrame(render)}
function syncMotion(){document.documentElement.dataset.motion=motion?'on':'paused';motionButton.textContent=motion?'Pause motion':'Enable motion';motionButton.setAttribute('aria-pressed',String(motion));updateTarget()}
motionButton.addEventListener('click',()=>{motion=!motion;saved=motion?'on':'off';try{localStorage.setItem('machdubit-motion',saved)}catch{}syncMotion()});osMotion.addEventListener('change',()=>{if(!saved){motion=!osMotion.matches;syncMotion()}});
const details={software:'Bespoke software shaped around your business processes and requirements.',mobile:'Mobile application development, from the first idea to a working application.',web:'Website design and web development for your business and its customers.'};document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-service]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelector('#service-detail').textContent=details[button.dataset.service]}));
addEventListener('scroll',updateTarget,{passive:true});addEventListener('resize',()=>{if(renderer){renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))}updateTarget()});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else requestRender()});document.querySelector('#year').textContent=new Date().getFullYear();
try{build();syncMotion()}catch(error){console.error('Office scene unavailable',error);document.body.classList.add('no-webgl');container.textContent='';syncMotion()}
