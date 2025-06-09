import { TestFlight } from '../../src/features/TestFlight.js';
import * as THREE from 'three';

// Mock dependencies
const mockGame = {
    camera: new THREE.PerspectiveCamera(),
    scene: new THREE.Scene()
};

const mockHelicopter = {
    position: new THREE.Vector3(0, 20, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    typeManager: {
        changeHelicopterType: jest.fn()
    },
    changeHelicopterType: jest.fn(),
    engageAutorotation: jest.fn()
};

const mockUI = {
    meditationUI: {
        enterMeditation: jest.fn(),
        exitMeditation: jest.fn(),
        startBreathingGuide: jest.fn(),
        isActive: false
    }
};

const mockWeather = {
    setWeather: jest.fn()
};

const mockDayNight = {
    setTimeOfDay: jest.fn(),
    accelerateTime: jest.fn()
};

const mockAchievements = {
    unlock: jest.fn()
};

// Mock DOM
global.document = {
    body: {
        appendChild: jest.fn(),
        innerHTML: '<div id="canvas-container"></div>'
    },
    createElement: jest.fn(() => ({
        id: '',
        style: {
            cssText: ''
        },
        innerHTML: '',
        textContent: '',
        addEventListener: jest.fn(),
        remove: jest.fn()
    })),
    getElementById: jest.fn(() => ({
        style: { display: 'none' },
        textContent: '',
        innerHTML: '',
        title: ''
    })),
    querySelectorAll: jest.fn(() => []),
    querySelector: jest.fn(() => ({
        textContent: '🚁 Start Test Flight'
    }))
};

describe('TestFlight', () => {
    let testFlight;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        testFlight = new TestFlight(
            mockGame,
            mockHelicopter,
            mockHelicopter,
            mockUI,
            mockWeather,
            mockDayNight,
            mockUI.meditationUI,
            mockAchievements
        );
    });

    afterEach(() => {
        if (testFlight && testFlight.isActive) {
            testFlight.endFlight();
        }
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(testFlight.isActive).toBe(false);
            expect(testFlight.currentStep).toBe(0);
            expect(testFlight.steps).toBeDefined();
            expect(testFlight.steps.length).toBeGreaterThan(15);
        });

        test('should create UI elements', () => {
            const panel = document.getElementById('test-flight-panel');
            expect(panel).toBeDefined();
            expect(panel.style.display).toBe('none');
            
            const startButton = document.querySelector('button');
            expect(startButton).toBeDefined();
            expect(startButton.textContent).toContain('Test Flight');
        });

        test('should define all test flight steps', () => {
            expect(testFlight.steps).toHaveLength(18);
            
            const stepNames = testFlight.steps.map(step => step.name);
            expect(stepNames).toContain('Welcome to Matrix Helicopter');
            expect(stepNames).toContain('Basic Flight Controls');
            expect(stepNames).toContain('Advanced Physics - Ground Effect');
            expect(stepNames).toContain('Weather System - Digital Storm');
            expect(stepNames).toContain('Helicopter Types - Quantum Paradox');
            expect(stepNames).toContain('Philosophical Zone - Cave of Shadows');
            expect(stepNames).toContain('Meditation Mode');
            expect(stepNames).toContain('Autorotation Emergency');
            expect(stepNames).toContain('Test Flight Complete');
        });
    });

    describe('Test Flight Execution', () => {
        test('should start test flight correctly', () => {
            testFlight.startTestFlight();
            
            expect(testFlight.isActive).toBe(true);
            expect(testFlight.currentStep).toBe(0);
            expect(testFlight.stepStartTime).toBeGreaterThan(0);
            
            const panel = document.getElementById('test-flight-panel');
            expect(panel.style.display).toBe('block');
        });

        test('should execute current step', () => {
            testFlight.startTestFlight();
            
            // First step should be "Welcome to Matrix Helicopter"
            expect(testFlight.steps[0].name).toBe('Welcome to Matrix Helicopter');
            
            // Should call setupInitialConditions
            expect(mockHelicopter.position.x).toBe(0);
            expect(mockHelicopter.position.y).toBe(20);
            expect(mockHelicopter.position.z).toBe(0);
        });

        test('should advance to next step', () => {
            testFlight.startTestFlight();
            const initialStep = testFlight.currentStep;
            
            testFlight.nextStep();
            
            expect(testFlight.currentStep).toBe(initialStep + 1);
        });

        test('should skip step correctly', () => {
            testFlight.startTestFlight();
            const initialStep = testFlight.currentStep;
            
            testFlight.skipStep();
            
            expect(testFlight.currentStep).toBe(initialStep + 1);
        });

        test('should end flight correctly', () => {
            testFlight.startTestFlight();
            expect(testFlight.isActive).toBe(true);
            
            testFlight.endFlight();
            
            expect(testFlight.isActive).toBe(false);
            
            const panel = document.getElementById('test-flight-panel');
            expect(panel.style.display).toBe('none');
        });
    });

    describe('Flight Path System', () => {
        test('should create flight path correctly', () => {
            const waypoints = [
                new THREE.Vector3(0, 20, 0),
                new THREE.Vector3(10, 20, 10),
                new THREE.Vector3(20, 30, 20)
            ];
            
            testFlight.createFlightPath(waypoints);
            
            expect(testFlight.flightPath).toEqual(waypoints);
            expect(testFlight.flightPathIndex).toBe(0);
        });

        test('should update auto flight correctly', () => {
            const waypoints = [
                new THREE.Vector3(100, 20, 0) // Far away point
            ];
            
            testFlight.createFlightPath(waypoints);
            const initialPosition = mockHelicopter.position.clone();
            
            testFlight.updateAutoFlight(0.016); // 60 FPS delta
            
            // Should move helicopter towards target
            const distance = mockHelicopter.position.distanceTo(initialPosition);
            expect(distance).toBeGreaterThan(0);
        });
    });

    describe('Step Implementations', () => {
        beforeEach(() => {
            testFlight.startTestFlight();
        });

        test('should setup initial conditions', () => {
            testFlight.setupInitialConditions();
            
            expect(mockHelicopter.changeHelicopterType).toHaveBeenCalledWith('matrix_scout');
            expect(mockWeather.setWeather).toHaveBeenCalledWith('clear');
            expect(mockDayNight.setTimeOfDay).toHaveBeenCalledWith(0.3);
        });

        test('should demonstrate quantum helicopter', () => {
            testFlight.demonstrateQuantumHelicopter();
            
            expect(mockHelicopter.changeHelicopterType).toHaveBeenCalledWith('quantum_paradox');
            expect(testFlight.flightPath.length).toBeGreaterThan(0);
        });

        test('should demonstrate meditation', () => {
            testFlight.demonstrateMeditation();
            
            expect(mockHelicopter.position.y).toBe(30);
            expect(mockHelicopter.velocity.x).toBe(0);
            expect(mockHelicopter.velocity.y).toBe(0);
            expect(mockHelicopter.velocity.z).toBe(0);
        });

        test('should demonstrate autorotation', () => {
            testFlight.demonstrateAutorotation();
            
            expect(mockHelicopter.changeHelicopterType).toHaveBeenCalledWith('zen_glider');
            expect(mockHelicopter.position.y).toBe(100);
        });

        test('should demonstrate weather storm', () => {
            testFlight.demonstrateWeatherStorm();
            
            expect(mockWeather.setWeather).toHaveBeenCalledWith('storm');
            expect(testFlight.flightPath.length).toBeGreaterThan(0);
        });

        test('should demonstrate code snow', () => {
            testFlight.demonstrateCodeSnow();
            
            expect(mockWeather.setWeather).toHaveBeenCalledWith('snow');
            expect(testFlight.flightPath.length).toBeGreaterThan(0);
        });

        test('should demonstrate day/night cycle', () => {
            testFlight.demonstrateDayNight();
            
            expect(mockHelicopter.position.y).toBe(50);
            expect(mockHelicopter.velocity.x).toBe(0);
        });

        test('should demonstrate achievements', () => {
            testFlight.demonstrateAchievements();
            
            expect(mockAchievements.unlock).toHaveBeenCalledWith('digital-awakening');
            expect(mockAchievements.unlock).toHaveBeenCalledWith('philosophical-wanderer');
            expect(mockAchievements.unlock).toHaveBeenCalledWith('storm-rider');
        });

        test('should execute grand finale', () => {
            testFlight.grandFinale();
            
            expect(mockWeather.setWeather).toHaveBeenCalledWith('glitch');
            expect(mockDayNight.setTimeOfDay).toHaveBeenCalledWith(0.8);
            expect(mockHelicopter.changeHelicopterType).toHaveBeenCalledWith('quantum_paradox');
            expect(testFlight.flightPath.length).toBeGreaterThan(4);
        });

        test('should complete flight', () => {
            testFlight.completeFlight();
            
            expect(mockWeather.setWeather).toHaveBeenCalledWith('clear');
            expect(mockDayNight.setTimeOfDay).toHaveBeenCalledWith(0.5);
            expect(mockHelicopter.changeHelicopterType).toHaveBeenCalledWith('matrix_scout');
        });
    });

    describe('UI Updates', () => {
        beforeEach(() => {
            testFlight.startTestFlight();
        });

        test('should update UI correctly', () => {
            testFlight.updateUI();
            
            const stepName = document.getElementById('step-name');
            const stepDescription = document.getElementById('step-description');
            const helperText = document.getElementById('helper-text');
            
            expect(stepName.textContent).toBe('Welcome to Matrix Helicopter');
            expect(stepDescription.textContent).toContain('most advanced helicopter meditation simulator');
            expect(helperText.textContent).toContain('Welcome');
        });

        test('should update progress correctly', () => {
            testFlight.updateUI();
            
            const progressBar = document.getElementById('progress-bar');
            expect(progressBar).toBeDefined();
        });
    });

    describe('Control Functions', () => {
        test('should toggle pause correctly', () => {
            testFlight.startTestFlight();
            
            const pauseButton = document.getElementById('pause-test-flight');
            expect(pauseButton.textContent).toBe('Pause');
            
            testFlight.togglePause();
            expect(pauseButton.textContent).toBe('Resume');
            
            testFlight.togglePause();
            expect(pauseButton.textContent).toBe('Pause');
        });
    });

    describe('Edge Cases', () => {
        test('should handle missing dependencies gracefully', () => {
            const testFlightWithNulls = new TestFlight(
                mockGame,
                mockHelicopter,
                mockHelicopter,
                null, // no UI
                null, // no weather
                null, // no day/night
                null, // no meditation
                null  // no achievements
            );
            
            expect(() => {
                testFlightWithNulls.startTestFlight();
            }).not.toThrow();
        });

        test('should handle update when not active', () => {
            expect(() => {
                testFlight.update(0.016);
            }).not.toThrow();
        });

        test('should handle empty flight path', () => {
            testFlight.flightPath = [];
            
            expect(() => {
                testFlight.updateAutoFlight(0.016);
            }).not.toThrow();
        });

        test('should handle end of steps', () => {
            testFlight.startTestFlight();
            testFlight.currentStep = testFlight.steps.length - 1;
            
            testFlight.nextStep();
            
            expect(testFlight.isActive).toBe(false);
        });
    });
});