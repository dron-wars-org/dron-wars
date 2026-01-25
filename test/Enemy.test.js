import { describe, it, expect, vi, beforeEach } from 'vitest';
import Enemy from '../src/objects/enemies/Enemy';
import Phaser from 'phaser';

// Mock Phaser Scene
class MockScene {
    constructor() {
        this.add = {
            existing: vi.fn(),
            graphics: vi.fn().mockReturnValue({
                fillStyle: vi.fn(),
                fillCircle: vi.fn(),
                lineStyle: vi.fn(),
                strokeCircle: vi.fn(),
                destroy: vi.fn()
            })
        };
        this.physics = {
            add: {
                existing: vi.fn((gameObject) => {
                    gameObject.body = {
                        setCircle: vi.fn(),
                        stop: vi.fn(),
                        reset: vi.fn(),
                        velocity: { x: 0, y: 0 }
                    };
                    return gameObject;
                })
            }
        };
        this.sys = {
            updateList: { add: vi.fn(), remove: vi.fn() },
            displayList: { add: vi.fn(), remove: vi.fn() }
        };
    }
}

describe('Enemy', () => {
    let scene;
    let enemy;

    beforeEach(() => {
        scene = new MockScene();
        enemy = new Enemy(scene, 100, 100);
    });

    it('should initialize with correct HP', () => {
        expect(enemy.hp).toBe(1);
    });

    it('should take damage and reduce HP', () => {
        enemy.hp = 2;
        enemy.takeDamage();
        expect(enemy.hp).toBe(1);
    });

    it('should die when HP reaches 0', () => {
        enemy.hp = 1;
        const dieSpy = vi.spyOn(enemy, 'die');

        enemy.takeDamage();

        expect(enemy.hp).toBe(0);
        expect(dieSpy).toHaveBeenCalled();
    });

    it('should deactivate and hide when dying', () => {
        enemy.setActive(true);
        enemy.setVisible(true);

        enemy.die();

        expect(enemy.active).toBe(false);
        expect(enemy.visible).toBe(false);
    });

    it('should stop body movement when dying', () => {
        enemy.die();
        expect(enemy.body.stop).toHaveBeenCalled();
    });
});
