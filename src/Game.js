import * as THREE from 'three';

export class Game {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.objects = [];
    this.clock = new THREE.Clock();
    this.activeCamera = null;
  }

  setActiveCamera(camera) {
    this.activeCamera = camera;
  }

  getObjects() {
    return this.objects;
  }

  addObject(gameObject) {
    this.objects.push(gameObject);
    if(gameObject.mesh) {
      this.scene.add(gameObject.mesh);
    }
  }

  removeObject(gameObject) {
    const index = this.objects.indexOf(gameObject);
    if (index > -1) {
      this.objects.splice(index, 1);
      this.scene.remove(gameObject.mesh);
      gameObject.destroy();
    }
  }


  getSceneBounds() {
    if (this.activeCamera.isOrthographicCamera) {
      const height = this.activeCamera.top - this.activeCamera.bottom;
      const width = this.activeCamera.right - this.activeCamera.left;
      return { left: this.activeCamera.left, right: this.activeCamera.right, top: this.activeCamera.top, bottom: this.activeCamera.bottom };
    } else if (this.activeCamera.isPerspectiveCamera) {
      const aspect = this.activeCamera.aspect;
      const height = 2 * Math.tan(THREE.MathUtils.degToRad(this.activeCamera.fov) / 2) * this.activeCamera.position.z;
      const width = height * aspect;
      return { left: -width / 2, right: width / 2, top: height / 2, bottom: -height / 2 };
    }
  }


  start() {
    this.run();
  }

  run() {
    requestAnimationFrame(() => this.run());
    const deltaTime = this.clock.getDelta();

    for (const gameObject of this.objects) {
      gameObject.update(deltaTime);
    }

    if (this.activeCamera) {
      this.renderer.render(this.scene, this.activeCamera);
    }
  }
}