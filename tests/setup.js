// Test environment setup for Matrixhelicopter
// jest is available globally in Jest environment

// Mock Three.js for testing
global.THREE = {
    Scene: jest.fn(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        children: [],
        fog: { density: 0 }
    })),
    WebGLRenderer: jest.fn(() => ({
        setSize: jest.fn(),
        setClearColor: jest.fn(),
        render: jest.fn(),
        domElement: { addEventListener: jest.fn() },
        shadowMap: { enabled: false, type: 'PCFSoftShadowMap' }
    })),
    PerspectiveCamera: jest.fn(() => ({
        position: { set: jest.fn(), copy: jest.fn(), lerp: jest.fn() },
        lookAt: jest.fn(),
        aspect: 1,
        updateProjectionMatrix: jest.fn(),
        add: jest.fn()
    })),
    Vector3: jest.fn((x = 0, y = 0, z = 0) => ({
        x, y, z,
        set: jest.fn(),
        copy: jest.fn(),
        add: jest.fn(),
        clone: jest.fn(() => new global.THREE.Vector3(x, y, z)),
        multiplyScalar: jest.fn(),
        distanceTo: jest.fn(() => 0),
        length: jest.fn(() => 0),
        normalize: jest.fn(),
        applyEuler: jest.fn()
    })),
    Euler: jest.fn(() => ({
        x: 0, y: 0, z: 0,
        copy: jest.fn()
    })),
    Color: jest.fn(() => ({
        setHex: jest.fn()
    })),
    Clock: jest.fn(() => ({
        getDelta: jest.fn(() => 0.016)
    })),
    Group: jest.fn(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        children: [],
        position: { copy: jest.fn(), set: jest.fn() },
        rotation: { copy: jest.fn() },
        scale: { copy: jest.fn() },
        visible: true
    })),
    Mesh: jest.fn(() => ({
        position: { set: jest.fn(), copy: jest.fn() },
        rotation: { set: jest.fn(), copy: jest.fn() },
        scale: { set: jest.fn(), copy: jest.fn(), setScalar: jest.fn() },
        material: {
            color: { setHex: jest.fn() },
            opacity: 1,
            needsUpdate: false
        },
        geometry: {
            attributes: {
                position: { needsUpdate: false }
            }
        },
        userData: {}
    })),
    Points: jest.fn(() => ({
        geometry: {
            attributes: {
                position: { needsUpdate: false },
                color: { needsUpdate: false }
            }
        }
    })),
    Sprite: jest.fn(() => ({
        position: { set: jest.fn(), copy: jest.fn() },
        scale: { set: jest.fn() },
        material: {
            rotation: 0,
            opacity: 1,
            map: null
        },
        userData: {}
    })),
    PointLight: jest.fn(() => ({
        position: { set: jest.fn() },
        color: { setHex: jest.fn() },
        intensity: 1
    })),
    AmbientLight: jest.fn(() => ({
        color: { setHex: jest.fn() },
        intensity: 1
    })),
    DirectionalLight: jest.fn(() => ({
        position: { set: jest.fn(), copy: jest.fn() },
        color: { setHex: jest.fn() },
        intensity: 1,
        castShadow: false,
        shadow: {
            mapSize: { width: 2048, height: 2048 }
        }
    })),
    AudioListener: jest.fn(),
    Audio: jest.fn(() => ({
        setBuffer: jest.fn(),
        play: jest.fn(),
        stop: jest.fn(),
        setVolume: jest.fn()
    })),
    AudioLoader: jest.fn(() => ({
        load: jest.fn()
    })),
    // Geometry types
    CapsuleGeometry: jest.fn(),
    BoxGeometry: jest.fn(),
    SphereGeometry: jest.fn(),
    CylinderGeometry: jest.fn(),
    PlaneGeometry: jest.fn(),
    RingGeometry: jest.fn(),
    BufferGeometry: jest.fn(() => ({
        setAttribute: jest.fn(),
        setFromPoints: jest.fn(),
        attributes: {
            position: { array: new Float32Array(300), needsUpdate: false },
            color: { array: new Float32Array(300), needsUpdate: false }
        }
    })),
    Float32BufferAttribute: jest.fn(),
    // Materials
    MeshPhongMaterial: jest.fn(() => ({
        color: { setHex: jest.fn() },
        emissive: { setHex: jest.fn() },
        opacity: 1,
        transparent: false
    })),
    MeshBasicMaterial: jest.fn(() => ({
        color: { setHex: jest.fn() },
        opacity: 1,
        transparent: false
    })),
    PointsMaterial: jest.fn(() => ({
        color: { setHex: jest.fn() },
        size: 2,
        opacity: 1,
        transparent: false
    })),
    LineBasicMaterial: jest.fn(() => ({
        color: { setHex: jest.fn() },
        opacity: 1,
        transparent: false
    })),
    SpriteMaterial: jest.fn(() => ({
        map: null,
        transparent: true,
        rotation: 0,
        opacity: 1
    })),
    ShaderMaterial: jest.fn(() => ({
        uniforms: {},
        vertexShader: '',
        fragmentShader: '',
        transparent: false,
        side: 'FrontSide'
    })),
    CanvasTexture: jest.fn(),
    // Utilities
    MathUtils: {
        lerp: jest.fn((a, b, t) => a + (b - a) * t)
    },
    GridHelper: jest.fn(() => ({
        position: { y: 0 }
    })),
    Fog: jest.fn(() => ({
        density: 0
    })),
    Line: jest.fn(),
    // Constants
    PCFSoftShadowMap: 'PCFSoftShadowMap',
    BackSide: 'BackSide',
    DoubleSide: 'DoubleSide',
    AdditiveBlending: 'AdditiveBlending'
};

// Mock Canvas and WebGL context
// Check if HTMLCanvasElement exists (browser vs Node.js)
if (typeof HTMLCanvasElement === 'undefined') {
    global.HTMLCanvasElement = function() {
        return {
            width: 32,
            height: 32,
            getContext: jest.fn(() => ({
                fillStyle: '',
                fillRect: jest.fn(),
                fillText: jest.fn(),
                globalAlpha: 1,
                font: '',
                textAlign: '',
                textBaseline: ''
            }))
        };
    };
    global.HTMLCanvasElement.prototype = {
        getContext: jest.fn(() => ({
            fillStyle: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            globalAlpha: 1,
            font: '',
            textAlign: '',
            textBaseline: ''
        }))
    };
} else {
    global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        fillStyle: '',
        fillRect: jest.fn(),
        fillText: jest.fn(),
        globalAlpha: 1,
        font: '',
        textAlign: '',
        textBaseline: ''
    }));
}

// Mock missing browser globals for Node.js environment
if (typeof document === 'undefined') {
    global.document = {};
}

if (typeof window === 'undefined') {
    global.window = {};
}

// Mock document methods
global.document.createElement = jest.fn((tagName) => {
    if (tagName === 'canvas') {
        return {
            width: 32,
            height: 32,
            getContext: jest.fn(() => ({
                fillStyle: '',
                fillRect: jest.fn(),
                fillText: jest.fn(),
                globalAlpha: 1,
                font: '',
                textAlign: '',
                textBaseline: ''
            }))
        };
    }
    return {
        style: { cssText: '' },
        textContent: '',
        innerHTML: '',
        addEventListener: jest.fn(),
        appendChild: jest.fn(),
        remove: jest.fn(),
        id: ''
    };
});

global.document.getElementById = jest.fn((id) => ({
    textContent: '',
    innerHTML: '',
    style: { display: 'block', cssText: '' },
    appendChild: jest.fn(),
    addEventListener: jest.fn()
}));

global.document.body = {
    appendChild: jest.fn()
};

global.document.head = {
    appendChild: jest.fn()
};

// Mock window and browser APIs
global.window = {
    innerWidth: 800,
    innerHeight: 600,
    addEventListener: jest.fn(),
    requestAnimationFrame: jest.fn((cb) => setTimeout(cb, 16)),
    AudioContext: jest.fn(() => ({
        createOscillator: jest.fn(() => ({
            type: 'sine',
            frequency: { setValueAtTime: jest.fn() },
            connect: jest.fn(),
            start: jest.fn()
        })),
        createGain: jest.fn(() => ({
            gain: { setValueAtTime: jest.fn() },
            connect: jest.fn()
        })),
        createBiquadFilter: jest.fn(() => ({
            type: 'lowpass',
            frequency: { setValueAtTime: jest.fn() },
            Q: { setValueAtTime: jest.fn() },
            connect: jest.fn()
        })),
        destination: {},
        currentTime: 0,
        state: 'running',
        resume: jest.fn()
    })),
    localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    }
};

// Mock performance API
global.performance = {
    now: jest.fn(() => Date.now())
};

// Mock Date.now for consistent testing
const originalDateNow = Date.now;
Date.now = jest.fn(() => 1000000); // Fixed timestamp for testing

// Console override for test logging
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

global.testLogs = [];

console.log = (...args) => {
    global.testLogs.push({ level: 'log', message: args.join(' ') });
    if (process.env.VERBOSE_TESTS) originalLog(...args);
};

console.warn = (...args) => {
    global.testLogs.push({ level: 'warn', message: args.join(' ') });
    if (process.env.VERBOSE_TESTS) originalWarn(...args);
};

console.error = (...args) => {
    global.testLogs.push({ level: 'error', message: args.join(' ') });
    if (process.env.VERBOSE_TESTS) originalError(...args);
};

// Setup cleanup
afterEach(() => {
    global.testLogs = [];
    jest.clearAllMocks();
});

afterAll(() => {
    Date.now = originalDateNow;
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
});

// No need to export jest as it's globally available