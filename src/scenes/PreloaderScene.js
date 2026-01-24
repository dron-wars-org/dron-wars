import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // No assets needed - using Graphics API
    }

    create() {
        this.scene.start('MainMenu');
    }
}
