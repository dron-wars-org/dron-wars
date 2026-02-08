import Phaser from 'phaser';
import API_CONFIG from '../config/api.js';
import TokenManager from '../utils/TokenManager.js';
import ApiClient from '../utils/ApiClient.js';

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

        // Crear formulario HTML
        this.createForm();

        // Link a Registro
        const registerText = this.add.text(width / 2, height - 50, '¿No tienes cuenta? Regístrate', {
            fontSize: '18px',
            fill: '#00aaff'
        }).setOrigin(0.5);

        registerText.setInteractive({ useHandCursor: true });
        registerText.on('pointerdown', () => {
            this.hideForm();
            this.scene.start('Register');
        });

        registerText.on('pointerover', () => registerText.setStyle({ fill: '#00ffff' }));
        registerText.on('pointerout', () => registerText.setStyle({ fill: '#00aaff' }));
    }

    createForm() {
        const formHTML = `
            <div id="login-form" style="
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 30px;
                border-radius: 10px;
                border: 2px solid #00ff00;
                min-width: 350px;
            ">
                <div style="margin-bottom: 20px;">
                    <label style="color: #fff; display: block; margin-bottom: 5px;">Email:</label>
                    <input type="email" id="login-email" style="
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 2px solid #00ff00;
                        background: #000;
                        color: #fff;
                        border-radius: 5px;
                    " />
                    <span id="login-email-error" style="color: #ff0000; font-size: 12px; display: none;"></span>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="color: #fff; display: block; margin-bottom: 5px;">Password:</label>
                    <input type="password" id="login-password" style="
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 2px solid #00ff00;
                        background: #000;
                        color: #fff;
                        border-radius: 5px;
                    " />
                </div>

                <button id="login-btn" style="
                    width: 100%;
                    padding: 12px;
                    font-size: 18px;
                    background: #00ff00;
                    color: #000;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">INICIAR SESIÓN</button>

                <div id="login-message" style="
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    display: none;
                "></div>
            </div>
        `;

        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHTML;
        document.body.appendChild(formContainer);

        this.emailInput = document.getElementById('login-email');
        this.passwordInput = document.getElementById('login-password');
        this.loginBtn = document.getElementById('login-btn');
        this.messageDiv = document.getElementById('login-message');

        this.loginBtn.addEventListener('click', () => this.handleLogin());

        // Permitir Enter
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleLogin();
            });
        });
    }

    async handleLogin() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        if (!email || !password) {
            this.showMessage('Todos los campos son requeridos', 'error');
            return;
        }

        this.loginBtn.disabled = true;
        this.loginBtn.textContent = 'INICIANDO...';

        try {
            const data = await ApiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                email,
                password
            });

            TokenManager.setTokens(data.accessToken, data.refreshToken, data.username);

            this.showMessage(`¡Bienvenido, ${data.username}!`, 'success');

            setTimeout(() => {
                this.hideForm();
                this.scene.start('MainMenu');
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            this.showMessage(error.message || 'Credenciales inválidas', 'error');
            this.loginBtn.disabled = false;
            this.loginBtn.textContent = 'INICIAR SESIÓN';
        }
    }

    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.style.display = 'block';
        this.messageDiv.style.background = type === 'success' ? '#00ff00' : '#ff0000';
        this.messageDiv.style.color = type === 'success' ? '#000' : '#fff';
    }

    hideForm() {
        const form = document.getElementById('login-form');
        if (form && form.parentElement) {
            form.parentElement.remove();
        }
    }

    shutdown() {
        this.hideForm();
    }
}
