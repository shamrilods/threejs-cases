import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Stats from "stats.js";
import gsap from "gsap";

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

    this.frame = 0;
    this.world = {
      plane: {
        width: 200,
        height: 200,
        widthSegments: 30,
        heightSegments: 30,
      },
    };

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.initialColor = {
      r: 0,
      g: 0,
      b: 0,
    };
  }

  init() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.position.z = 50;
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    window.addEventListener("mousemove", (evt) => {
      this.mouse.x = (evt.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    });

    this.addWorld();

    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.windowResizeHandler.bind(this));
  }

  addWorld() {
    const planeGeometry = new THREE.PlaneBufferGeometry(
      this.world.plane.width,
      this.world.plane.height,
      this.world.plane.widthSegments,
      this.world.plane.heightSegments
    );
    const planeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: THREE.FlatShading,
      vertexColors: true,
    });
    this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.scene.add(this.planeMesh);
    this.generatePlane();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    this.scene.add(light);
    light.position.set(0, 1, 10);

    this.addAxesHelper();
    this.addGui();
    this.render();
  }

  generatePlane() {
    this.planeMesh.geometry.dispose();
    this.planeMesh.geometry = new THREE.PlaneBufferGeometry(
      this.world.plane.width,
      this.world.plane.height,
      this.world.plane.widthSegments,
      this.world.plane.heightSegments
    );
    const { array: positionArray, count: positionCount } =
      this.planeMesh.geometry.attributes.position;

    const randomValues = [];

    for (let i = 0; i < positionArray.length; i++) {
      if (i % 3 === 0) {
        const x = positionArray[i];
        const y = positionArray[i + 1];
        const z = positionArray[i + 2];

        positionArray[i] = x + (Math.random() - 0.5) * 3;
        positionArray[i + 1] = y + (Math.random() - 0.5) * 3;
        positionArray[i + 2] = z + (Math.random() - 0.5);
      }

      randomValues.push(Math.random() * Math.PI);
    }

    this.planeMesh.geometry.attributes.position.randomValues = randomValues;
    this.planeMesh.geometry.attributes.position.originalPosition =
      positionArray;

    const colors = [];

    for (let i = 0; i < positionCount; i++) {
      colors.push(
        this.initialColor.r,
        this.initialColor.g,
        this.initialColor.b
      );
    }

    this.planeMesh.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
  }

  addAxesHelper() {
    this.axesHelper = new THREE.AxesHelper(2);
    this.axesHelper.visible = false;
    this.scene.add(this.axesHelper);
  }

  addGui() {
    this.gui.add(this.axesHelper, "visible").name("axesHelper");
    this.gui
      .add(this.world.plane, "width", 50, 400)
      .onChange(this.generatePlane.bind(this));
    this.gui
      .add(this.world.plane, "height", 50, 400)
      .onChange(this.generatePlane.bind(this));
    this.gui
      .add(this.world.plane, "widthSegments", 10, 50)
      .onChange(this.generatePlane.bind(this));
    this.gui
      .add(this.world.plane, "heightSegments", 10, 50)
      .onChange(this.generatePlane.bind(this));
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

    this.frame += 0.005;
    const {
      array: positionArray,
      originalPosition,
      randomValues,
    } = this.planeMesh.geometry.attributes.position;
    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] =
        originalPosition[i] + Math.cos(this.frame + randomValues[i]) * 0.01;

      positionArray[i + 1] =
        originalPosition[i + 1] +
        Math.sin(this.frame + randomValues[i + 1]) * 0.003;
    }
    this.planeMesh.geometry.attributes.position.needsUpdate = true;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.planeMesh);

    if (
      intersects.length &&
      this.mouse.x &&
      this.faceIndexOld !== intersects[0].faceIndex
    ) {
      const face = intersects[0].face;
      const { color } = intersects[0].object.geometry.attributes;
      this.faceIndexOld = intersects[0].faceIndex;

      const hoverColor = {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
      };

      gsap.to(hoverColor, {
        ...this.initialColor,
        duration: 0.5,
        onUpdate: () => {
          color.setX(face.a, hoverColor.r);
          color.setY(face.a, hoverColor.g);
          color.setZ(face.a, hoverColor.b);

          color.setX(face.b, hoverColor.r);
          color.setY(face.b, hoverColor.g);
          color.setZ(face.b, hoverColor.b);

          color.setX(face.c, hoverColor.r);
          color.setY(face.c, hoverColor.g);
          color.setZ(face.c, hoverColor.b);

          intersects[0].object.geometry.attributes.color.needsUpdate = true;
        },
      });
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
