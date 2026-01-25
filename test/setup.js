import { vi } from 'vitest';

// Mock básico de Canvas para jsdom
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn((x, y, w, h) => ({ data: new Array(w * h * 4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    fillStyle: '',
    strokeStyle: ''
}));

global.HTMLCanvasElement.prototype.toDataURL = vi.fn(() => '');

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
    createGain: vi.fn(),
    connect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 16));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock Image
global.Image = class {
    constructor() {
        this.onload = null;
    }
    set src(val) {
        if (this.onload) setTimeout(this.onload, 10);
    }
};
