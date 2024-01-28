export class GameObject {
    constructor(game, x = 0, y = 0, z = 0) {
        this.game = game;
        this.position = { x, y, z };
        this.components = [];
    }

    addComponent(component) {
        this.components.push(component);
        if (component.camera) {
            this.game.setActiveCamera(component.camera);
        }
    }

    update(deltaTime) {
        for (const component of this.components) {
            component.update(deltaTime);
        }
    }

    destroy() {
        delete this.components;
        this.game.removeObject(this);
    }
}