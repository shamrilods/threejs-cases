import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Stats from "stats.js";

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
    this.addGui();
    this.render();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.windowResizeHandler.bind(this));
  }

  addMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "red" });
    this.scene.add(new THREE.Mesh(geometry, material));
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
