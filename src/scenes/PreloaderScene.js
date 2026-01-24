import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Load game assets here
        // this.load.image('logo', 'assets/logo.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
