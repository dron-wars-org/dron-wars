import Phaser from 'phaser';
import TokenManager from '../utils/TokenManager.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.cameras.main;
        this.selectedOption = 0; // 0: Jugar, 1: Registrarse, 2: Login

        this.add.text(width / 2, 150, 'DRON WARS', {
            fontSize: '48px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Bienvenido
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

        // Definición de opciones
        if (TokenManager.isAuthenticated()) {
            this.options = [
                { text: 'JUGAR (SPACE)', y: 320, action: () => this.scene.start('Game'), color: '#ffffff' },
                { text: 'PERFIL', y: 380, action: () => this.scene.start('Profile'), color: '#00aaff' }
            ];
        } else {
            this.options = [
                { text: 'JUGAR (SPACE)', y: 320, action: () => this.scene.start('Game'), color: '#ffffff' },
                { text: 'REGISTRARSE', y: 380, action: () => this.scene.start('Register'), color: '#00aaff' },
                { text: 'INICIAR SESIÓN', y: 440, action: () => this.scene.start('Login'), color: '#00aaff' }
            ];
        }


        this.optionTexts = [];

        this.options.forEach((opt, index) => {
            const txt = this.add.text(width / 2, opt.y, opt.text, {
                fontSize: '24px',
                fill: opt.color
            }).setOrigin(0.5);

            txt.setInteractive({ useHandCursor: true });
            txt.on('pointerdown', opt.action);
            txt.on('pointerover', () => {
                this.selectedOption = index;
                this.updateSelection();
            });

            this.optionTexts.push(txt);
        });

        // Cursor de selección
        this.cursor = this.add.text(0, 0, '>', {
            fontSize: '24px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.updateSelection();

        // Controles de teclado
        this.input.keyboard.on('keydown-UP', () => {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
            this.updateSelection();
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
            this.updateSelection();
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.options[this.selectedOption].action();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.options[this.selectedOption].action();
        });
    }

    updateSelection() {
        this.optionTexts.forEach((txt, index) => {
            if (index === this.selectedOption) {
                txt.setStyle({ fill: '#00ff00' });
                this.cursor.setVisible(true);
                this.cursor.setPosition(txt.x - (txt.width / 2) - 40, txt.y);
            } else {
                txt.setStyle({ fill: this.options[index].color });
            }
        });
    }
}
