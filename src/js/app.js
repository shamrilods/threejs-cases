import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import Stats from "stats.js";

import matcap from "../img/matcap.png";
import helvetikerFont from "../fonts/helvetiker_regular.typeface.json";

const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;

const TEXT = "ThreeJS";

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
    this.fontLoader = new FontLoader();
    this.gui = new dat.GUI();
    this.stats = new Stats();

    this.matcapTexture = new THREE.TextureLoader().load(matcap);
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

    this.addText();
    this.addGui();
    this.render();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.windowResizeHandler.bind(this));
  }

  addText() {
    this.fontLoader.load(helvetikerFont, (font) => {
      const textGeometry = new TextGeometry(TEXT, {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 20,
      });

      textGeometry.center();

      const text = new THREE.Mesh(
        textGeometry,
        new THREE.MeshMatcapMaterial({ matcap: this.matcapTexture })
      );
      this.scene.add(text);
    });
  }

  addGui() {
    this.gui.add(this.axesHelper, "visible").name("axesHelper");
  }

  windowResizeHandler() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render() {
    this.controls.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
