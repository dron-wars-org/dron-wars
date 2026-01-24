import { vi } from 'vitest';
import 'phaser';

// Mock Phaser canvas and other browser APIs not present in jsdom
global.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
});

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
    createGain: vi.fn(),
    connect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
