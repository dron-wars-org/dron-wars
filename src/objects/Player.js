import Phaser from 'phaser';
import Bullet from './Bullet.js';

export default class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y, bullets) {
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

        // Configuration
        this.speed = 300;
        this.bullets = bullets;
        this.lastFired = 0;
        this.fireDelay = 200;

        this.body.setSize(50, 20);
        this.body.setCollideWorldBounds(true);

        // Input keys
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    update(time) {
        this.handleMovement();
        this.handleShooting(time);
    }

    handleShooting(time) {
        if ((this.cursors.space.isDown || this.wasd.space.isDown) && time > this.lastFired + this.fireDelay) {
            const bullet = new Bullet(this.scene, this.x + 50, this.y + 10);
            this.bullets.push(bullet);
            this.lastFired = time;
        }
    }

    handleMovement() {
        this.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.body.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.body.setVelocityX(this.speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.body.setVelocityY(-this.speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.body.setVelocityY(this.speed);
        }

        // Normalize velocity for diagonal movement
        this.body.velocity.normalize().scale(this.speed);
    }
}
