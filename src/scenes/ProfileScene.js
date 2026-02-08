import Phaser from 'phaser';
import API_CONFIG from '../config/api.js';
import ApiClient from '../utils/ApiClient.js';
import TokenManager from '../utils/TokenManager.js';

/**
 * Escena de Perfil de Usuario
 * HU-AUTH-04: Consulta de Perfil Autenticado
 * 
 * Muestra información del usuario autenticado y permite cerrar sesión.
 */
export default class ProfileScene extends Phaser.Scene {
    constructor() {
        super('Profile');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Título
        this.add.text(width / 2, 80, 'PERFIL DE USUARIO', {
            fontSize: '42px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Mensaje de carga
        this.loadingText = this.add.text(width / 2, height / 2, 'Cargando perfil...', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Contenedor para datos del perfil (oculto inicialmente)
        this.profileContainer = this.add.container(0, 0);
        this.profileContainer.setVisible(false);

        // Cargar datos del perfil
        this.loadProfile();

        // Botón Volver
        const backButton = this.add.text(50, height - 50, '← VOLVER', {
            fontSize: '20px',
            fill: '#00aaff'
        }).setOrigin(0, 0.5);

        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        backButton.on('pointerover', () => backButton.setStyle({ fill: '#00ffff' }));
        backButton.on('pointerout', () => backButton.setStyle({ fill: '#00aaff' }));
    }

    async loadProfile() {
        try {
            const profile = await ApiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
            this.displayProfile(profile);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            this.showError('No se pudo cargar el perfil. Intenta nuevamente.');
        }
    }

    displayProfile(profile) {
        const { width, height } = this.cameras.main;

        // Ocultar mensaje de carga
        this.loadingText.setVisible(false);

        // Card de perfil
        const cardY = 180;
        const cardBg = this.add.rectangle(width / 2, cardY + 120, 500, 280, 0x001100, 0.8);
        cardBg.setStrokeStyle(2, 0x00ff00);

        // Username
        this.add.text(width / 2, cardY, 'USERNAME', {
            fontSize: '16px',
            fill: '#888888'
        }).setOrigin(0.5);

        this.add.text(width / 2, cardY + 30, profile.username, {
            fontSize: '32px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Email
        this.add.text(width / 2, cardY + 80, 'EMAIL', {
            fontSize: '16px',
            fill: '#888888'
        }).setOrigin(0.5);

        this.add.text(width / 2, cardY + 110, profile.email, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Fecha de registro
        this.add.text(width / 2, cardY + 160, 'MIEMBRO DESDE', {
            fontSize: '16px',
            fill: '#888888'
        }).setOrigin(0.5);

        const createdDate = new Date(profile.createdAt);
        const formattedDate = createdDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.add.text(width / 2, cardY + 190, formattedDate, {
            fontSize: '20px',
            fill: '#00aaff'
        }).setOrigin(0.5);

        // Botón Cerrar Sesión
        const logoutButton = this.add.text(width / 2, height - 100, 'CERRAR SESIÓN', {
            fontSize: '24px',
            fill: '#ff0000',
            backgroundColor: '#330000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        logoutButton.setInteractive({ useHandCursor: true });
        logoutButton.on('pointerdown', () => this.handleLogout());

        logoutButton.on('pointerover', () => {
            logoutButton.setStyle({ fill: '#ff3333', backgroundColor: '#550000' });
        });

        logoutButton.on('pointerout', () => {
            logoutButton.setStyle({ fill: '#ff0000', backgroundColor: '#330000' });
        });

        // Agregar todo al contenedor
        this.profileContainer.add([cardBg]);
        this.profileContainer.setVisible(true);
    }

    showError(message) {
        this.loadingText.setText(message);
        this.loadingText.setStyle({ fill: '#ff0000' });

        // Botón de reintentar
        const retryButton = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 60,
            'REINTENTAR',
            {
                fontSize: '20px',
                fill: '#00aaff',
                backgroundColor: '#003333',
                padding: { x: 15, y: 8 }
            }
        ).setOrigin(0.5);

        retryButton.setInteractive({ useHandCursor: true });
        retryButton.on('pointerdown', () => {
            retryButton.destroy();
            this.loadingText.setText('Cargando perfil...');
            this.loadingText.setStyle({ fill: '#ffffff' });
            this.loadProfile();
        });
    }

    handleLogout() {
        // Mostrar confirmación
        const { width, height } = this.cameras.main;

        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
        overlay.setOrigin(0);

        const confirmText = this.add.text(width / 2, height / 2 - 40, '¿Cerrar sesión?', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const yesButton = this.add.text(width / 2 - 80, height / 2 + 40, 'SÍ', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#003300',
            padding: { x: 30, y: 10 }
        }).setOrigin(0.5);

        const noButton = this.add.text(width / 2 + 80, height / 2 + 40, 'NO', {
            fontSize: '24px',
            fill: '#ff0000',
            backgroundColor: '#330000',
            padding: { x: 30, y: 10 }
        }).setOrigin(0.5);

        yesButton.setInteractive({ useHandCursor: true });
        noButton.setInteractive({ useHandCursor: true });

        yesButton.on('pointerdown', () => {
            TokenManager.clear();
            console.log('🔓 Sesión cerrada');
            this.scene.start('Boot');
        });

        noButton.on('pointerdown', () => {
            overlay.destroy();
            confirmText.destroy();
            yesButton.destroy();
            noButton.destroy();
        });

        // Hover effects
        yesButton.on('pointerover', () => yesButton.setStyle({ backgroundColor: '#005500' }));
        yesButton.on('pointerout', () => yesButton.setStyle({ backgroundColor: '#003300' }));
        noButton.on('pointerover', () => noButton.setStyle({ backgroundColor: '#550000' }));
        noButton.on('pointerout', () => noButton.setStyle({ backgroundColor: '#330000' }));
    }
}
