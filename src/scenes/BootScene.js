import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load assets needed for the preloader (e.g., loading bar)
    }

    create() {
        this.scene.start('Preloader');
    }
}
