import { describe, it, expect, vi, beforeEach } from 'vitest';
import EnemyChaser from '../src/objects/enemies/EnemyChaser';

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
                        setVelocityX: vi.fn(),
                        setVelocityY: vi.fn()
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

describe('EnemyChaser', () => {
    let scene;
    let enemy;
    let mockPlayer;

    beforeEach(() => {
        scene = new MockScene();
        enemy = new EnemyChaser(scene, 400, 200);

        // Mock player
        mockPlayer = {
            x: 100,
            y: 150
        };
    });

    describe('Initialization', () => {
        it('should initialize with correct speed', () => {
            expect(enemy.speed).toBe(200);
        });

        it('should initialize with 2 HP', () => {
            expect(enemy.hp).toBe(2);
        });

        it('should use pink/purple color', () => {
            const graphics = scene.add.graphics();
            expect(graphics.fillStyle).toHaveBeenCalledWith(0xff0088, 1);
        });
    });

    describe('Spawn', () => {
        it('should reset HP to 2 when spawned', () => {
            enemy.hp = 0;
            enemy.spawn(300, 250);
            expect(enemy.hp).toBe(2);
        });

        it('should set position when spawned', () => {
            const setPositionSpy = vi.spyOn(enemy, 'setPosition');
            enemy.spawn(300, 250);
            expect(setPositionSpy).toHaveBeenCalledWith(300, 250);
        });
    });

    describe('Update - Chase Behavior', () => {
        it('should move left horizontally', () => {
            enemy.setActive(true);
            enemy.update(0, 0, mockPlayer);
            expect(enemy.body.setVelocityX).toHaveBeenCalledWith(-200);
        });

        it('should chase player upward when player is above', () => {
            enemy.setActive(true);
            enemy.y = 200;
            mockPlayer.y = 100; // Player above enemy

            enemy.update(0, 0, mockPlayer);

            expect(enemy.body.setVelocityY).toHaveBeenCalledWith(-50);
        });

        it('should chase player downward when player is below', () => {
            enemy.setActive(true);
            enemy.y = 100;
            mockPlayer.y = 200; // Player below enemy

            enemy.update(0, 0, mockPlayer);

            expect(enemy.body.setVelocityY).toHaveBeenCalledWith(50);
        });

        it('should not move when inactive', () => {
            enemy.setActive(false);
            enemy.update(0, 0, mockPlayer);
            expect(enemy.body.setVelocityX).not.toHaveBeenCalled();
        });

        it('should handle missing player gracefully', () => {
            enemy.setActive(true);
            expect(() => enemy.update(0, 0, null)).not.toThrow();
        });
    });
});
