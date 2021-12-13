import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import { Clock } from "three";

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
    // this.gui = new dat.GUI();
    this.stats = new Stats();
    this.textureLoader = new THREE.TextureLoader();
    this.clock = new Clock();
  }

  init() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.position.z = 1;
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Более плавное перемещение
    this.controls.enableDamping = true;

    this.addParticles();
    this.render();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.windowResizeHandler.bind(this));
  }

  addParticles() {
    this.particlesGeometry = new THREE.BufferGeometry();
    this.particlesCount = 5000;
    const positions = new Float32Array(this.particlesCount * 3);
    const colors = new Float32Array(this.particlesCount * 3);

    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    this.particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    this.particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particleTexture = this.textureLoader.load(
      "/3d/textures/particles.png"
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      sizeAttenuation: true,
      alphaMap: particleTexture,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    particlesMaterial.vertexColors = true;

    this.particles = new THREE.Points(
      this.particlesGeometry,
      particlesMaterial
    );
    this.scene.add(this.particles);
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
