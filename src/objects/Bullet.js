import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        // Draw bullet shape
        const graphics = scene.add.graphics();
        graphics.fillStyle(0x00ffff, 1);
        graphics.fillCircle(0, 0, 5);
        this.add(graphics);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(5);
        this.body.setVelocityX(500);
    }
}
