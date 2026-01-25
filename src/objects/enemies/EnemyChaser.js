import Enemy from './Enemy.js';

export default class EnemyChaser extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 0xff0088); // Pink/Purple
        this.speed = 200;
        this.hp = 2;
    }

    spawn(x, y) {
        super.spawn(x, y);
        this.hp = 2;
    }

    update(time, delta, player) {
        if (!this.active) return;

        // Move left
        this.body.setVelocityX(-this.speed);

        // Chase player vertically
        if (player) {
            if (player.y < this.y) {
                this.body.setVelocityY(-50);
            } else {
                this.body.setVelocityY(50);
            }
        }
    }
}
