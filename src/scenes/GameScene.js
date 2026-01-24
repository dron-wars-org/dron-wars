import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.add.text(400, 300, 'GAME SCENE', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }

    update() {
        // Game loop
    }
}
