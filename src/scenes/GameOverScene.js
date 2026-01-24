import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.text(400, 300, 'GAME OVER', { fontSize: '32px', fill: '#f00' }).setOrigin(0.5);
        this.add.text(400, 400, 'Press SPACE to Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        });
    }
}
