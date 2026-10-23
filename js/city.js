import * as THREE from "three";

const perf = localStorage.getItem("GRFT-perf") === "1";
const spectate = new URLSearchParams(location.search).has("spectate") || !localStorage.getItem("GRFT-wallet");
const wallet = localStorage.getItem("GRFT-wallet");

document.getElementById("mode").textContent = spectate ? "SPECTATE" : "PLAY";
document.getElementById("splash-kicker").textContent = spectate ? "NO WALLET / SAN VERANO" : "GRFT / SAN VERANO";
document.getElementById("splash-title").textContent = spectate ? "WATCH THE CITY" : "ENTER SAN VERANO";
if (wallet && wallet !== "0x0000000000000000000000000000000000000000") {
  document.getElementById("cash").textContent = "$240";
  document.getElementById("loadout").textContent = "PISTOL";
}

const clockEl = document.getElementById("clock");
const speedEl = document.getElementById("speed");
const splash = document.getElementById("splash");
setTimeout(() => { splash.style.transition = "opacity .8s"; splash.style.opacity = "0"; }, 2200);

function pad(n) { return String(n).padStart(2, "0"); }
function tickClock() {
  const d = new Date();
  clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
}
tickClock();
setInterval(tickClock, 10000);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1418);
scene.fog = new THREE.Fog(0x1a1418, 40, 180);

const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 420);
camera.position.set(0, 16, 72);

const renderer = new THREE.WebGLRenderer({ antialias: !perf, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, perf ? 1 : 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
if (!perf) renderer.shadowMap.enabled = true;
document.getElementById("view").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x6a5a48, 0.55));
scene.add(new THREE.HemisphereLight(0xffc9a0, 0x1a2230, 0.85));
const sun = new THREE.DirectionalLight(0xffb070, 1.55);
sun.position.set(-40, 28, 18);
if (!perf) {
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
}
scene.add(sun);
const moon = new THREE.DirectionalLight(0x7aa0c8, 0.22);
moon.position.set(30, 18, -20);
scene.add(moon);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 240),
  new THREE.MeshStandardMaterial({ color: 0x2a2c26, roughness: 0.96 })
);
ground.rotation.x = -Math.PI / 2;
if (!perf) ground.receiveShadow = true;
scene.add(ground);

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 70),
  new THREE.MeshStandardMaterial({ color: 0x1b3a44, roughness: 0.18, metalness: 0.35 })
);
water.rotation.x = -Math.PI / 2;
water.position.set(0, 0.02, 88);
scene.add(water);

const roadMat = new THREE.MeshStandardMaterial({ color: 0x11130f, roughness: 0.9 });
function road(w, h, x, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, h), roadMat);
  m.position.set(x, 0.04, z);
  scene.add(m);
}
for (let i = -5; i <= 5; i++) road(240, 3.2, 0, i * 18);
for (let i = -5; i <= 5; i++) road(3.2, 240, i * 18, 0);

const lampMat = new THREE.MeshBasicMaterial({ color: 0xffd28a });
for (let i = -4; i <= 4; i += 2) {
  for (let j = -3; j <= 3; j += 2) {
    const lamp = new THREE.PointLight(0xffc07a, perf ? 4 : 8, 22, 2);
    lamp.position.set(i * 18 + 2.2, 5.2, j * 18 + 2.2);
    scene.add(lamp);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), lampMat);
    bulb.position.copy(lamp.position);
    scene.add(bulb);
  }
}

const palette = [0x5a4e3d, 0x6a5a44, 0x3d4640, 0x7a6550, 0x4a453c, 0x8a6f52];
const windowMat = new THREE.MeshBasicMaterial({ color: 0xf2c14e });
const darkWin = new THREE.MeshBasicMaterial({ color: 0x0c1014 });
const buildings = [];

function building(x, z) {
  const w = 4 + Math.random() * 8;
  const d = 4 + Math.random() * 8;
  const h = 6 + Math.random() * (Math.abs(x) + Math.abs(z) < 28 ? 28 : 16);
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: palette[(Math.random() * palette.length) | 0], roughness: 0.86 })
  );
  mesh.position.set(x, h / 2, z);
  if (!perf) { mesh.castShadow = true; mesh.receiveShadow = true; }
  scene.add(mesh);
  buildings.push(mesh);

  const cols = Math.max(2, Math.floor(w / 1.6));
  const rows = Math.max(2, Math.floor(h / 2.1));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.35) continue;
      const lit = Math.random() > 0.42;
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.7), lit ? windowMat : darkWin);
      win.position.set(x - w / 2 + 1 + c * ((w - 2) / Math.max(1, cols - 1)), 1.4 + r * 1.8, z + d / 2 + 0.05);
      scene.add(win);
    }
  }
}

for (let gx = -5; gx <= 5; gx++) {
  for (let gz = -5; gz <= 4; gz++) {
    if (Math.abs(gx) < 1 && Math.abs(gz) < 1) continue;
    if (gz >= 4) continue;
    const x = gx * 18 + (Math.random() - 0.5) * 4;
    const z = gz * 18 + (Math.random() - 0.5) * 4;
    if (Math.hypot(x, z) < 28) continue;
    if (z > 48) continue;
    building(x, z);
  }
}

const cars = [];
const carColors = [0xd2a369, 0xc39462, 0x8d7559, 0xe5d8bb, 0x6b4f32];
for (let i = 0; i < (perf ? 8 : 16); i++) {
  const car = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.7, 3.4),
    new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length], roughness: 0.4, metalness: 0.3 })
  );
  const axis = i % 2 === 0 ? "x" : "z";
  car.userData = {
    axis,
    lane: ((i % 6) - 3) * 18,
    speed: 0.08 + Math.random() * 0.12,
    t: Math.random() * 200,
  };
  car.position.y = 0.5;
  if (axis === "x") car.rotation.y = Math.PI / 2;
  scene.add(car);
  cars.push(car);
}

const keys = {};
addEventListener("keydown", (e) => { keys[e.code] = true; });
addEventListener("keyup", (e) => { keys[e.code] = false; });

let yaw = -0.12;
let pitch = -0.22;
let locked = false;
renderer.domElement.addEventListener("click", () => {
  renderer.domElement.requestPointerLock();
});
document.addEventListener("pointerlockchange", () => {
  locked = document.pointerLockElement === renderer.domElement;
});
document.addEventListener("mousemove", (e) => {
  if (!locked) return;
  yaw -= e.movementX * 0.0022;
  pitch -= e.movementY * 0.0022;
  pitch = Math.max(-1.2, Math.min(0.35, pitch));
});

const vel = new THREE.Vector3();
const dir = new THREE.Vector3();
let last = performance.now();

function animate(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  cars.forEach((car) => {
    car.userData.t += car.userData.speed;
    if (car.userData.axis === "x") {
      car.position.x = ((car.userData.t * 8) % 200) - 100;
      car.position.z = car.userData.lane + 1.2;
    } else {
      car.position.z = ((car.userData.t * 8) % 180) - 90;
      car.position.x = car.userData.lane - 1.2;
    }
  });

  dir.set(0, 0, 0);
  if (keys.KeyW) dir.z -= 1;
  if (keys.KeyS) dir.z += 1;
  if (keys.KeyA) dir.x -= 1;
  if (keys.KeyD) dir.x += 1;
  if (dir.lengthSq()) dir.normalize();

  const sprint = keys.ShiftLeft || keys.ShiftRight;
  const speed = (spectate ? 18 : 14) * (sprint ? 1.7 : 1);
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  vel.copy(forward).multiplyScalar(dir.z * speed);
  vel.addScaledVector(right, dir.x * speed);
  camera.position.addScaledVector(vel, dt);
  if (keys.KeyQ) camera.position.y = Math.max(3, camera.position.y - 8 * dt);
  else if (keys.KeyE) camera.position.y = Math.min(40, camera.position.y + 8 * dt);
  else if (camera.position.y < 8) camera.position.y = 8;
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -90, 90);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -90, 70);

  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  const mph = Math.round(vel.length() * 2.1);
  speedEl.textContent = String(mph);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
