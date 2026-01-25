import { describe, it, expect, vi, beforeEach } from 'vitest';
import EnemyFloater from '../src/objects/enemies/EnemyFloater';

// Mock Phaser Scene
class MockScene {
    constructor() {
        this.add = {
            existing: vi.fn(),
            graphics: vi.fn().mockReturnValue({
                fillStyle: vi.fn(),
                fillCircle: vi.fn(),
                destroy: vi.fn()
            })
        };
        this.physics = {
            add: {
                existing: vi.fn((gameObject) => {
                    gameObject.body = {
                        setCircle: vi.fn(),
                        stop: vi.fn(),
                        setVelocityX: vi.fn()
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

describe('EnemyFloater', () => {
    let scene;
    let enemy;

    beforeEach(() => {
        scene = new MockScene();
        enemy = new EnemyFloater(scene, 400, 200);
    });

    describe('Initialization', () => {
        it('should initialize with correct speed', () => {
            expect(enemy.speed).toBe(150);
        });

        it('should inherit HP from Enemy base class', () => {
            expect(enemy.hp).toBe(1);
        });

        it('should use orange color', () => {
            const graphics = scene.add.graphics();
            expect(graphics.fillStyle).toHaveBeenCalledWith(0xff6600, 1);
        });
    });

    describe('Spawn', () => {
        it('should set horizontal velocity when spawned', () => {
            enemy.spawn(300, 250);
            expect(enemy.body.setVelocityX).toHaveBeenCalledWith(-150);
        });

        it('should call parent spawn method', () => {
            const setPositionSpy = vi.spyOn(enemy, 'setPosition');
            const setActiveSpy = vi.spyOn(enemy, 'setActive');
            const setVisibleSpy = vi.spyOn(enemy, 'setVisible');

            enemy.spawn(300, 250);

            expect(setPositionSpy).toHaveBeenCalledWith(300, 250);
            expect(setActiveSpy).toHaveBeenCalledWith(true);
            expect(setVisibleSpy).toHaveBeenCalledWith(true);
        });

        it('should reset HP to 1 when spawned', () => {
            enemy.hp = 0;
            enemy.spawn(300, 250);
            expect(enemy.hp).toBe(1);
        });
    });

    describe('Movement', () => {
        it('should move horizontally at spawn speed', () => {
            enemy.spawn(400, 200);
            expect(enemy.body.setVelocityX).toHaveBeenCalledWith(-150);
        });
    });
});
