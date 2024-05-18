import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI({
  closeFolders: true,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

// Ambient light GUI
const algui = gui.addFolder("Ambient Light");
algui.add(ambientLight, "intensity").min(0).max(1).step(0.01);
algui.addColor(ambientLight, "color");

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Directional light GUI
const dlgui = gui.addFolder("Directional Light");
dlgui.add(directionalLight, "intensity").min(0).max(1).step(0.01);
dlgui.addColor(directionalLight, "color");

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0);

// Hemisphere light GUI
const hlgui = gui.addFolder("Hemisphere Light");
hlgui.add(hemisphereLight, "intensity").min(0).max(1).step(0.01);
hlgui.addColor(hemisphereLight, "color");
hlgui.addColor(hemisphereLight, "groundColor");
scene.add(hemisphereLight);

// Point light
const pointLight = new THREE.PointLight(0xdd9000, 0, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

// Point light GUI
const pntgui = gui.addFolder("Point Light");
pntgui.add(pointLight, "distance").min(0).max(10).step(0.01);
pntgui.add(pointLight, "intensity").min(0).max(1).step(0.01);
pntgui.addColor(pointLight, "color");

// Rect area light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 0, 3, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

// Rect area light GUI
const ralgui = gui.addFolder("Rect Area Light");
ralgui.add(rectAreaLight, "width").min(0).max(10).step(0.01);
ralgui.add(rectAreaLight, "height").min(0).max(10).step(0.01);
ralgui.add(rectAreaLight, "intensity").min(0).max(1).step(0.01);
ralgui.addColor(rectAreaLight, "color");

// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 0, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
spotLight.target.position.x = -1;
scene.add(spotLight.target);

// Spot light GUI
const spotgui = gui.addFolder("Spot Light");
spotgui.add(spotLight, "intensity").min(0).max(1).step(0.01);
spotgui.addColor(spotLight, "color");
spotgui.add(spotLight, "distance").min(0).max(10).step(0.01);
spotgui.add(spotLight, "angle").min(0).max(Math.PI).step(0.01);
spotgui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
spotgui.add(spotLight, "decay").min(1).max(2).step(0.01);

// Helpers
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
