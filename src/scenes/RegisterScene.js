import Phaser from 'phaser';
import API_CONFIG from '../config/api.js';
import ApiClient from '../utils/ApiClient.js';
import TokenManager from '../utils/TokenManager.js';

export default class RegisterScene extends Phaser.Scene {
    constructor() {
        super('Register');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Título
        this.add.text(width / 2, 80, 'DRON WARS', {
            fontSize: '48px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, 140, 'REGISTRO', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Crear formulario HTML
        this.createForm();

        // Link a Login
        const loginText = this.add.text(width / 2, height - 50, '¿Ya tienes cuenta? Inicia sesión', {
            fontSize: '18px',
            fill: '#00aaff'
        }).setOrigin(0.5);

        loginText.setInteractive({ useHandCursor: true });
        loginText.on('pointerdown', () => {
            this.hideForm();
            this.scene.start('Login');
        });

        loginText.on('pointerover', () => loginText.setStyle({ fill: '#00ffff' }));
        loginText.on('pointerout', () => loginText.setStyle({ fill: '#00aaff' }));
    }

    createForm() {
        const { width, height } = this.cameras.main;

        // Crear contenedor HTML para el formulario
        const formHTML = `
            <div id="register-form" style="
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 30px;
                border-radius: 10px;
                border: 2px solid #00ff00;
                min-width: 400px;
            ">
                <div style="margin-bottom: 20px;">
                    <label style="color: #fff; display: block; margin-bottom: 5px;">Email:</label>
                    <input type="email" id="email" style="
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 2px solid #00ff00;
                        background: #000;
                        color: #fff;
                        border-radius: 5px;
                    " />
                    <span id="email-error" style="color: #ff0000; font-size: 12px; display: none;"></span>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="color: #fff; display: block; margin-bottom: 5px;">Username:</label>
                    <input type="text" id="username" style="
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 2px solid #00ff00;
                        background: #000;
                        color: #fff;
                        border-radius: 5px;
                    " />
                    <span id="username-error" style="color: #ff0000; font-size: 12px; display: none;"></span>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="color: #fff; display: block; margin-bottom: 5px;">Password:</label>
                    <input type="password" id="password" style="
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 2px solid #00ff00;
                        background: #000;
                        color: #fff;
                        border-radius: 5px;
                    " />
                    <span id="password-error" style="color: #ff0000; font-size: 12px; display: none;"></span>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="color: #fff; display: block; margin-bottom: 5px;">Confirmar Password:</label>
                    <input type="password" id="confirmPassword" style="
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                        border: 2px solid #00ff00;
                        background: #000;
                        color: #fff;
                        border-radius: 5px;
                    " />
                    <span id="confirm-error" style="color: #ff0000; font-size: 12px; display: none;"></span>
                </div>

                <button id="register-btn" style="
                    width: 100%;
                    padding: 12px;
                    font-size: 18px;
                    background: #00ff00;
                    color: #000;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">REGISTRARSE</button>

                <div id="message" style="
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    display: none;
                "></div>

                <div style="margin-top: 20px; text-align: center;">
                    <hr style="border: 0; border-top: 1px solid #333; margin-bottom: 20px;">
                    <div id="google-login-btn" style="display: flex; justify-content: center;"></div>
                </div>
            </div>
        `;

        // Agregar formulario al DOM
        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHTML;
        document.body.appendChild(formContainer);

        // Referencias a elementos
        this.emailInput = document.getElementById('email');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.registerBtn = document.getElementById('register-btn');
        this.messageDiv = document.getElementById('message');

        // Validaciones en tiempo real
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        this.usernameInput.addEventListener('blur', () => this.validateUsername());

        // Evento de registro
        this.registerBtn.addEventListener('click', () => this.handleRegister());

        // Permitir Enter para enviar
        [this.emailInput, this.usernameInput, this.passwordInput, this.confirmPasswordInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleRegister();
            });
        });

        // Inicializar Google Sign-In
        this.initGoogleSignIn();
    }

    initGoogleSignIn() {
        if (typeof google === 'undefined') {
            setTimeout(() => this.initGoogleSignIn(), 1000);
            return;
        }

        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: (response) => this.handleGoogleLogin(response)
        });

        google.accounts.id.renderButton(
            document.getElementById('google-login-btn'),
            { theme: 'outline', size: 'large', text: 'continue_with' }
        );
    }

    async handleGoogleLogin(googleResponse) {
        this.showMessage('Verificando cuenta con Google...', 'success');

        try {
            const data = await ApiClient.post(API_CONFIG.ENDPOINTS.AUTH.GOOGLE, {
                idToken: googleResponse.credential
            });

            TokenManager.setTokens(data.accessToken, data.refreshToken, data.username);

            this.showMessage(`¡Bienvenido, ${data.username}!`, 'success');

            setTimeout(() => {
                this.hideForm();
                this.scene.start('MainMenu');
            }, 1500);
        } catch (error) {
            console.error('Error en Google Login:', error);
            this.showMessage(error.message || 'Error al iniciar sesión con Google', 'error');
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            emailError.textContent = 'El email es requerido';
            emailError.style.display = 'block';
            return false;
        }

        if (!emailRegex.test(email)) {
            emailError.textContent = 'Formato de email inválido';
            emailError.style.display = 'block';
            return false;
        }

        emailError.style.display = 'none';
        return true;
    }

    validateUsername() {
        const username = this.usernameInput.value.trim();
        const usernameError = document.getElementById('username-error');
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!username) {
            usernameError.textContent = 'El username es requerido';
            usernameError.style.display = 'block';
            return false;
        }

        if (!usernameRegex.test(username)) {
            usernameError.textContent = 'Username: 3-20 caracteres alfanuméricos y guiones bajos';
            usernameError.style.display = 'block';
            return false;
        }

        usernameError.style.display = 'none';
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const passwordError = document.getElementById('password-error');
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            passwordError.style.display = 'block';
            return false;
        }

        if (!passwordRegex.test(password)) {
            passwordError.textContent = 'Mínimo 8 caracteres, 1 mayúscula y 1 número';
            passwordError.style.display = 'block';
            return false;
        }

        passwordError.style.display = 'none';
        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const confirmError = document.getElementById('confirm-error');

        if (!confirmPassword) {
            confirmError.textContent = 'Confirma tu contraseña';
            confirmError.style.display = 'block';
            return false;
        }

        if (password !== confirmPassword) {
            confirmError.textContent = 'Las contraseñas no coinciden';
            confirmError.style.display = 'block';
            return false;
        }

        confirmError.style.display = 'none';
        return true;
    }

    async handleRegister() {
        // Validar todos los campos
        const isEmailValid = this.validateEmail();
        const isUsernameValid = this.validateUsername();
        const isPasswordValid = this.validatePassword();
        const isConfirmValid = this.validateConfirmPassword();

        if (!isEmailValid || !isUsernameValid || !isPasswordValid || !isConfirmValid) {
            return;
        }

        // Deshabilitar botón
        this.registerBtn.disabled = true;
        this.registerBtn.textContent = 'REGISTRANDO...';

        try {
            await ApiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
                email: this.emailInput.value.trim(),
                username: this.usernameInput.value.trim(),
                password: this.passwordInput.value
            });

            this.showMessage('¡Registro exitoso! Redirigiendo...', 'success');

            setTimeout(() => {
                this.hideForm();
                this.scene.start('Login');
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            this.showMessage(error.message || 'Error en el registro', 'error');
            this.registerBtn.disabled = false;
            this.registerBtn.textContent = 'REGISTRARSE';
        }
    }

    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.style.display = 'block';
        this.messageDiv.style.background = type === 'success' ? '#00ff00' : '#ff0000';
        this.messageDiv.style.color = type === 'success' ? '#000' : '#fff';
    }

    hideForm() {
        const form = document.getElementById('register-form');
        if (form && form.parentElement) {
            form.parentElement.remove();
        }
    }

    shutdown() {
        this.hideForm();
    }
}
