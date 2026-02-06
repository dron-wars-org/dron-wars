import Phaser from 'phaser';
import Bullet from './Bullet.js';

export default class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        // Draw drone shape
        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0x00ff00, 1);
        this.graphics.fillRect(0, 0, 40, 20);
        this.graphics.fillStyle(0x00aa00, 1);
        this.graphics.fillTriangle(40, 0, 50, 10, 40, 20);
        this.add(this.graphics);

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configuration (Data-Driven reference)
        this.speed = 300;
        this.lastFired = 0;
        this.fireDelay = 200;

        this.body.setSize(50, 20);
        this.body.setCollideWorldBounds(true);
    }

    update(time) {
        if (!this.scene.inputManager) return;

        const inputState = this.scene.inputManager.state;
        const move = this.scene.inputManager.getMovementVector();

        // Movement using movement vector from InputManager (Support for analog sticks)
        this.body.setVelocity(move.x * this.speed, move.y * this.speed);

        // Shooting
        if (inputState.shoot && time > this.lastFired + this.fireDelay) {
            const bullet = this.scene.bullets.get(this.x + 50, this.y + 10);

            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.body.setVelocityX(500);
                this.lastFired = time;
            }
        }
    }
}
