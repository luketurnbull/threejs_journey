import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
class TexturesCreator {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
  }

  loadTextureFolder(path, name) {
    const colourTexture = this.textureLoader.load(path + name + "_diff_1k.jpg");
    // Always do this with colour textures
    colourTexture.colorSpace = THREE.SRGBColorSpace;

    return {
      colour: colourTexture,
      arm: this.textureLoader.load(path + name + "_arm_1k.jpg"),
      normal: this.textureLoader.load(path + name + "_nor_gl_1k.jpg"),
      displacement: this.textureLoader.load(path + name + "_disp_1k.jpg"),
    };
  }

  load(path) {
    return this.textureLoader.load(path);
  }
}

const textureCreator = new TexturesCreator();

// Floor
const floorTextures = textureCreator.loadTextureFolder(
  "./floor/coast_sand_rocks_02_1k/",
  "coast_sand_rocks_02"
);

const floorAlphaTexture = textureCreator.load("./floor/alpha.jpg");
const floorColourTexture = floorTextures.colour;
const floorARMTexture = floorTextures.arm;
const floorNormalTexture = floorTextures.normal;
const floorDisplacementTexture = floorTextures.displacement;

floorColourTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColourTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColourTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall textures
const wallTextures = textureCreator.loadTextureFolder(
  "./walls/castle_brick_broken_06_texture/",
  "castle_brick_broken_06"
);

// Roof textures
const roofTextures = textureCreator.loadTextureFolder(
  "./roof/roof_slates_02/",
  "roof_slates_02"
);

const roofColourTexture = roofTextures.colour;
const roofARMTexture = roofTextures.arm;
const roofNormalTexture = roofTextures.normal;
const roofDisplacementTexture = roofTextures.displacement;

roofColourTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofDisplacementTexture.repeat.set(3, 1);

roofColourTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofDisplacementTexture.wrapS = THREE.RepeatWrapping;

// Bushes textures
const bushTextures = textureCreator.loadTextureFolder(
  "./bushes/leaves_forest_ground/",
  "leaves_forest_ground"
);

const bushColourTexture = bushTextures.colour;
const bushARMTexture = bushTextures.arm;
const bushNormalTexture = bushTextures.normal;
const bushDisplacementTexture = bushTextures.displacement;

bushColourTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;
bushDisplacementTexture.wrapS = THREE.RepeatWrapping;

// Graves textures
const graveTextures = textureCreator.loadTextureFolder(
  "./graves/plastered_stone_wall/",
  "plastered_stone_wall"
);

const graveColourTexture = graveTextures.colour;
const graveARMTexture = graveTextures.arm;
const graveNormalTexture = graveTextures.normal;

graveColourTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door textures
const doorColourTexture = textureCreator.load("./door/color.jpg");
const doorAlphaTexture = textureCreator.load("./door/alpha.jpg");
const doorAmbientOcclusionTexture = textureCreator.load(
  "./door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureCreator.load("./door/height.jpg");
const doorRoughnessTexture = textureCreator.load("./door/roughness.jpg");
const doorNormalTexture = textureCreator.load("./door/normal.jpg");
const doorMetalnessTexture = textureCreator.load("./door/metalness.jpg");

doorColourTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
const HOUSE_MEASUREMENTS = {
  width: 4,
  height: 2.5,
  depth: 4,
};

const ROOF_MEASUREMENTS = {
  width: HOUSE_MEASUREMENTS.width * 0.8,
  height: 1.5,
};

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColourTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorNormalTexture,
    metalnessMap: floorNormalTexture,
    floorNormalTexture: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.4,
    displacementBias: -0.25,
  })
);
floor.rotation.x = -0.5 * Math.PI;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");

gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

// House container
const house = new THREE.Group();
scene.add(house);

// House walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    HOUSE_MEASUREMENTS.width,
    HOUSE_MEASUREMENTS.height,
    HOUSE_MEASUREMENTS.depth,
    100,
    100,
    100
  ),
  new THREE.MeshStandardMaterial({
    map: wallTextures.colour,
    aoMap: wallTextures.arm,
    roughnessMap: wallTextures.arm,
    metalnessMap: wallTextures.arm,
    normalMap: wallTextures.normal,
    displacementMap: wallTextures.displacement,
    displacementScale: 0.1,
    displacementBias: -0.08,
  })
);
house.add(walls);
house.position.y = HOUSE_MEASUREMENTS.height / 2;

// House roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(ROOF_MEASUREMENTS.width, ROOF_MEASUREMENTS.height, 4),
  new THREE.MeshStandardMaterial({
    map: roofColourTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
    // displacementMap: roofDisplacementTexture,
    // displacementScale: 0.1,
    // displacementBias: -0.08,
  })
);
roof.position.y = house.position.y + ROOF_MEASUREMENTS.height / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColourTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    displacementBias: -0.04,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
house.add(door);
// door.rotation.x = 0.5 * Math.PI;
door.position.y = -0.22;
door.position.z = HOUSE_MEASUREMENTS.depth / 2 + 0.02;

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#89c854",
  map: bushColourTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
  displacementMap: bushDisplacementTexture,
  displacementScale: 0.1,
  displacementBias: -0.08,
});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, -1, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, -1.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, -1.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, -1.2, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColourTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

const FULL_CIRCLE = 2 * Math.PI;
const GRAVE_AMOUNT = 30;
const MIN_RADIUS = HOUSE_MEASUREMENTS.depth / 2 + 1;
const RADIUS_MULTIPLIER = 5;

for (let i = 0; i < GRAVE_AMOUNT; i++) {
  const angle = Math.random() * FULL_CIRCLE;
  const radius = MIN_RADIUS + Math.random() * RADIUS_MULTIPLIER;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.z = z;
  grave.position.y = Math.random() * 0.4;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 1.1, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);

scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2("#02343f", 0.1);

walls.castShadow = true;
walls.receiveShadow = true;

roof.castShadow = true;
roof.receiveShadow = true;

floor.receiveShadow = true;

graves.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghost
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
