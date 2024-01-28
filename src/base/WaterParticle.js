import { GameComponent } from "./GameComponent";

export class WaterParticle extends GameComponent {
  constructor(gameObject, game, gravity = -9.8, dampening = 0.85, friction = 0.9, velocity = { x: 0, y: 0 }, mass = 1) {
    super(gameObject);
    this.game = game;
    this.gravity = gravity;
    this.dampening = dampening;
    this.velocity = velocity;
    this.friction = friction;
    this.radius = gameObject.radius || 1;
    this.minVelocity = 0.01;
    this.mass = mass;
  }

  update(deltaTime) {
    // Apply gravity
    this.velocity.y += this.gravity * deltaTime;

    // Update position
    this.gameObject.position.x += this.velocity.x * deltaTime;
    this.gameObject.position.y += this.velocity.y * deltaTime;

    // Update GameObject's mesh position
    if (this.gameObject.mesh) {
      this.gameObject.mesh.position.set(this.gameObject.position.x, this.gameObject.position.y, 0);
    }

    // Collision detection
    this.checkCollisions(deltaTime);
  }

  checkCollisions(deltaTime) {
    const bounds = this.game.getSceneBounds();

    // Left and Right walls
    if (this.gameObject.position.x - this.radius < bounds.left) {
      this.gameObject.position.x = bounds.left + this.radius;
      this.velocity.x = -this.velocity.x;
    } else if (this.gameObject.position.x + this.radius > bounds.right) {
      this.gameObject.position.x = bounds.right - this.radius;
      this.velocity.x = -this.velocity.x;
    }

    // Top and Bottom walls
    if (this.gameObject.position.y - this.radius < bounds.bottom) {
      this.gameObject.position.y = bounds.bottom + this.radius;
      this.velocity.y = -this.velocity.y;
      if(this.dampening > 0){
        this.velocity.y = this.velocity.y * this.dampening;
      }
      if(this.friction > 0){
        this.velocity.x = this.velocity.x * this.friction;
      }
    } else if (this.gameObject.position.y + this.radius > bounds.top) {
      this.gameObject.position.y = bounds.top - this.radius;
      this.velocity.y = -this.velocity.y;
      if(this.dampening > 0){
        this.velocity.y = this.velocity.y * this.dampening;
      }
    }

    if (Math.abs(this.velocity.x) < this.minVelocity) {
      this.velocity.x = 0;
    }

    if (Math.abs(this.velocity.y) < this.minVelocity) {
      this.velocity.y = 0;
    }

    const otherObjects = this.game.getObjects();

    for (const other of otherObjects) {
      const hasComponent = other.hasComponent(WaterParticle);
      if (other !== this.gameObject && hasComponent) {
        const dx = this.gameObject.position.x - other.position.x;
        const dy = this.gameObject.position.y - other.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.radius + hasComponent.radius;

        if (distance < minDistance) {
          // Collision response
          this.handleCollision(other, hasComponent, deltaTime);
        }
      }
    }
  }

  handleCollision(other, component, deltaTime) {
    // Calculate vector between the centers
    const dx = this.gameObject.position.x - other.position.x;
    const dy = this.gameObject.position.y - other.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate overlap
    const overlap = (this.radius + component.radius - distance) / 2;

    // Separate the circles
    const nx = dx / distance; // Normalized x component
    const ny = dy / distance; // Normalized y component
    this.gameObject.position.x += nx * overlap;
    this.gameObject.position.y += ny * overlap;
    other.position.x -= nx * overlap;
    other.position.y -= ny * overlap;

    // Calculate relative velocity
    const rvx = this.velocity.x - component.velocity.x;
    const rvy = this.velocity.y - component.velocity.y;

    // Calculate velocity component along the normalized direction vector
    const velAlongNormal = rvx * nx + rvy * ny;

    // Do not resolve if velocities are separating
    if (velAlongNormal > 0) return;

    // Calculate impulse scalar based on mass
    const impulseScalar = (2 * velAlongNormal) / (this.mass + component.mass);

    // Calculate new velocities based on mass
    this.velocity.x -= impulseScalar * component.mass * nx;
    this.velocity.y -= impulseScalar * component.mass * ny;
    component.velocity.x += impulseScalar * this.mass * nx;
    component.velocity.y += impulseScalar * this.mass * ny;
  }

}