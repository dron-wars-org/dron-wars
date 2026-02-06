import Phaser from 'phaser';

/**
 * InputManager - Sistema unificado de control para Dron Wars
 * Soporta Teclado (WASD/Arrows) y Gamepads (incluyendo 8BitDo)
 */
export default class InputManager {
    constructor(scene) {
        this.scene = scene;

        // Configuración de Teclado
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Estado unificado
        this.state = {
            up: false,
            down: false,
            left: false,
            right: false,
            shoot: false,
            velocityX: 0,
            velocityY: 0
        };
    }

    /**
     * Actualiza el estado de los inputs. Debe llamarse en el update de la escena.
     */
    update() {
        // Reset state
        this.state.up = false;
        this.state.down = false;
        this.state.left = false;
        this.state.right = false;
        this.state.shoot = false;
        this.state.velocityX = 0;
        this.state.velocityY = 0;

        this.handleKeyboard();
        this.handleGamepad();
    }

    handleKeyboard() {
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.state.left = true;
            this.state.velocityX = -1;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.state.right = true;
            this.state.velocityX = 1;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.state.up = true;
            this.state.velocityY = -1;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.state.down = true;
            this.state.velocityY = 1;
        }

        if (this.cursors.space.isDown || this.wasd.space.isDown) {
            this.state.shoot = true;
        }
    }

    handleGamepad() {
        if (!this.scene.input.gamepad) return;

        const pads = this.scene.input.gamepad.gamepads;

        for (let i = 0; i < pads.length; i++) {
            const pad = pads[i];
            if (!pad) continue;

            // Sticks (Uso de Deadzone para evitar drift)
            const threshold = 0.2;

            // Eje Horizontal
            if (Math.abs(pad.leftStick.x) > threshold) {
                this.state.velocityX = pad.leftStick.x;
            }
            // D-Pad Horizontal
            if (pad.left || pad.buttons[14]?.pressed) this.state.velocityX = -1;
            if (pad.right || pad.buttons[15]?.pressed) this.state.velocityX = 1;

            // Eje Vertical
            if (Math.abs(pad.leftStick.y) > threshold) {
                this.state.velocityY = pad.leftStick.y;
            }
            // D-Pad Vertical
            if (pad.up || pad.buttons[12]?.pressed) this.state.velocityY = -1;
            if (pad.down || pad.buttons[13]?.pressed) this.state.velocityY = 1;

            // Botones de disparo (A, B, X, Y o R1/R2 típicamente en 8BitDo)
            if (pad.buttons[0].pressed || pad.buttons[1].pressed || pad.buttons[2].pressed || pad.buttons[3].pressed) {
                this.state.shoot = true;
            }
        }
    }

    /**
     * Retorna el vector de movimiento normalizado
     */
    getMovementVector() {
        let vx = this.state.velocityX;
        let vy = this.state.velocityY;

        // Normalización manual si es necesario (Gamepad ya puede venir normalizado por stick)
        if (vx !== 0 && vy !== 0) {
            const len = Math.sqrt(vx * vx + vy * vy);
            vx /= len;
            vy /= len;
        }

        return { x: vx, y: vy };
    }
}
