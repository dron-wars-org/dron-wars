import Phaser from 'phaser';
import Player from '../objects/Player.js';
import Bullet from '../objects/Bullet.js';
import EnemyFloater from '../objects/enemies/EnemyFloater.js';
import EnemyChaser from '../objects/enemies/EnemyChaser.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a2e');

        // Bullets array (simple, no pooling)
        this.bullets = [];

        // Enemies Group
        this.enemies = this.physics.add.group({
            runChildUpdate: true
        });

        // Player
        this.player = new Player(this, 100, 300, this.bullets);

        // Spawning Timer
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        // Update player
        this.player.update(time);

        // Update and cleanup bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.x > 850) {
                bullet.destroy();
                this.bullets.splice(i, 1);
            }
        }

        // Update enemies and check collisions
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;

            if (enemy.update) {
                enemy.update(time, delta, this.player);
            }

            // Check bullet collisions
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y);
                if (distance < 20) {
                    enemy.takeDamage();
                    bullet.destroy();
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            // Check player collision
            const playerDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (playerDistance < 30) {
                this.hitPlayer(this.player, enemy);
            }
        });
    }

    spawnEnemy() {
        const x = 850;
        const y = Phaser.Math.Between(50, 550);
        const type = Phaser.Math.Between(0, 1);
        let enemy;

        if (type === 0) {
            enemy = new EnemyFloater(this, x, y);
        } else {
            enemy = new EnemyChaser(this, x, y);
        }

        this.enemies.add(enemy);
        enemy.spawn(x, y);
    }

    hitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        enemy.takeDamage();
    }

    hitPlayer(player, enemy) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver');
        });
    }
}
