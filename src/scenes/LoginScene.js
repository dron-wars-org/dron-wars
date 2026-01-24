import Phaser from 'phaser';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('Login');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Título
        this.add.text(width / 2, 80, 'DRON WARS', {
            fontSize: '48px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, 140, 'INICIAR SESIÓN', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Placeholder - implementación completa en HU-AUTH-02
        this.add.text(width / 2, height / 2, 'Login Scene\n(Próximamente)', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Link a Register
        const registerText = this.add.text(width / 2, height - 50, '¿No tienes cuenta? Regístrate', {
            fontSize: '18px',
            fill: '#00aaff'
        }).setOrigin(0.5);

        registerText.setInteractive({ useHandCursor: true });
        registerText.on('pointerdown', () => {
            this.scene.start('Register');
        });

        registerText.on('pointerover', () => registerText.setStyle({ fill: '#00ffff' }));
        registerText.on('pointerout', () => registerText.setStyle({ fill: '#00aaff' }));
    }
}
