import Phaser from 'phaser';

export default class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, x, y, color) {
        super(scene, x, y);

        // Draw enemy shape
        const graphics = scene.add.graphics();
        graphics.fillStyle(color || 0xff0000, 1);
        graphics.fillCircle(0, 0, 15);
        graphics.fillStyle(0xaa0000, 1);
        graphics.fillCircle(-5, -5, 5);
        graphics.fillCircle(5, -5, 5);
        this.add(graphics);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(15);

        this.hp = 1;
        this.speed = 100;
    }

    spawn(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.hp = 1;
    }

    takeDamage() {
        this.hp--;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop(); // Stop movement
    }

    update(time, delta) {
        // Remove if out of bounds
        if (this.x < -50) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
