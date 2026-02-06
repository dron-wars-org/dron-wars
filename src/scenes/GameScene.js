import Phaser from 'phaser';
import Player from '../objects/Player.js';
import Bullet from '../objects/Bullet.js';
import EnemyFloater from '../objects/enemies/EnemyFloater.js';
import EnemyChaser from '../objects/enemies/EnemyChaser.js';
import InputManager from '../managers/InputManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a2e');
        this.isGameOver = false;

        // 0. Input Management (New Unified System)
        this.inputManager = new InputManager(this);

        // 1. Bullet Pooling (LOB Pattern)
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        // 2. Enemy Pooling (Patterns for different types)
        this.enemyFloaters = this.physics.add.group({
            classType: EnemyFloater,
            maxSize: 20,
            runChildUpdate: true
        });

        this.enemyChasers = this.physics.add.group({
            classType: EnemyChaser,
            maxSize: 10,
            runChildUpdate: true
        });

        this.enemies = this.physics.add.group([this.enemyFloaters, this.enemyChasers]);

        // 3. Player initialization
        this.player = new Player(this, 100, 300);

        // 4. Collision Management (Optimized O(n))
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);

        // 5. Spawning Timer
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;

        // Update Input State
        this.inputManager.update();

        this.player.update(time);

        // Cleanup bullets that are off-screen (Object Pooling reuse)
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.active && bullet.x > 850) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });

        // Cleanup enemies that are off-screen
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active && enemy.x < -50) {
                enemy.setActive(false);
                enemy.setVisible(false);
            }
        });
    }

    spawnEnemy() {
        if (this.isGameOver) return;

        const x = 850;
        const y = Phaser.Math.Between(50, 550);
        const type = Phaser.Math.Between(0, 1);

        let enemy;
        if (type === 0) {
            enemy = this.enemyFloaters.get(x, y);
        } else {
            enemy = this.enemyChasers.get(x, y);
        }

        if (enemy) {
            enemy.spawn(x, y);
        }
    }

    hitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;

        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();

        enemy.takeDamage();
    }

    hitPlayer(player, enemy) {
        console.log('🔴 [COLLISION] hitPlayer called');

        if (this.isGameOver) {
            console.log('⚠️ [COLLISION] Already game over, ignoring');
            return;
        }

        console.log('🎮 [GAME OVER] Setting isGameOver flag to true');
        this.isGameOver = true;

        // Visual feedback - redraw player in red
        console.log('🎨 [VISUAL] Changing player color to red');
        player.graphics.clear();
        player.graphics.fillStyle(0xff0000, 1);
        player.graphics.fillRect(0, 0, 40, 20);
        player.graphics.fillStyle(0xaa0000, 1);
        player.graphics.fillTriangle(40, 0, 50, 10, 40, 20);

        // Use scene sleep/wake instead of physics.pause to keep timers working
        console.log('⏸️ [SCENE] Pausing scene');
        this.scene.pause();

        // Use a setTimeout instead of Phaser timer (not affected by scene pause)
        console.log('⏱️ [TIMER] Setting setTimeout for 1000ms');
        setTimeout(() => {
            console.log('✅ [TIMER] setTimeout executed!');
            console.log('🛑 [SCENE] Stopping GameScene');
            this.scene.stop();
            console.log('▶️ [SCENE] Starting GameOver scene');
            this.scene.start('GameOver');
            console.log('🏁 [DONE] Scene transition complete');
        }, 1000);

        console.log('📝 [HITPLAYER] hitPlayer function completed');
    }
}
