import Phaser from 'phaser';
import config from './config/config.js';
import BootScene from './scenes/BootScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import RegisterScene from './scenes/RegisterScene.js';
import LoginScene from './scenes/LoginScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('MainMenu', MainMenuScene);
        this.scene.add('Register', RegisterScene);
        this.scene.add('Login', LoginScene);
        this.scene.add('Game', GameScene);
        this.scene.add('GameOver', GameOverScene);

        this.scene.start('Boot');
    }
}

window.game = new Game();
