import { describe, it, expect, vi, beforeEach } from 'vitest';
import Player from '../src/objects/Player';

// Mock Phaser Scene
class MockScene {
    constructor() {
        this.add = {
            existing: vi.fn(),
            graphics: vi.fn().mockReturnValue({
                fillStyle: vi.fn(),
                fillRect: vi.fn(),
                fillTriangle: vi.fn(),
                fillCircle: vi.fn(),
                destroy: vi.fn()
            })
        };
        this.physics = {
            add: {
                existing: vi.fn((gameObject) => {
                    // Crear body automáticamente cuando se añade física
                    gameObject.body = {
                        setSize: vi.fn(),
                        setCircle: vi.fn(),
                        setCollideWorldBounds: vi.fn(),
                        setVelocity: vi.fn(),
                        setVelocityX: vi.fn(),
                        setVelocityY: vi.fn(),
                        stop: vi.fn(),
                        velocity: {
                            x: 0,
                            y: 0,
                            normalize: vi.fn().mockReturnThis(),
                            scale: vi.fn()
                        }
                    };
                    return gameObject;
                })
            }
        };
        this.input = {
            keyboard: {
                createCursorKeys: vi.fn().mockReturnValue({
                    left: { isDown: false },
                    right: { isDown: false },
                    up: { isDown: false },
                    down: { isDown: false },
                    space: { isDown: false }
                }),
                addKeys: vi.fn().mockReturnValue({
                    left: { isDown: false },
                    right: { isDown: false },
                    up: { isDown: false },
                    down: { isDown: false },
                    space: { isDown: false }
                })
            }
        };
        this.sys = {
            updateList: { add: vi.fn(), remove: vi.fn() },
            displayList: { add: vi.fn(), remove: vi.fn() }
        };
    }
}

describe('Player', () => {
    let scene;
    let player;
    let bullets;

    beforeEach(() => {
        scene = new MockScene();
        bullets = [];
        player = new Player(scene, 100, 100, bullets);
    });

    describe('Initialization', () => {
        it('should initialize with correct speed', () => {
            expect(player.speed).toBe(300);
        });

        it('should initialize with correct fire delay', () => {
            expect(player.fireDelay).toBe(200);
        });

        it('should set collision bounds', () => {
            expect(player.body.setCollideWorldBounds).toHaveBeenCalledWith(true);
        });

        it('should set correct body size', () => {
            expect(player.body.setSize).toHaveBeenCalledWith(50, 20);
        });
    });

    describe('Movement', () => {
        it('should move left when left arrow is pressed', () => {
            player.cursors.left.isDown = true;
            player.handleMovement();
            expect(player.body.setVelocityX).toHaveBeenCalledWith(-300);
        });

        it('should move right when right arrow is pressed', () => {
            player.cursors.right.isDown = true;
            player.handleMovement();
            expect(player.body.setVelocityX).toHaveBeenCalledWith(300);
        });

        it('should move up when up arrow is pressed', () => {
            player.cursors.up.isDown = true;
            player.handleMovement();
            expect(player.body.setVelocityY).toHaveBeenCalledWith(-300);
        });

        it('should move down when down arrow is pressed', () => {
            player.cursors.down.isDown = true;
            player.handleMovement();
            expect(player.body.setVelocityY).toHaveBeenCalledWith(300);
        });

        it('should move left when A key is pressed', () => {
            player.wasd.left.isDown = true;
            player.handleMovement();
            expect(player.body.setVelocityX).toHaveBeenCalledWith(-300);
        });

        it('should move right when D key is pressed', () => {
            player.wasd.right.isDown = true;
            player.handleMovement();
            expect(player.body.setVelocityX).toHaveBeenCalledWith(300);
        });

        it('should normalize velocity for diagonal movement', () => {
            player.cursors.right.isDown = true;
            player.cursors.up.isDown = true;
            player.handleMovement();
            expect(player.body.velocity.normalize).toHaveBeenCalled();
            expect(player.body.velocity.scale).toHaveBeenCalledWith(300);
        });

        it('should reset velocity when no keys are pressed', () => {
            player.handleMovement();
            expect(player.body.setVelocity).toHaveBeenCalledWith(0);
        });
    });

    describe('Shooting', () => {
        beforeEach(() => {
            // Limpiar bullets antes de cada test de shooting
            bullets.length = 0;
        });

        it('should create bullet when space is pressed and cooldown expired', () => {
            player.cursors.space.isDown = true;
            player.lastFired = 0;
            const currentTime = 1000;

            player.handleShooting(currentTime);

            expect(bullets.length).toBe(1);
            expect(player.lastFired).toBe(1000); // currentTime (no más + fireDelay)
        });

        it('should not create bullet when cooldown not expired', () => {
            player.cursors.space.isDown = true;
            player.lastFired = 1000;
            const currentTime = 1100; // Less than lastFired + fireDelay

            player.handleShooting(currentTime);

            expect(bullets.length).toBe(0);
        });

        it('should create bullet when WASD space is pressed', () => {
            player.wasd.space.isDown = true;
            player.lastFired = 0;
            const currentTime = 1000;

            player.handleShooting(currentTime);

            expect(bullets.length).toBe(1);
        });

        it('should not create bullet when space is not pressed', () => {
            player.cursors.space.isDown = false;
            player.wasd.space.isDown = false;
            player.lastFired = 0;
            const currentTime = 1000;

            player.handleShooting(currentTime);

            expect(bullets.length).toBe(0);
        });
    });

    describe('Update', () => {
        it('should call handleMovement and handleShooting', () => {
            const handleMovementSpy = vi.spyOn(player, 'handleMovement');
            const handleShootingSpy = vi.spyOn(player, 'handleShooting');
            const currentTime = 1000;

            player.update(currentTime);

            expect(handleMovementSpy).toHaveBeenCalled();
            expect(handleShootingSpy).toHaveBeenCalledWith(currentTime);
        });
    });
});
