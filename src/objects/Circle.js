import {GameObject} from "../base/GameObject";
import * as THREE from 'three';
import { CirclePhysics } from "../base/CirclePhysics";

export class Circle extends GameObject {
    constructor(game, x, y, radius, color = 0xff0000) {
        super(game, x, y);

        this.radius = radius;
        this.color = color;

        this.createMesh();
    }

    createMesh() {
        const geometry = new THREE.CircleGeometry(this.radius, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, 0); // Set initial position
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    destroy() {
        super.destroy();
    }
}