const PARTICLE_COUNT = 8000;
const SWARM_FORCE = 0.5;
const SHAPE_FORCE = 0.2;
const DAMPING = 0.96;
const PINCH_THRESHOLD = 0.08;

let currentShape = 'swarm';
let targetPositions = null;
let width = window.innerWidth;
let height = window.innerHeight;

let isSwarmMode = true;
let isPinching = false;
let pinchDistance = 0;
let handCenter = new THREE.Vector3();
let indexFingerTip = new THREE.Vector3();
let lastHandTime = 0;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0006);

const camera = new THREE.PerspectiveCamera(75, width / height, 1, 4000);
camera.position.z = 800;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const pPos = new Float32Array(PARTICLE_COUNT * 3);
const pVel = new Float32Array(PARTICLE_COUNT * 3);
const pCol = new Float32Array(PARTICLE_COUNT * 3);
const shapeTargets = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 1000 * Math.random();
    pPos[i * 3] = (Math.random() - 0.5) * r;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * r;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * r;

    const choice = Math.random();
    if (choice < 0.3) {
        pCol[i * 3] = 0.1;
        pCol[i * 3 + 1] = 0.5;
        pCol[i * 3 + 2] = 1.0;
    } else if (choice < 0.5) {
        pCol[i * 3] = 0.6;
        pCol[i * 3 + 1] = 0.0;
        pCol[i * 3 + 2] = 1.0;
    } else if (choice < 0.7) {
        pCol[i * 3] = 1.0;
        pCol[i * 3 + 1] = 0.8;
        pCol[i * 3 + 2] = 0.2;
    } else {
        pCol[i * 3] = 0.0;
        pCol[i * 3 + 1] = 1.0;
        pCol[i * 3 + 2] = 0.9;
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

const material = new THREE.PointsMaterial({
    size: 2.0,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const starGeo = new THREE.BufferGeometry();
const STAR_COUNT = 15000;
const sPos = new Float32Array(STAR_COUNT * 3);
const sCol = new Float32Array(STAR_COUNT * 3);

for (let i = 0; i < STAR_COUNT; i++) {
    const r = 2000 + Math.random() * 3000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    sPos[i * 3 + 2] = r * Math.cos(phi);

    const type = Math.random();
    let c = new THREE.Color();
    if (type > 0.9) c.setHex(0xffaaaa);
    else if (type > 0.7) c.setHex(0xaaccff);
    else c.setHex(0xffffff);

    const brightness = 0.5 + Math.random() * 0.5;
    sCol[i * 3] = c.r * brightness;
    sCol[i * 3 + 1] = c.g * brightness;
    sCol[i * 3 + 2] = c.b * brightness;
}

starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));

const starMat = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    fog: false,
    transparent: true,
    opacity: 0.8
});

const starField = new THREE.Points(starGeo, starMat);
starField.frustumCulled = false;
scene.add(starField);

function generateShape(type) {
    const arr = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let x = 0, y = 0, z = 0;

        if (type === 'heart') {
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;

            const t = phi;
            let hx = 16 * Math.pow(Math.sin(t), 3);
            let hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

            let scale = 15;
            x = hx * scale;
            y = hy * scale;
            z = (Math.random() - 0.5) * 100;

        }
        else if (type === 'saturn') {
            const isRing = Math.random() > 0.4;
            if (isRing) {
                const angle = Math.random() * Math.PI * 2;
                const r = 250 + Math.random() * 150;
                x = Math.cos(angle) * r;
                z = Math.sin(angle) * r;
                y = (Math.random() - 0.5) * 10;
            } else {
                const r = 180;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            }
            const tilt = 0.4;
            const tx = x;
            x = tx * Math.cos(tilt) - y * Math.sin(tilt);
            y = tx * Math.sin(tilt) + y * Math.cos(tilt);
        }
        else if (type === 'flower') {
            const k = 4;
            const theta = Math.random() * Math.PI * 2;
            const r_curve = Math.cos(k * theta);
            const r = 300 * Math.abs(r_curve) + 50;

            x = r * Math.cos(theta);
            y = r * Math.sin(theta);
            z = -r_curve * 100 + (Math.random() - 0.5) * 50;
        }
        else if (type === 'fireworks') {
            const r = 300 + Math.random() * 300;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta);
            z = r * Math.cos(phi);
        }

        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
    }
    return arr;
}

window.setShape = (shape) => {
    currentShape = shape;
    isSwarmMode = (shape === 'swarm');

    if (!isSwarmMode) {
        const targets = generateShape(shape);
        for (let i = 0; i < targets.length; i++) {
            shapeTargets[i] = targets[i];
        }

        document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes(shape));
        if (btn) btn.classList.add('active');
    } else {
        document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        document.querySelector('button').classList.add('active');
    }

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        pVel[i] *= 0.1;
    }
}

window.toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


const videoElement = document.getElementsByClassName('input_video')[0];

function onResults(results) {
    document.getElementById('loading').style.display = 'none';

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        lastHandTime = Date.now();
        const landmarks = results.multiHandLandmarks[0];

        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];

        const vFOV = camera.fov * Math.PI / 180;
        const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
        const visibleWidth = visibleHeight * camera.aspect;

        const x = (1 - indexTip.x - 0.5) * visibleWidth;
        const y = -(indexTip.y - 0.5) * visibleHeight;

        indexFingerTip.lerp(new THREE.Vector3(x, y, 0), 0.85);

        const dx = indexTip.x - thumbTip.x;
        const dy = indexTip.y - thumbTip.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        isPinching = dist < PINCH_THRESHOLD;
        pinchDistance = dist;

        handCenter.copy(indexFingerTip);

    } else {
        isPinching = false;
    }
}

const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
hands.onResults(onResults);

const cameraUtils = new Camera(videoElement, {
    onFrame: async () => await hands.send({ image: videoElement }),
    width: 640, height: 480
});
cameraUtils.start();


let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    material.color.setHex(0xffffff);

    const positions = particles.geometry.attributes.position.array;

    if (isSwarmMode && Date.now() - lastHandTime > 1000) {
        indexFingerTip.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        isPinching = false;
    }

    if (isPinching) {
        const timeScale = time * 3.0;
        const colors = particles.geometry.attributes.color.array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const wave = Math.sin(timeScale + i * 0.005);

            colors[ix] = 0.2 + 0.8 * Math.abs(Math.sin(timeScale + i * 0.001));
            colors[ix + 1] = 0.5 + 0.5 * Math.sin(timeScale + i * 0.002);
            colors[ix + 2] = 1.0;
        }
        particles.geometry.attributes.color.needsUpdate = true;
    } else {
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        let px = positions[ix];
        let py = positions[iy];
        let pz = positions[iz];

        let vx = pVel[ix];
        let vy = pVel[iy];
        let vz = pVel[iz];

        if (isSwarmMode) {
            const dx = indexFingerTip.x - px;
            const dy = indexFingerTip.y - py;
            const dz = indexFingerTip.z - pz;

            const distSq = dx * dx + dy * dy + dz * dz + 100;
            const pull = 2000 / distSq;

            vx += dx * pull * SWARM_FORCE;
            vy += dy * pull * SWARM_FORCE;
            vz += dz * pull * SWARM_FORCE;

            const distToFinger = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
            if (distToFinger < 150) {
                const push = (150 - distToFinger) * 0.05;
                vx -= (dx / distToFinger) * push;
                vy -= (dy / distToFinger) * push;
                vz -= (dz / distToFinger) * push;
            }

            vx += dx * 0.0002;
            vy += dy * 0.0002;
            vz += dz * 0.0002;

            const dist = Math.sqrt(dx * dx + dy * dy + 100);

            vx += (dy / dist) * 0.5;
            vy -= (dx / dist) * 0.5;

            const distFromCenterSq = px * px + py * py + pz * pz;
            if (distFromCenterSq > 500000) {
                vx -= px * 0.0001;
                vy -= py * 0.0001;
                vz -= pz * 0.0001;
            }
        } else {
            const tx = shapeTargets[ix];
            const ty = shapeTargets[iy];
            const tz = shapeTargets[iz];

            let expansion = 1.0;

            const dx = (tx * expansion) - px;
            const dy = (ty * expansion) - py;
            const dz = (tz * expansion) - pz;

            vx += dx * SHAPE_FORCE;
            vy += dy * SHAPE_FORCE;
            vz += dz * SHAPE_FORCE;

            const fdx = indexFingerTip.x - px;
            const fdy = indexFingerTip.y - py;
            const fdist = Math.sqrt(fdx * fdx + fdy * fdy);
            if (fdist < 100) {
                vx -= fdx * 0.1;
                vy -= fdy * 0.1;
            }
        }

        vx += (Math.random() - 0.5) * 0.1;
        vy += (Math.random() - 0.5) * 0.1;
        vz += (Math.random() - 0.5) * 0.1;

        vx *= DAMPING;
        vy *= DAMPING;
        vz *= DAMPING;

        positions[ix] += vx;
        positions[iy] += vy;
        positions[iz] += vz;

        pVel[ix] = vx;
        pVel[iy] = vy;
        pVel[iz] = vz;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    scene.rotation.y = Math.sin(time * 0.1) * 0.1;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

animate();
