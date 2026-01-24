// Mock completo de Phaser para tests unitarios
// Esto evita que Phaser intente inicializarse en Node.js

export default {
    GameObjects: {
        Container: class Container {
            constructor(scene, x, y) {
                this.scene = scene;
                this.x = x || 0;
                this.y = y || 0;
                this.active = true;
                this.visible = true;
                this.list = [];
            }

            add(child) {
                this.list.push(child);
                return this;
            }

            setPosition(x, y) {
                this.x = x;
                this.y = y;
                return this;
            }

            setActive(value) {
                this.active = value;
                return this;
            }

            setVisible(value) {
                this.visible = value;
                return this;
            }
        }
    },

    Input: {
        Keyboard: {
            KeyCodes: {
                W: 87,
                A: 65,
                S: 83,
                D: 68,
                SPACE: 32,
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39
            }
        }
    }
};
