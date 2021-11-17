import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { SphereGeometry } from "three";

const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;

class App {
  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      this.sizes.width / this.sizes.height,
      NEAR,
      FAR
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas.webgl"),
    });
    this.gui = new dat.GUI();
    this.stats = new Stats();
  }

  init() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.position.z = 3;
    this.scene.add(this.camera);

    this.axesHelper = new THREE.AxesHelper(2);
    this.scene.add(this.axesHelper);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Более плавное перемещение
    this.controls.enableDamping = true;

    this.addMesh();
    this.addLight();
    this.addGui();
    this.render();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.windowResizeHandler.bind(this));
  }

  addLight() {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    this.scene.add(light);
  }

  addMesh() {
    const geometry = new SphereGeometry(0.2);

    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const basicMesh = new THREE.Mesh(geometry, basicMaterial);
    basicMesh.position.x = -1;
    this.scene.add(basicMesh);

    const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const lambertMesh = new THREE.Mesh(geometry, lambertMaterial);
    lambertMesh.position.x = -0.5;
    this.scene.add(lambertMesh);

    const phongMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 150,
    });
    const phongMesh = new THREE.Mesh(geometry, phongMaterial);
    this.scene.add(phongMesh);

    const toonMaterial = new THREE.MeshToonMaterial({ color: 0xff0000 });
    const toonMesh = new THREE.Mesh(geometry, toonMaterial);
    toonMesh.position.x = 0.5;
    this.scene.add(toonMesh);

    const standardMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      roughness: 0.5,
      metalness: 0.5,
    });
    const standardMesh = new THREE.Mesh(geometry, standardMaterial);
    standardMesh.position.x = 1;
    this.scene.add(standardMesh);

    const physicalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      clearcoat: 0.5,
      clearCoatRoughness: 0.5,
    });
    const physicalMesh = new THREE.Mesh(geometry, physicalMaterial);
    physicalMesh.position.x = 1.5;
    this.scene.add(physicalMesh);
  }

  addGui() {
    this.gui.add(this.axesHelper, "visible").name("axesHelper");
  }

  windowResizeHandler() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needUpdate =
      this.sizes.width !== width || this.sizes.height !== height;

    if (needUpdate) {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.camera.updateProjectionMatrix();
      this.sizes.width = width;
      this.sizes.height = height;
    }
  }

  render() {
    this.controls.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
