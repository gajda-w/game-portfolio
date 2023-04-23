import { CharacterControls } from "./characterControls";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// SCENE
const textureLoader = new THREE.TextureLoader();
const modelLoader = new GLTFLoader();
const scene = new THREE.Scene();
const sceneBackgroundTexture = textureLoader.load(
  "textures/sky-background.avif"
);
scene.background = sceneBackgroundTexture;

// CAMERA
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 3;
camera.position.z = 13;
camera.position.x = 15;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.update();

// LIGHTS
light();

// FLOOR
generateFloor();

// SOUND
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

//PORTAL
modelLoader.load("models/portal.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  model.position.set(35, 0, -35);

  scene.add(model);

  const fontLoader = new FontLoader();
  fontLoader.load("fonts/roboto.json", function (font) {
    const textGeometry = new TextGeometry(
      "Enter the portal\nto see my lunarSoundStudio\nwebsite project",
      {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 5,
        textAlign: "center",
      }
    );
    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(22, 7, -38);
    scene.add(textMesh);
  });
});

modelLoader.load("models/fence_wood.glb", function (gltf) {
  const model = gltf.scene;
  model.position.set(-20, 0, -39.8);
  scene.add(model);
  model.rotation.y = Math.PI / 2.62;

  for (let i = -10; i < 10; i++) {
    const fenceClone = model.clone();
    fenceClone.position.x = i * 4;

    scene.add(fenceClone);
  }

  const fenceEnds = model.clone();
  fenceEnds.position.set(35.8, 0, 39.8);
  fenceEnds.rotation.y = Math.PI / 2.62;
  scene.add(fenceEnds);

  for (let i = -10; i < 10; i++) {
    const fenceClone = fenceEnds.clone();
    fenceClone.position.x = i * 4;

    scene.add(fenceClone);
  }

  const fenceEnds2 = model.clone();
  fenceEnds2.position.set(40, 0, 39.5);
  fenceEnds2.rotation.y = Math.PI / 1.14;
  scene.add(fenceEnds2);

  for (let i = -10; i < 10; i++) {
    const fenceClone = fenceEnds2.clone();
    fenceClone.position.z = i * 4;

    scene.add(fenceClone);
  }

  const fenceEnds3 = model.clone();
  fenceEnds3.position.set(-39.8, 0, -36);
  fenceEnds3.rotation.y = Math.PI / 1.14;
  scene.add(fenceEnds3);

  for (let i = -10; i < 10; i++) {
    const fenceClone = fenceEnds3.clone();
    fenceClone.position.z = i * 4;

    scene.add(fenceClone);
  }
});

let chooseCharacter = localStorage.getItem("character");
if (!chooseCharacter) chooseCharacter = "female-warrior";

// MODEL WITH ANIMATIONS
var characterControls: CharacterControls;
modelLoader.load(`models/${chooseCharacter}.glb`, function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  model.position.set(5, 0, 5);
  scene.add(model);

  const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
  const mixer = new THREE.AnimationMixer(model);
  const animationsMap: Map<string, THREE.AnimationAction> = new Map();
  gltfAnimations
    .filter((a) => a.name != "TPose")
    .forEach((a: THREE.AnimationClip) => {
      animationsMap.set(a.name, mixer.clipAction(a));
    });

  characterControls = new CharacterControls(
    model,
    mixer,
    animationsMap,
    orbitControls,
    camera,
    "Idle"
  );
});

modelLoader.load("models/camping.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (object: any) {
    if (object.isMesh) object.castShadow = true;
  });
  const animations = gltf.animations;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);

  for (let i = 0; i < animations.length; i++) {
    mixer.clipAction(animations[i]).play();
  }

  function render() {
    requestAnimationFrame(render);
    mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  }
  render();
});

// CONTROL KEYS
let keysPressed = {};
document.addEventListener(
  "keydown",
  (event) => {
    if (event.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      (keysPressed as any)[event.key.toLowerCase()] = true;
    }
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    (keysPressed as any)[event.key.toLowerCase()] = false;
  },
  false
);

const clock = new THREE.Clock();
let isCharacterInPortal = false;
let isCharacterOutsideFloor = false;
let isFireplaceAudioPlaying = false;

let fireplaceSound = new THREE.Audio(listener);
audioLoader.load("./audio/fireplace-sound.mp3", function (buffer) {
  fireplaceSound = new THREE.Audio(listener);
  fireplaceSound.setBuffer(buffer);
});

// ANIMATE
function animate() {
  let mixerUpdateDelta = clock.getDelta();
  if (characterControls) {
    characterControls.update(mixerUpdateDelta, keysPressed);

    const portalEnterBoundingBox = new THREE.Box3(
      new THREE.Vector3(34, -1, -38), // lower bound
      new THREE.Vector3(36, 5, -37) // upper bound
    );

    const floorEnterBoundingBox = new THREE.Box3(
      new THREE.Vector3(-39, 0, -39), // lower bound
      new THREE.Vector3(39, 5, 39) // upper bound
    );

    const campingEnterBoundingBox = new THREE.Box3(
      new THREE.Vector3(-10, 0, -10), // lower bound
      new THREE.Vector3(10, 5, 10) // upper bound
    );

    const characterBoundingBox = new THREE.Box3().setFromObject(
      characterControls.model
    );

    if (portalEnterBoundingBox.intersectsBox(characterBoundingBox)) {
      if (!isCharacterInPortal) {
        window.open("https://lunarsoundstudio.pl/", "_blank");
        keysPressed = {};
        isCharacterInPortal = true;
      }
    } else {
      isCharacterInPortal = false;
    }

    if (!floorEnterBoundingBox.intersectsBox(characterBoundingBox)) {
      if (!isCharacterOutsideFloor) {
        characterControls.model.position.set(
          characterControls.model.position.x < 0
            ? characterControls.model.position.x + 0.15
            : characterControls.model.position.x - 0.15,
          0,
          characterControls.model.position.z < 0
            ? characterControls.model.position.z + 0.15
            : characterControls.model.position.z - 0.15
        );
      }
    }

    if (campingEnterBoundingBox.intersectsBox(characterBoundingBox)) {
      if (!isFireplaceAudioPlaying) {
        isFireplaceAudioPlaying = true;
        fireplaceSound.play();
        fireplaceSound.setLoop(true);
        fireplaceSound.setVolume(10);
      }
    } else {
      fireplaceSound.stop();
      isFireplaceAudioPlaying = false;
    }

    const campingBoxHelper = new THREE.Box3Helper(
      campingEnterBoundingBox,
      0xffff00
    );
    scene.add(campingBoxHelper);
  }

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // keyDisplayQueue.updatePosition();
}
window.addEventListener("resize", onWindowResize);

function generateFloor() {
  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load("./textures/floor/floor.avif");

  const WIDTH = 80;
  const LENGTH = 80;

  const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
  const material = new THREE.MeshStandardMaterial({
    map: floorTexture,
    normalMap: floorTexture,
    displacementMap: floorTexture,
    displacementScale: 0.1,
    aoMap: floorTexture,
  });
  wrapAndRepeatTexture(material.map);
  wrapAndRepeatTexture(material.normalMap);
  wrapAndRepeatTexture(material.displacementMap);
  wrapAndRepeatTexture(material.aoMap);
  // const material = new THREE.MeshPhongMaterial({ map: placeholder})

  const floor = new THREE.Mesh(geometry, material);
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
}

function wrapAndRepeatTexture(map: THREE.Texture) {
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.x = map.repeat.y = 10;
}

function light() {
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-60, 30, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
  // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
}
