import * as THREE from 'three';

export class CameraComponent {
  constructor(gameObject, fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 1000) {
    this.gameObject = gameObject;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.updateCameraPosition();
  }

  updateCameraPosition() {
    if (this.gameObject) {
      // Set the camera position to match the GameObject's position
      this.camera.position.set(this.gameObject.position.x, this.gameObject.position.y, this.gameObject.position.z);
    }
  }

  update(deltaTime) {
    this.updateCameraPosition();
  }
}