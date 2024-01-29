import * as THREE from "three";
import { Circle } from "./objects/Circle";
import { WaterParticle } from "./base/WaterParticle";

export class FluidManager {
  constructor(game, x, y, horizontal, vertical, spacing) {
    this.game = game;
    this.radius = 0.1;
    this.x = x;
    this.y = y;
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.spacing = spacing;
    this.waterParticles = [];
    this.mass = 1
  }

  init(){

    for (let wp of this.waterParticles) {
      this.game.removeObject(wp);
    }

    this.startX = this.x - (this.horizontal * (this.radius + this.spacing)) / 2;
    this.startY = this.y - (this.vertical * (this.radius + this.spacing)) / 2;

    for (let i = 0; i < this.vertical; i++) {
      for (let j = 0; j < this.horizontal; j++) {
        const newX = this.startX + j * (this.radius + this.spacing);
        const newY = this.startY + i * (this.radius + this.spacing);

        const initVelocity = {
          x: (Math.random() - 0.5) * 1.2, // Random velocity between -1 and 1
          y: (Math.random() - 0.5) * 1.2,
        };

        const circle = new Circle(this.game, newX, newY, this.radius);
        const waterParticle = new WaterParticle(
          circle,
          this.game,
          undefined,
          undefined,
          undefined,
          initVelocity,
          this.mass,
        );
        circle.addComponent(waterParticle);
        this.game.addObject(circle);
        this.waterParticles.push(circle);
      }
    }
  }

  update(deltaTime) {}
}
