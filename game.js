import * as THREE from 'three';

const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#72928f');
scene.fog = new THREE.FogExp2('#829b94', 0.0085);
const camera = new THREE.PerspectiveCamera(57, innerWidth / innerHeight, 0.1, 260);
camera.position.set(0, 5.3, 10.5);
camera.lookAt(0, 1.2, -15);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
scene.add(new THREE.HemisphereLight('#d4eee5', '#323b4d', 2.1));
const sun = new THREE.DirectionalLight('#fff0d3', 2.8); sun.position.set(-7, 18, 8); scene.add(sun);
const glow = new THREE.PointLight('#78f4db', 18, 38, 1.5); glow.position.set(0, 4, -10); scene.add(glow);

const mats = {
  sea: new THREE.MeshStandardMaterial({ color: '#496e70', roughness: .33, metalness: .24 }),
  edge: new THREE.MeshStandardMaterial({ color: '#182b37', roughness: .75 }),
  cyan: new THREE.MeshStandardMaterial({ color: '#77f5df', emissive: '#32bfae', emissiveIntensity: 1.45, metalness: .28, roughness: .25 }),
  coral: new THREE.MeshStandardMaterial({ color: '#ff806b', emissive: '#c83e31', emissiveIntensity: 1.25, metalness: .2, roughness: .3 }),
  gold: new THREE.MeshStandardMaterial({ color: '#ffe8a0', emissive: '#c19132', emissiveIntensity: 1.0, metalness: .65, roughness: .22 }),
  board: new THREE.MeshStandardMaterial({ color: '#f3edda', roughness: .26, metalness: .3 }),
  dark: new THREE.MeshStandardMaterial({ color: '#172936', roughness: .38, metalness: .32 }),
  rock: new THREE.MeshStandardMaterial({ color: '#c77361', roughness: .8, flatShading: true }),
  mist: new THREE.MeshBasicMaterial({ color: '#d8b095', transparent: true, opacity: .14, side: THREE.DoubleSide }),
};
const world = new THREE.Group(); scene.add(world);

// A wide, subtly banked sheet of tidal glass, cut into luminous contour strips.
const groundGeo = new THREE.PlaneGeometry(19, 240, 24, 120);
const positions = groundGeo.attributes.position;
for (let i = 0; i < positions.count; i++) {
  const x = positions.getX(i), y = positions.getY(i);
  positions.setZ(i, Math.sin(x * .52 + y * .075) * .22 + Math.sin(y * .14) * .14);
}
groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(groundGeo, mats.sea); ground.rotation.x = -Math.PI / 2; ground.position.set(0, -.2, -105); world.add(ground);
const lineMat = new THREE.MeshBasicMaterial({ color: '#a1e9d8', transparent: true, opacity: .18 });
for (let i = 0; i < 13; i++) {
  const line = new THREE.Mesh(new THREE.BoxGeometry(18.9, .022, .035), lineMat);
  line.position.set(0, -.025, -7 - i * 18); world.add(line);
}
for (const x of [-9.15, 9.15]) {
  const rail = new THREE.Mesh(new THREE.BoxGeometry(.22, .42, 240), mats.edge); rail.position.set(x, .12, -105); world.add(rail);
  const railLight = new THREE.Mesh(new THREE.BoxGeometry(.045, .045, 240), mats.cyan); railLight.position.set(x * .98, .36, -105); world.add(railLight);
}

// Distant salt monoliths establish the new Glass Tidelands level.
const monoliths = [];
for (let i = 0; i < 28; i++) {
  const side = i % 2 ? 1 : -1;
  const h = 3 + Math.random() * 12;
  const geo = new THREE.ConeGeometry(1.5 + Math.random() * 2.2, h, 5);
  const mat = new THREE.MeshStandardMaterial({ color: i % 3 ? '#536c70' : '#9a7770', roughness: .88, flatShading: true });
  const monolith = new THREE.Mesh(geo, mat);
  monolith.position.set(side * (12 + Math.random() * 25), h * .42 - .5, -12 - i * 8.2);
  monolith.rotation.z = side * (Math.random() * .18);
  world.add(monolith); monoliths.push(monolith);
}
// Soft haze bands over the horizon.
for (let i = 0; i < 4; i++) {
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(95, 10), mats.mist);
  haze.position.set(0, 5 + i * 2.5, -68 - i * 27); world.add(haze);
}

// Boarder silhouette, built from simple low-poly pieces.
const rider = new THREE.Group(); world.add(rider); rider.position.set(0, .35, 0);
const board = new THREE.Mesh(new THREE.CylinderGeometry(.13, .22, 3.2, 8), mats.board);
board.rotation.z = Math.PI / 2; board.rotation.x = .08; board.position.y = -.12; rider.add(board);
const deckStripe = new THREE.Mesh(new THREE.BoxGeometry(1.55, .045, .1), mats.coral); deckStripe.position.y = .015; rider.add(deckStripe);
const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.28, .62, 3, 6), mats.dark); torso.position.set(0, .73, .03); torso.rotation.x = -.3; rider.add(torso);
const jacket = new THREE.Mesh(new THREE.CapsuleGeometry(.22, .4, 3, 5), mats.coral); jacket.position.set(0, .72, -.14); jacket.rotation.x = -.32; rider.add(jacket);
const head = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), mats.board); head.position.set(0, 1.24, -.1); rider.add(head);
const visor = new THREE.Mesh(new THREE.BoxGeometry(.34, .095, .25), mats.cyan); visor.position.set(0, 1.27, -.27); rider.add(visor);
for (const s of [-1, 1]) {
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(.075, .095, .42, 6), mats.dark);
  leg.position.set(s * .18, .24, -.08); leg.rotation.x = -.22; rider.add(leg);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .42, 6), mats.board);
  arm.position.set(s * .33, .77, -.16); arm.rotation.z = s * .55; arm.rotation.x = -.42; rider.add(arm);
}
const riderHalo = new THREE.PointLight('#77f5df', 4, 5, 2); riderHalo.position.set(0, .7, .5); rider.add(riderHalo);

const obstacles = [];
const shapes = new THREE.IcosahedronGeometry(.8, 0);
const shardGeo = new THREE.OctahedronGeometry(.48, 0);
const gateGeo = new THREE.BoxGeometry(17.2, 3.6, .35);
function addGate(target, phase) {
  const group = new THREE.Group();
  const material = phase === 0 ? mats.cyan : mats.coral;
  const frame = new THREE.Mesh(gateGeo, new THREE.MeshStandardMaterial({ color: phase === 0 ? '#7df5df' : '#ff816e', emissive: phase === 0 ? '#36bca9' : '#c44137', emissiveIntensity: .8, transparent: true, opacity: .32, side: THREE.DoubleSide }));
  frame.position.y = 1.65; group.add(frame);
  for (const x of [-8.35, 8.35]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(.22, 3.7, .24), material); post.position.set(x, 1.65, 0); group.add(post);
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(17.0, .15, .3), material); top.position.y = 3.48; group.add(top);
  const badge = new THREE.Mesh(new THREE.OctahedronGeometry(.57, 0), material); badge.position.set(0, 2.35, .35); group.add(badge);
  group.position.set(0, -.08, -(target - distance)); world.add(group);
  obstacles.push({ type: 'gate', target, phase, mesh: group, checked: false });
}
function addRock(target, lane) {
  const mesh = new THREE.Mesh(shapes, mats.rock); mesh.scale.set(.9 + Math.random() * .45, .8 + Math.random() * .55, .75 + Math.random() * .4);
  mesh.position.set(lane, .65, -(target - distance)); mesh.rotation.set(Math.random(), Math.random(), Math.random()); world.add(mesh);
  obstacles.push({ type: 'rock', target, lane, mesh, checked: false });
}
function addShard(target, lane) {
  const mesh = new THREE.Mesh(shardGeo, mats.gold); mesh.position.set(lane, 1.05, -(target - distance)); world.add(mesh);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(.68, .035, 5, 16), mats.cyan); loop.position.copy(mesh.position); world.add(loop);
  obstacles.push({ type: 'shard', target, lane, mesh, loop, checked: false });
}
let distance = 0, speed = 26, xPos = 0, steerTarget = 0, phase = 0, shards = 0;
let running = false, paused = false, ended = false, lastTime = 0, animationTime = 0;
let nextPattern = 52, nextRock = 26, nextShard = 18, waveAnnounced = false, surge = false;
let screenShake = 0, toastTimer = 0, messageTimer = 0, soundOn = false;
let audioContext = null;
const laneXs = [-5.2, 0, 5.2];
const setPhase = (value) => {
  phase = value;
  $('phase-name').textContent = phase ? 'CORAL' : 'AZURE';
  $('mobile-phase').textContent = phase ? 'CORAL' : 'AZURE';
  $('phase-pill').classList.toggle('coral', !!phase);
  riderHalo.color.set(phase ? '#ff816e' : '#77f5df');
  riderHalo.intensity = 5;
};
function tone(freq = 440, duration = .08, wave = 'sine', volume = .035) {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator(), gain = audioContext.createGain();
    osc.type = wave; osc.frequency.value = freq; gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    osc.connect(gain); gain.connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + duration);
  } catch {}
}
function showToast(text, color = '') {
  $('toast').textContent = text; $('toast').style.color = color || '';
  $('toast').classList.add('show'); toastTimer = 1.25;
}
function centerMessage(text, color = '') {
  $('message-copy').textContent = text; $('center-message').style.color = color || '';
  $('center-message').classList.add('show'); messageTimer = .8;
}
function makeRun() {
  for (const o of obstacles) { world.remove(o.mesh); if (o.loop) world.remove(o.loop); }
  obstacles.length = 0; distance = 0; speed = 26; xPos = 0; steerTarget = 0; shards = 0;
  nextPattern = 52; nextRock = 25; nextShard = 16; waveAnnounced = false; surge = false; screenShake = 0;
  $('distance').textContent = '000'; $('shards').textContent = '00'; $('progress-fill').style.width = '0%';
  setPhase(0); rider.position.set(0, .35, 0); rider.rotation.set(0, 0, 0);
  const patternSeed = [0, 1, 1, 0, 0, 1];
  let pi = 0;
  for (let d = 48; d < 970; d += 82) {
    addGate(d, patternSeed[pi++ % patternSeed.length]);
    const blockedLane = laneXs[(pi + 1) % 3];
    addRock(d + 23, blockedLane);
    addShard(d + 38, laneXs[(pi + 2) % 3]);
  }
  for (let d = 510; d < 900; d += 70) {
    addGate(d + 22, (Math.floor(d / 70) + 1) % 2);
    addShard(d + 49, laneXs[Math.floor(d / 70) % 3]);
  }
  running = true; paused = false; ended = false; lastTime = performance.now();
}
function beginRun() {
  $('intro-screen').classList.add('hidden'); $('result-screen').classList.add('hidden'); $('pause-screen').classList.add('hidden');
  $('pause-button').classList.remove('hidden'); $('hud').style.display = 'flex';
  makeRun(); tone(220, .2, 'triangle', .05);
}
function shiftPhase() {
  if (!running || paused || ended) return;
  setPhase(1 - phase); centerMessage('PHASE SHIFT', phase ? '#ff816e' : '#83f4df'); tone(phase ? 350 : 540, .12, 'triangle');
}
function collision(type, obj) {
  if (type === 'gate' && obj.phase === phase) { centerMessage('CLEAN PHASE', phase ? '#ff816e' : '#83f4df'); tone(720, .13, 'sine'); return; }
  if (type === 'shard') { shards++; $('shards').textContent = String(shards).padStart(2, '0'); tone(860, .11, 'sine'); return; }
  screenShake = .28; $('flash').classList.remove('hit'); void $('flash').offsetWidth; $('flash').classList.add('hit');
  speed = Math.max(14, speed - (type === 'gate' ? 8 : 6));
  showToast(type === 'gate' ? 'WRONG TIDE — PHASE MISMATCH' : 'ROCK BREAK — FIND YOUR LINE', '#ff816e'); tone(105, .23, 'sawtooth', .055);
}
function finishRun(won = false) {
  if (ended) return;
  running = false; ended = true; $('pause-button').classList.add('hidden');
  const meters = Math.floor(distance);
  $('final-distance').innerHTML = `${String(meters).padStart(3, '0')}<small>m</small>`;
  $('final-shards').textContent = String(shards).padStart(2, '0');
  $('result-kicker').textContent = won ? 'TIDELANDS CLEARED' : 'RUN ENDED';
  $('result-title').innerHTML = won ? 'YOU RODE<br/><em>THE TIDE.</em>' : 'THE TIDE<br/><em>WON.</em>';
  $('result-note').textContent = won ? 'A new line opens beyond the horizon.' : 'The horizon is still out there.';
  $('result-screen').classList.remove('hidden');
  const best = Number(localStorage.getItem('slipstream-best') || 0);
  if (meters > best) localStorage.setItem('slipstream-best', meters);
  $('best-score').textContent = `${Math.max(best, meters)}m`;
  tone(won ? 660 : 130, .45, 'triangle', .05);
}

// Procedural wave of trackside lights and dust flecks.
const dust = new THREE.Group(); world.add(dust);
for (let i = 0; i < 160; i++) {
  const p = new THREE.Mesh(new THREE.SphereGeometry(.025 + Math.random() * .035, 4, 4), new THREE.MeshBasicMaterial({ color: i % 3 ? '#d9e8d0' : '#ffb49a', transparent: true, opacity: .42 }));
  p.position.set((Math.random() - .5) * 24, Math.random() * 8, -Math.random() * 150); dust.add(p);
}
function update(dt) {
  if (!running || paused) return;
  animationTime += dt;
  speed = Math.min(37, speed + dt * .12);
  distance += speed * dt;
  if (distance >= 900) { distance = 900; $('distance').textContent = '900'; $('progress-fill').style.width = '100%'; finishRun(true); return; }
  $('distance').textContent = String(Math.floor(distance)).padStart(3, '0');
  $('progress-fill').style.width = `${Math.min(100, distance / 9)}%`;
  xPos += (steerTarget - xPos) * Math.min(1, dt * 7.5); xPos = THREE.MathUtils.clamp(xPos, -7.3, 7.3);
  rider.position.x = xPos; rider.position.y = .35 + Math.sin(animationTime * 8) * .055;
  rider.rotation.z = THREE.MathUtils.clamp((steerTarget - xPos) * -.11, -.16, .16);
  rider.rotation.x = Math.sin(animationTime * 2.8) * .025;
  camera.position.x += (xPos * .22 - camera.position.x) * Math.min(1, dt * 2.2);
  camera.lookAt(xPos * .12, 1.2, -15);
  glow.position.x = xPos * .25;
  if (screenShake > 0) { screenShake -= dt; camera.position.x += (Math.random() - .5) * .18; }
  for (const o of obstacles) {
    const z = -(o.target - distance); o.mesh.position.z = z;
    if (o.loop) { o.loop.position.set(o.mesh.position.x, 1.05 + Math.sin(animationTime * 4 + o.target) * .16, z); o.mesh.rotation.y += dt * 1.8; o.loop.rotation.z -= dt * .8; }
    if (o.type === 'gate') o.mesh.children[3].rotation.y += dt * 1.4;
    if (!o.checked && z > -.25 && z < 1.3) {
      o.checked = true;
      if (o.type === 'shard') {
        if (Math.abs(xPos - o.lane) < 1.75) collision('shard', o);
      } else if (o.type === 'rock') {
        if (Math.abs(xPos - o.lane) < 1.55) collision('rock', o);
      } else collision('gate', o);
    }
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i]; if (o.target < distance - 8) { world.remove(o.mesh); if (o.loop) world.remove(o.loop); obstacles.splice(i, 1); }
  }
  for (const p of dust.children) { p.position.z += speed * dt * .65; if (p.position.z > 8) { p.position.z = -145; p.position.x = (Math.random() - .5) * 24; } }
  if (!waveAnnounced && distance > 445) { waveAnnounced = true; surge = true; showToast('TIDAL SURGE INCOMING — GATES CLOSER', '#83f4df'); tone(300, .5, 'triangle', .04); }
  if (toastTimer > 0 && (toastTimer -= dt) <= 0) $('toast').classList.remove('show');
  if (messageTimer > 0 && (messageTimer -= dt) <= 0) $('center-message').classList.remove('show');
}
function frame(now) {
  const dt = Math.min(.04, (now - (lastTime || now)) / 1000); lastTime = now;
  update(dt); renderer.render(scene, camera); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function steer(direction) { steerTarget = THREE.MathUtils.clamp(steerTarget + direction * 2.8, -7.2, 7.2); }
window.addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight', ' ', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') steer(-1);
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') steer(1);
  if (event.code === 'Space' || event.key.toLowerCase() === 'x') shiftPhase();
  if (event.key.toLowerCase() === 'p' || event.key === 'Escape') togglePause();
  if ((event.key === 'Enter') && !running && !ended) beginRun();
});
function togglePause() {
  if (!running || ended) return;
  paused = !paused; $('pause-screen').classList.toggle('hidden', !paused);
  lastTime = performance.now();
}
$('start-button').addEventListener('click', beginRun);
$('retry-button').addEventListener('click', beginRun);
$('restart-button').addEventListener('click', beginRun);
$('resume-button').addEventListener('click', () => { paused = false; $('pause-screen').classList.add('hidden'); lastTime = performance.now(); });
$('pause-button').addEventListener('click', togglePause);
$('phase-button').addEventListener('pointerdown', (event) => { event.preventDefault(); shiftPhase(); });
for (const button of document.querySelectorAll('[data-steer]')) {
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); steer(Number(button.dataset.steer)); });
}
let touchStart = null;
canvas.addEventListener('pointerdown', (event) => { if (!running || paused || event.pointerType !== 'touch') return; touchStart = { x: event.clientX, y: event.clientY, at: performance.now() }; });
canvas.addEventListener('pointerup', (event) => {
  if (!touchStart) return;
  const dx = event.clientX - touchStart.x;
  if (Math.abs(dx) > 28) steer(dx < 0 ? -1 : 1);
  touchStart = null;
});
$('sound-button').addEventListener('click', () => {
  soundOn = !soundOn; $('sound-icon').textContent = soundOn ? '♫' : '♪';
  if (soundOn) tone(520, .12, 'sine');
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
});
$('best-score').textContent = localStorage.getItem('slipstream-best') ? `${localStorage.getItem('slipstream-best')}m` : '—';
$('hud').style.display = 'none';
setPhase(0);
