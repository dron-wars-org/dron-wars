import Phaser from 'phaser';
import TokenManager from '../utils/TokenManager.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, 150, 'DRON WARS', {
            fontSize: '48px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Mostrar bienvenida si está autenticado
        if (TokenManager.isAuthenticated()) {
            this.add.text(width / 2, 220, `Bienvenido, ${TokenManager.getUsername()}`, {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);

            const logoutText = this.add.text(width / 2, 260, 'Cerrar Sesión', {
                fontSize: '18px',
                fill: '#ff4444'
            }).setOrigin(0.5);

            logoutText.setInteractive({ useHandCursor: true });
            logoutText.on('pointerdown', () => {
                TokenManager.clear();
                this.scene.restart();
            });
            logoutText.on('pointerover', () => logoutText.setStyle({ fill: '#ff0000' }));
            logoutText.on('pointerout', () => logoutText.setStyle({ fill: '#ff4444' }));
        }

        // Opción: Jugar
        const playText = this.add.text(width / 2, 320, 'JUGAR (SPACE)', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Opción: Registrarse
        const registerText = this.add.text(width / 2, 380, 'REGISTRARSE', {
            fontSize: '24px',
            fill: '#00aaff'
        }).setOrigin(0.5);

        registerText.setInteractive({ useHandCursor: true });
        registerText.on('pointerdown', () => {
            this.scene.start('Register');
        });
        registerText.on('pointerover', () => registerText.setStyle({ fill: '#00ffff' }));
        registerText.on('pointerout', () => registerText.setStyle({ fill: '#00aaff' }));

        // Opción: Login
        const loginText = this.add.text(width / 2, 440, 'INICIAR SESIÓN', {
            fontSize: '24px',
            fill: '#00aaff'
        }).setOrigin(0.5);

        loginText.setInteractive({ useHandCursor: true });
        loginText.on('pointerdown', () => {
            this.scene.start('Login');
        });
        loginText.on('pointerover', () => loginText.setStyle({ fill: '#00ffff' }));
        loginText.on('pointerout', () => loginText.setStyle({ fill: '#00aaff' }));

        // Atajo de teclado para jugar
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game');
        });
    }
}
