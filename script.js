/* DOM */
const passInput=document.getElementById("passInput");
const passwordScreen=document.getElementById("passwordScreen");
const spaceCanvas=document.getElementById("spaceCanvas");
const cinematicIntro=document.getElementById("cinematicIntro");
const main=document.getElementById("main");
const message=document.getElementById("message");
const yesBtn=document.getElementById("yesBtn");
const noBtn=document.getElementById("noBtn");
const bgMusic=document.getElementById("bgMusic");
const petalCanvas=document.getElementById("petalCanvas");
const heart3DContainer=document.getElementById("heart3DContainer");

/* PASSWORD */
function checkPassword(){
 if(passInput.value==="1819"){
  passwordScreen.style.display="none";
  startIntro();
 } else alert("Wrong password ❤️");
}

/* INTRO GALAXY */
let renderer,scene,camera,stars;

function startIntro(){

 renderer=new THREE.WebGLRenderer({
  canvas:spaceCanvas,
  antialias:true
 });

 renderer.setSize(innerWidth,innerHeight);

 scene=new THREE.Scene();
 scene.fog=new THREE.FogExp2(0x1a0033,0.002);

 camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,2000);
 camera.position.z=20;

 const starGeo=new THREE.BufferGeometry();
 const starCount=6000;
 const pos=new Float32Array(starCount*3);

 for(let i=0;i<starCount;i++){
  pos[i*3]=(Math.random()-0.5)*400;
  pos[i*3+1]=(Math.random()-0.5)*400;
  pos[i*3+2]=(Math.random()-0.5)*400;
 }

 starGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));

 stars=new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({size:0.7,transparent:true,opacity:0.9})
 );

 scene.add(stars);

 animateIntro();

 setTimeout(()=>{
  cinematicIntro.style.opacity="0";
  setTimeout(()=>{
   cinematicIntro.style.display="none";
   main.style.display="block";
  },1500);
 },13000);
}

function animateIntro(){
 requestAnimationFrame(animateIntro);

 if(stars){
  stars.rotation.y+=0.0008;
  stars.rotation.x+=0.0003;
 }

 if(camera.position.z>5) camera.position.z-=0.03;

 renderer.render(scene,camera);
}

/* BUTTON GAME LOGIC */
let yesScale=0.5;
let noScale=1;

/* YES CLICK */
yesBtn.onclick=()=>{

 bgMusic.volume=0;
 bgMusic.play();

 let vol=0;
 const fade=setInterval(()=>{
  vol+=0.05;
  if(vol>=1){
   vol=1;
   clearInterval(fade);
  }
  bgMusic.volume=vol;
 },200);

 main.style.display="none";
 message.style.display="block";

 floatingHearts();
 loadHeartModel();
};

/* NO BUTTON — PHONE SAFE */
noBtn.onmouseover = () => {

 const rect = noBtn.getBoundingClientRect();
 const btnWidth = rect.width;
 const btnHeight = rect.height;

 const padding = 12;

 const minX = padding;
 const minY = padding;

 const maxX = window.innerWidth - btnWidth - padding;
 const maxY = window.innerHeight - btnHeight - padding;

 const randomX = Math.random() * (maxX - minX) + minX;
 const randomY = Math.random() * (maxY - minY) + minY;

 noBtn.style.left = randomX + "px";
 noBtn.style.top = randomY + "px";

 /* YES GROW */
 yesScale += 0.15;
 if (yesScale > 5) yesScale = 5;
 yesBtn.style.transform = `scale(${yesScale})`;

 /* SCREEN GLOW */
 if (yesScale > 3) {
  document.body.classList.add("glow");
 }

 /* NO SHRINK */
 noScale -= 0.05;
 if (noScale < 0.4) noScale = 0.4;
 noBtn.style.transform = `scale(${noScale})`;
};

/* FLOAT HEARTS */
let heartsInterval=null;

function floatingHearts(){

 if(heartsInterval) return;

 heartsInterval=setInterval(()=>{
  const heart=document.createElement("div");
  heart.innerHTML="💗";
  heart.style.position="fixed";
  heart.style.left=Math.random()*innerWidth+"px";
  heart.style.bottom="-50px";
  heart.style.fontSize=20+Math.random()*30+"px";
  heart.style.transition="6s linear";
  document.body.appendChild(heart);

  setTimeout(()=>{
   heart.style.bottom=innerHeight+"px";
   heart.style.opacity=0;
  },100);

  setTimeout(()=>heart.remove(),6000);

 },500);
}

/* PETALS */
const ctx=petalCanvas.getContext("2d");

function resizeAll(){
 petalCanvas.width=innerWidth;
 petalCanvas.height=innerHeight;

 if(renderer && camera){
  renderer.setSize(innerWidth,innerHeight);
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
 }
}

window.addEventListener("resize",resizeAll);
window.addEventListener("orientationchange",resizeAll);
resizeAll();

let petals=[];
for(let i=0;i<30;i++){
 petals.push({
  x:Math.random()*innerWidth,
  y:Math.random()*innerHeight,
  size:3+Math.random()*3,
  speed:0.5+Math.random()*1.5,
  sway:Math.random()*2
 });
}

function drawPetals(){
 ctx.clearRect(0,0,innerWidth,innerHeight);
 ctx.fillStyle="rgba(255,182,193,0.8)";

 petals.forEach(p=>{
  ctx.beginPath();
  ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
  ctx.fill();

  p.y+=p.speed;
  p.x+=Math.sin(p.y*0.01)*p.sway;

  if(p.y>innerHeight){
   p.y=0;
   p.x=Math.random()*innerWidth;
  }
 });

 requestAnimationFrame(drawPetals);
}
drawPetals();

/* HEART MODEL */
function loadHeartModel(){

 if(heart3DContainer.innerHTML!=="") return;

 const r=new THREE.WebGLRenderer({alpha:true});
 r.setSize(160,160);
 heart3DContainer.appendChild(r.domElement);

 const s=new THREE.Scene();
 const c=new THREE.PerspectiveCamera(45,1,0.1,100);
 c.position.z=3;

 const light=new THREE.PointLight(0xffffff,1);
 light.position.set(5,5,5);
 s.add(light);

 const loader=new THREE.GLTFLoader();
 loader.load("heart.glb",(gltf)=>{

  const heart=gltf.scene;
  s.add(heart);

  function animate(){
   requestAnimationFrame(animate);
   heart.rotation.y+=0.01;
   r.render(s,c);
  }
  animate();

 });
}
