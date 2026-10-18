import * as THREE from './assets/vendor/three.module.js';

const container=document.querySelector('#office');
const sections=[...document.querySelectorAll('.chapter')];
const names=['Reception','Our story','The studio','Connected systems','The project room','The product desk','Support workspace','Let’s talk'];
const motionButton=document.querySelector('#motion');
const osMotion=matchMedia('(prefers-reduced-motion: reduce)');
let saved=null;try{saved=localStorage.getItem('machdubit-motion')}catch{}
let motion=saved?saved==='on':!osMotion.matches;
let renderer,scene,camera,frame=0,current=0,target=0,last=0,active=0;
const materials=new Map(),geometries=new Map();
function mat(color,extra={}){const key=JSON.stringify([color,extra]);if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.72,...extra}));return materials.get(key)}
function box(w,h,d,x,y,z,color,parent=scene,extra={}){const key=`${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new THREE.BoxGeometry(w,h,d));const mesh=new THREE.Mesh(geometries.get(key),mat(color,extra));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cyl(r1,r2,h,x,y,z,color,parent=scene){const key=`c${r1},${r2},${h}`;if(!geometries.has(key))geometries.set(key,new THREE.CylinderGeometry(r1,r2,h,16));const mesh=new THREE.Mesh(geometries.get(key),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function label(text,w,h,x,y,z,{bg='#20284a',fg='#ffffff',size=70}={}){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.round(1024*h/w);const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`500 ${size}px Arial`;ctx.fillText(text,512,canvas.height/2);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));mesh.position.set(x,y,z);scene.add(mesh);return mesh}
function plant(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);cyl(.25,.19,.46,0,.23,0,'#c9c5ba',g);for(let i=0;i<7;i++){const angle=i*2.4;const stem=cyl(.022,.027,.95,Math.sin(angle)*.09,.9,Math.cos(angle)*.09,'#52634a',g);stem.rotation.z=Math.sin(angle)*.2;const leaf=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),mat(i%2?'#5d7856':'#738b5d'));leaf.scale.set(.55,1.8,.9);leaf.position.set(Math.sin(angle)*.2,1.15+(i%3)*.12,Math.cos(angle)*.2);leaf.rotation.z=-Math.sin(angle)*.6;g.add(leaf)}}
function chair(x,z,angle=0,color='#416e8b'){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);box(.62,.14,.58,0,.47,0,color,g);box(.62,.64,.12,0,.8,-.25,color,g);for(const dx of[-.23,.23])for(const dz of[-.2,.2])box(.035,.4,.035,dx,.2,dz,'#303d48',g);return g}
function desk(x,z,angle=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);box(1.65,.09,.8,0,.79,0,'#bb9874',g);for(const dx of[-.7,.7])for(const dz of[-.3,.3])box(.045,.75,.045,dx,.375,dz,'#39434b',g);box(.13,.25,.13,0,.94,-.18,'#35424c',g);box(.9,.54,.05,0,1.25,-.2,'#253546',g);box(.83,.46,.01,0,1.25,-.167,'#83b6c7',g);for(let i=0;i<4;i++)box(.45-i*.05,.014,.012,-.12,1.37-i*.065,-.155,i%2?'#e0eee7':'#38667b',g);box(.45,.025,.17,0,.85,.17,'#dce1df',g);box(.12,.02,.17,.4,.85,.18,'#303d48',g);box(.2,.015,.29,-.57,.85,.1,'#f1eee5',g);cyl(.055,.055,.12,.59,.9,-.05,'#e6e0d2',g);return g}
function build(){scene=new THREE.Scene();scene.background=new THREE.Color('#dbe0dc');scene.fog=new THREE.Fog('#dbe0dc',24,65);camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100);renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;container.append(renderer.domElement);
scene.add(new THREE.HemisphereLight('#f9fcff','#9b8c77',2.5));const sun=new THREE.DirectionalLight('#fff2d8',3.3);sun.position.set(5,13,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:.5,far:45});sun.shadow.bias=-.0006;scene.add(sun);scene.add(new THREE.AmbientLight('#e2ecf2',.5));
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
box(3.5,.025,3,-5,.07,6,'#a8bac3');desk(-5,5.8);chair(-5,7);plant(-8,6,1.2);
// Main studio is visible through an open doorway from reception.
for(const x of[-5,-2.3,1]){desk(x,-2.6);chair(x,-1.4);desk(x,-6.4,Math.PI);chair(x,-7.5,Math.PI);}
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
box(5.6,3.5,.18,5.8,1.75,-14.2,'#252659');label('Ride263',4.4,1.3,5.8,2.2,-14.08,{bg:'#252659',fg:'#ffffff',size:210});label('IN DEVELOPMENT',3.5,.4,5.8,1.35,-14.07,{bg:'#252659',fg:'#88caed',size:65});
box(2.3,.12,1.2,5.8,.85,-12.3,'#b79770');for(const x of[4.9,6.7])box(.08,.8,.75,x,.4,-12.3,'#d3d6ce');
// A small standing display is already here in the world before the camera approaches.
box(.65,.95,.07,5.8,1.38,-12.3,'#263c4b');label('Ride263',.58,.72,5.8,1.4,-12.25,{bg:'#e3edf0',fg:'#252659',size:170});box(.3,.04,.25,5.8,.94,-12.3,'#263c4b');plant(8.7,-13.2,1.2);
// Rear meeting area. Furniture dimensions remain constant throughout the route.
box(6,.035,5,-3,.08,-15.4,'#a9b6b7');box(3.3,.12,1.45,-3,.87,-15.4,'#b69770');for(const x of[-4.2,-1.8])box(.12,.8,.7,x,.4,-15.4,'#394752');for(const x of[-4,-2]){chair(x,-14.15,0);chair(x,-16.65,Math.PI)}
box(.7,.02,.45,-3,.95,-15.4,'#f5f0e6');cyl(.1,.08,.3,-3.85,1.08,-15.4,'#cad3cb');
label('Let’s make it work.',5,.8,-3.8,2.5,-19.36,{bg:'#e6e8e1',fg:'#252659',size:115});plant(-8.3,-17.8,1.7);
// Low cabinetry, books and framed material swatches fill the perimeter.
box(.6,1,5,-9.8,.5,-13,'#ba9c7b');for(let i=0;i<12;i++)box(.25,.25+(i%3)*.1,.12,-9.75,1.2,-15+i*.35,i%2?'#536b83':'#e4ddd0');

// The story, delivery and support live inside the same persistent office.
label('Mpumelelo Dube',3.3,.5,-5,2.1,3.32,{bg:'#e8e7de',fg:'#252659',size:110});
label('Founder · Machdubit Tech Solutions',3.3,.35,-5,1.65,3.33,{bg:'#e8e7de',fg:'#354e67',size:55});
box(3.8,1.7,.12,-5,1.9,3.2,'#e8e7de');
for(const x of[-8,-5.6])box(.07,.8,.3,x,.4,-11,'#53656b');
label('Understand. Build. Launch.',3.8,.45,-6.8,2.55,-10.8,{bg:'#e6e8e1',fg:'#252659',size:75});
desk(.1,-17.4);chair(.1,-16.2);plant(2,-18,1.1);
label('Here to help.',3,.65,.4,2.5,-19.35,{bg:'#e6e8e1',fg:'#252659',size:130});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.add('no-webgl');cancelAnimationFrame(frame)});renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
}
const positions=new THREE.CatmullRomCurve3([[7.6,3.7,12.5],[-2,3,9.5],[5.8,4.4,.5],[2.1,3.1,-.4],[1,3.7,-7],[5,3.1,-6],[1.8,3.8,-12.5],[1.8,3.8,-10.7]].map(p=>new THREE.Vector3(...p)),false,'catmullrom',.35);
const looks=new THREE.CatmullRomCurve3([[2.4,1.3,4.5],[-5,1.2,5.8],[-3.5,.8,-4.6],[6,1,-5.6],[-5.5,1.5,-10.5],[6,1.6,-13],[0,1,-17.5],[-3.2,.9,-15.5]].map(p=>new THREE.Vector3(...p)),false,'catmullrom',.35);
function updateTarget(){const y=scrollY;const height=sections[0].offsetHeight;const progress=y/height;const segment=Math.floor(progress);const f=THREE.MathUtils.clamp((progress-segment-.30)/.70,0,1);const eased=f*f*f*(f*(f*6-15)+10);target=THREE.MathUtils.clamp((segment+eased)/(sections.length-1),0,1);active=Math.max(0,Math.min(sections.length-1,Math.floor(progress+.02)));sections.forEach((section,i)=>{const copy=section.querySelector('.copy');const visible=i===active&&copy.getBoundingClientRect().top>=document.querySelector('header').getBoundingClientRect().bottom;copy.style.opacity=visible?'1':'0';copy.style.visibility=visible?'visible':'hidden'});document.querySelector('#room-name').textContent=names[active];document.querySelectorAll('.journey a').forEach((a,i)=>{a.classList.toggle('current',i===active);if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});requestRender()}
function pose(t){const mobile=innerWidth<=800;camera.position.copy(positions.getPoint(t));const look=looks.getPoint(t);if(mobile){camera.position.y+=3;camera.position.x+=1.6;look.y+=2.4;}else{const early=THREE.MathUtils.smoothstep(t,1/7,2/7);const intro=THREE.MathUtils.lerp(2.3,1.5,THREE.MathUtils.smoothstep(t,0,1/7));look.x-=THREE.MathUtils.lerp(intro,3.6,early)-1.6*Math.exp(-Math.pow((t-5/7)/.12,2));}camera.lookAt(look);camera.fov=mobile?61:48;camera.updateProjectionMatrix()}
function render(time){frame=0;if(document.hidden||!renderer)return;const dt=Math.min((time-last)/1000,.1)||.016;last=time;const destination=motion?target:active/(sections.length-1);current=motion?THREE.MathUtils.lerp(current,destination,1-Math.exp(-9*dt)):destination;pose(current);renderer.render(scene,camera);if(Math.abs(current-destination)>.0001)frame=requestAnimationFrame(render)}
function requestRender(){if(!frame&&!document.hidden&&renderer)frame=requestAnimationFrame(render)}
function syncMotion(){document.documentElement.dataset.motion=motion?'on':'paused';motionButton.textContent=motion?'Pause motion':'Enable motion';motionButton.setAttribute('aria-pressed',String(motion));updateTarget()}
motionButton.addEventListener('click',()=>{motion=!motion;saved=motion?'on':'off';try{localStorage.setItem('machdubit-motion',saved)}catch{}syncMotion()});osMotion.addEventListener('change',()=>{if(!saved){motion=!osMotion.matches;syncMotion()}});
const details={software:'Bespoke software shaped around your business processes and requirements.',mobile:'Mobile application development, from the first idea to a working application.',web:'Website design and web development for your business and its customers.'};document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-service]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelector('#service-detail').textContent=details[button.dataset.service]}));
addEventListener('scroll',updateTarget,{passive:true});addEventListener('resize',()=>{if(renderer){renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))}updateTarget()});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else requestRender()});document.querySelector('#year').textContent=new Date().getFullYear();
try{build();syncMotion()}catch(error){console.error('Office scene unavailable',error);document.body.classList.add('no-webgl');container.textContent='';syncMotion()}
