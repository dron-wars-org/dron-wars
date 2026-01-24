import { describe, it, expect, vi, beforeEach } from 'vitest';
import Bullet from '../src/objects/Bullet';

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

describe('Bullet', () => {
    let scene;
    let bullet;

    beforeEach(() => {
        scene = new MockScene();
        bullet = new Bullet(scene, 100, 50);
    });

    describe('Initialization', () => {
        it('should be added to scene', () => {
            expect(scene.add.existing).toHaveBeenCalledWith(bullet);
        });

        it('should have physics enabled', () => {
            expect(scene.physics.add.existing).toHaveBeenCalledWith(bullet);
        });

        it('should set circular collision body', () => {
            expect(bullet.body.setCircle).toHaveBeenCalledWith(5);
        });

        it('should set horizontal velocity', () => {
            expect(bullet.body.setVelocityX).toHaveBeenCalledWith(500);
        });
    });

    describe('Graphics', () => {
        it('should create graphics for bullet visualization', () => {
            expect(scene.add.graphics).toHaveBeenCalled();
        });

        it('should draw cyan circle', () => {
            const graphics = scene.add.graphics();
            expect(graphics.fillStyle).toHaveBeenCalledWith(0x00ffff, 1);
            expect(graphics.fillCircle).toHaveBeenCalledWith(0, 0, 5);
        });
    });
});
