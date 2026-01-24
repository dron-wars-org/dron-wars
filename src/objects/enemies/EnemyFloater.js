import Enemy from './Enemy.js';

export default class EnemyFloater extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 0xff6600); // Orange
        this.speed = 150;
    }

    spawn(x, y) {
        super.spawn(x, y);
        this.body.setVelocityX(-this.speed);
    }
}
