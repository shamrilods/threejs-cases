import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
    this.stats = new Stats();
    this.textureLoader = new THREE.TextureLoader();
    this.clock = new THREE.Clock();
  }

  init() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor("#262837");

    this.camera.position.set(3, 3, 6);
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Более плавное перемещение
    this.controls.enableDamping = true;

    this.addMesh();
    this.render();
    document.body.appendChild(this.stats.dom);
    window.addEventListener("resize", this.windowResizeHandler.bind(this));
  }

  addMesh() {
    const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
    this.scene.add(ambientLight);
    const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
    moonLight.position.set(4, 5, -2);
    this.scene.add(moonLight);

    const grassColorTexture = this.textureLoader.load(
      "/3d/textures/grass/Stylized_Grass_001_basecolor.jpg"
    );
    const grassAmbientOcclusionTexture = this.textureLoader.load(
      "/3d/textures/grass/Stylized_Grass_001_ambientOcclusion.jpg"
    );
    const grassNormalTexture = this.textureLoader.load(
      "/3d/textures/grass/Stylized_Grass_001_normal.jpg"
    );
    const grassRoughnessTexture = this.textureLoader.load(
      "/3d/textures/grass/Stylized_Grass_001_roughness.jpg"
    );

    grassColorTexture.repeat.set(16, 16);
    grassAmbientOcclusionTexture.repeat.set(16, 16);
    grassNormalTexture.repeat.set(16, 16);
    grassRoughnessTexture.repeat.set(16, 16);
    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
      })
    );
    floor.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
    );
    floor.rotation.x = Math.PI * -0.5;
    this.scene.add(floor);

    const house = new THREE.Group();
    this.scene.add(house);

    const bricksColorTexture = this.textureLoader.load(
      "/3d/textures/bricks/Terracotta_Tiles_002_Base_Color.jpg"
    );
    const bricksAmbientOcclusionTexture = this.textureLoader.load(
      "/3d/textures/bricks/Terracotta_Tiles_002_ambientOcclusion.jpg"
    );
    const bricksNormalTexture = this.textureLoader.load(
      "/3d/textures/bricks/Terracotta_Tiles_002_Normal.jpg"
    );
    const bricksRoughnessTexture = this.textureLoader.load(
      "/3d/textures/bricks/Terracotta_Tiles_002_Roughness.jpg"
    );
    const walls = new THREE.Mesh(
      new THREE.BoxBufferGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
      })
    );
    walls.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
    );
    walls.position.y = 1.251;
    house.add(walls);

    const roof = new THREE.Mesh(
      new THREE.ConeBufferGeometry(3, 1, 4),
      new THREE.MeshStandardMaterial({ color: "#b35f45" })
    );
    roof.rotation.y = Math.PI * 0.25;
    roof.position.y = 3;
    house.add(roof);

    const doorColorTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_basecolor.jpg"
    );
    const doorAlphaTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_opacity.jpg"
    );
    const doorAmbientOcclusionTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_ambientOcclusion.jpg"
    );
    const doorHeightTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_height.png"
    );
    const doorNormalTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_normal.jpg"
    );
    const doorMetalnessTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_metallic.jpg"
    );
    const doorRoughnessTexture = this.textureLoader.load(
      "/3d/textures/door/Door_Wood_001_roughness.jpg"
    );

    const door = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
      })
    );
    door.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );
    door.position.y = 1;
    door.position.z = 2 + 0.01;
    house.add(door);

    const doorLight = new THREE.PointLight("#ff7d46", 1.5, 7);
    doorLight.position.set(0, 2.15, 2.4);
    house.add(doorLight);

    const luminaireGeometry = new THREE.SphereBufferGeometry(0.1, 16, 16);
    const luminaireMaterial = new THREE.MeshBasicMaterial({
      color: "#ff7d46",
    });
    const luminaire = new THREE.Mesh(luminaireGeometry, luminaireMaterial);
    luminaire.position.set(0, 2.15, 2.09);
    house.add(luminaire);

    const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(1.1, 0.2, 2.2);
    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.7, 0.1, 2.1);
    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-1, 0.1, 2.2);
    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1.2, 0.05, 2.6);
    house.add(bush1, bush2, bush3, bush4);

    const graves = new THREE.Group();
    this.scene.add(graves);
    const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2; // Random angle
      const radius = 3.5 + Math.random() * 6; // Random radius
      const x = Math.cos(angle) * radius; // Get the x position using cosinus
      const z = Math.sin(angle) * radius; // Get the z position using sinus
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.3, z);
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      graves.add(grave);
    }

    this.scene.fog = new THREE.Fog("#262837", 1, 15);

    this.ghost1 = new THREE.PointLight("#86D3FF", 1.5, 3);
    this.scene.add(this.ghost1);
    this.ghost2 = new THREE.PointLight("#86D3FF", 1.5, 3);
    this.scene.add(this.ghost2);
    this.ghost3 = new THREE.PointLight("#86D3FF", 1.5, 3);
    this.scene.add(this.ghost3);
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

    const elapsedTime = this.clock.getElapsedTime();

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5;
    this.ghost1.position.x = Math.cos(ghost1Angle) * 4;
    this.ghost1.position.z = Math.sin(ghost1Angle) * 4;
    this.ghost1.position.y = Math.sin(elapsedTime * 3);
    const ghost2Angle = -elapsedTime * 0.32;
    this.ghost2.position.x = Math.cos(ghost2Angle) * 5;
    this.ghost2.position.z = Math.sin(ghost2Angle) * 5;
    this.ghost2.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    const ghost3Angle = -elapsedTime * 0.18;
    this.ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    this.ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    this.ghost2.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

export default App;
