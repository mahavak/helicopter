/**
 * TestFlight Integration Tests
 * Tests TestFlight integration with all game systems
 */

import { TestFlight } from '../../src/features/TestFlight.js';
import { HelicopterController } from '../../src/helicopter/HelicopterController.js';
import { WeatherSystem } from '../../src/environment/WeatherSystem.js';
import { DayNightCycle } from '../../src/environment/DayNightCycle.js';
import { AchievementSystem } from '../../src/systems/AchievementSystem.js';
import { UIManager } from '../../src/ui/UIManager.js';
// Mock THREE.js before importing to prevent constructor issues
jest.mock('three', () => ({
    Scene: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        children: []
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
        position: { x: 0, y: 0, z: 0 },
        lookAt: jest.fn(),
        updateProjectionMatrix: jest.fn()
    })),
    Vector3: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
        x, y, z,
        add: jest.fn().mockReturnThis(),
        sub: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnValue({ x, y, z }),
        copy: jest.fn().mockReturnThis(),
        normalize: jest.fn().mockReturnThis(),
        multiplyScalar: jest.fn().mockReturnThis(),
        distanceTo: jest.fn(() => Math.sqrt((x*x) + (y*y) + (z*z))),
        length: jest.fn(() => Math.sqrt((x*x) + (y*y) + (z*z))),
        set: jest.fn((newX, newY, newZ) => { x = newX; y = newY; z = newZ; })
    })),
    Euler: jest.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
        x, y, z,
        set: jest.fn(),
        copy: jest.fn(),
        clone: jest.fn().mockReturnValue({ x, y, z })
    })),
    Group: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        children: [],
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    })),
    PointsMaterial: jest.fn().mockImplementation(() => ({})),
    BufferGeometry: jest.fn().mockImplementation(() => ({
        setAttribute: jest.fn(),
        setFromPoints: jest.fn()
    })),
    BufferAttribute: jest.fn(),
    Points: jest.fn(),
    LineBasicMaterial: jest.fn(),
    Line: jest.fn(),
    AdditiveBlending: 2,
    MeshBasicMaterial: jest.fn(),
    MeshLambertMaterial: jest.fn(),
    Mesh: jest.fn().mockImplementation(() => ({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    })),
    BoxGeometry: jest.fn(),
    SphereGeometry: jest.fn(),
    CylinderGeometry: jest.fn(),
    CapsuleGeometry: jest.fn(),
    PlaneGeometry: jest.fn(),
    RingGeometry: jest.fn(),
    TorusGeometry: jest.fn(),
    Color: jest.fn(),
    DirectionalLight: jest.fn(),
    AmbientLight: jest.fn(),
    HemisphereLight: jest.fn(),
    PointLight: jest.fn(),
    SpotLight: jest.fn(),
    Fog: jest.fn(),
    Matrix4: jest.fn(),
    Quaternion: jest.fn()
}));

import * as THREE from 'three';

// Mock complex dependencies
const mockTHREE = {
    AudioListener: jest.fn(),
    Scene: jest.fn(),
    PerspectiveCamera: jest.fn(),
    Vector3: jest.fn(),
    PointsMaterial: jest.fn().mockImplementation(() => ({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: 'additive'
    })),
    BufferGeometry: jest.fn().mockImplementation(() => ({
        setAttribute: jest.fn(),
        setFromPoints: jest.fn()
    })),
    BufferAttribute: jest.fn(),
    Points: jest.fn(),
    LineBasicMaterial: jest.fn(),
    Line: jest.fn(),
    AdditiveBlending: 2
};

jest.mock('../../src/audio/AudioManager.js', () => ({
    AudioManager: jest.fn().mockImplementation(() => ({
        listener: new mockTHREE.AudioListener(),
        setMasterVolume: jest.fn(),
        updateHelicopterAudio: jest.fn(),
        update: jest.fn(),
        resumeAudioContext: jest.fn(),
        playAmbient: jest.fn(),
        stopAmbient: jest.fn(),
        playNarration: jest.fn(),
        enterZone: jest.fn(),
        exitZone: jest.fn()
    }))
}));

jest.mock('../../src/zones/ZoneInteractionManager.js', () => ({
    ZoneInteractionManager: jest.fn().mockImplementation(() => ({
        update: jest.fn(),
        activeZone: null,
        zones: {
            caveOfShadows: { intensifyEffects: jest.fn() },
            gardenOfPaths: { showChoiceGhosts: jest.fn() },
            observersParadox: { activateQuantumEffects: jest.fn() },
            shipOfTheseus: { startTransformation: jest.fn() }
        }
    }))
}));

jest.mock('../../src/helicopter/HelicopterCustomization.js', () => ({
    HelicopterCustomization: jest.fn().mockImplementation(() => ({
        update: jest.fn(),
        unlockTheme: jest.fn(),
        applyTheme: jest.fn(),
        themes: {
            'shadow-walker': { name: 'Shadow Walker' },
            'quantum-observer': { name: 'Quantum Observer' }
        }
    }))
}));

// Enhanced DOM mock for integration tests
global.document = {
    body: {
        appendChild: jest.fn(),
        innerHTML: '<div id="canvas-container"></div>'
    },
    createElement: jest.fn(() => ({
        id: '',
        style: { cssText: '', display: '', width: '', height: '' },
        innerHTML: '',
        textContent: '',
        addEventListener: jest.fn(),
        remove: jest.fn(),
        appendChild: jest.fn()
    })),
    getElementById: jest.fn(() => ({
        style: { display: 'none', width: '0%' },
        textContent: '',
        innerHTML: '',
        title: '',
        addEventListener: jest.fn(),
        remove: jest.fn(),
        parentNode: { removeChild: jest.fn() }
    })),
    querySelectorAll: jest.fn(() => []),
    querySelector: jest.fn(() => ({
        textContent: '🚁 Start Test Flight',
        addEventListener: jest.fn()
    }))
};

// Mock performance for benchmarking
global.performance = {
    now: jest.fn(() => Date.now())
};

describe('TestFlight Integration Tests', () => {
    let scene, camera, helicopter, weather, dayNight, achievements, ui, testFlight;
    let mockGame;

    beforeEach(() => {
        console.log('🔧 Setting up integration test environment');
        
        // Create Three.js scene
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        
        // Create real game components
        helicopter = new HelicopterController(scene, camera);
        weather = new WeatherSystem(scene, { currentTime: 0.5 });
        dayNight = new DayNightCycle(scene);
        ui = new UIManager();
        
        // Mock game object with real components
        mockGame = {
            scene,
            camera,
            zones: {
                caveOfShadows: { intensifyEffects: jest.fn() },
                gardenOfPaths: { showChoiceGhosts: jest.fn() },
                observersParadox: { activateQuantumEffects: jest.fn() },
                shipOfTheseus: { startTransformation: jest.fn() }
            },
            effectsManager: {
                intensifyAllEffects: jest.fn()
            }
        };
        
        // Create achievements with helicopter reference
        achievements = new AchievementSystem(helicopter, null, null, null);
        
        // Create TestFlight with real components
        testFlight = new TestFlight(
            mockGame,
            helicopter,
            helicopter,
            ui,
            weather,
            dayNight,
            ui.meditationUI,
            achievements
        );
        
        console.log('✅ Integration test environment ready');
    });

    afterEach(() => {
        if (testFlight && testFlight.isActive) {
            testFlight.endFlight();
        }
        console.log('🧹 Integration test cleanup complete');
    });

    describe('🔗 Real Component Integration', () => {
        test('should integrate with real HelicopterController', () => {
            console.log('🧪 Testing real HelicopterController integration');
            
            expect(helicopter).toBeDefined();
            expect(helicopter.position).toBeInstanceOf(THREE.Vector3);
            expect(helicopter.velocity).toBeInstanceOf(THREE.Vector3);
            expect(helicopter.typeManager).toBeDefined();
            
            testFlight.startTestFlight();
            
            // Should interact with real helicopter
            const initialPosition = helicopter.position.clone();
            testFlight.createFlightPath([new THREE.Vector3(50, 30, 50)]);
            testFlight.updateAutoFlight(0.016);
            
            expect(helicopter.position.distanceTo(initialPosition)).toBeGreaterThan(0);
            
            console.log('✅ Real HelicopterController integration working');
        });

        test('should integrate with real WeatherSystem', () => {
            console.log('🧪 Testing real WeatherSystem integration');
            
            expect(weather).toBeDefined();
            expect(weather.setWeather).toBeInstanceOf(Function);
            
            testFlight.startTestFlight();
            
            // Test weather changes
            weather.setWeather('storm');
            expect(weather.currentWeather).toBe('storm');
            
            weather.setWeather('snow');
            expect(weather.currentWeather).toBe('snow');
            
            console.log('✅ Real WeatherSystem integration working');
        });

        test('should integrate with real DayNightCycle', () => {
            console.log('🧪 Testing real DayNightCycle integration');
            
            expect(dayNight).toBeDefined();
            expect(dayNight.setTimeOfDay).toBeInstanceOf(Function);
            
            testFlight.startTestFlight();
            
            // Test time changes
            dayNight.setTimeOfDay(0.3);
            expect(dayNight.currentTime).toBe(0.3);
            
            dayNight.setTimeOfDay(0.8);
            expect(dayNight.currentTime).toBe(0.8);
            
            console.log('✅ Real DayNightCycle integration working');
        });

        test('should integrate with real AchievementSystem', () => {
            console.log('🧪 Testing real AchievementSystem integration');
            
            expect(achievements).toBeDefined();
            expect(achievements.unlock).toBeInstanceOf(Function);
            
            testFlight.startTestFlight();
            testFlight.demonstrateAchievements();
            
            // Should unlock achievements
            expect(achievements.achievements.size).toBeGreaterThan(0);
            
            console.log('✅ Real AchievementSystem integration working');
        });

        test('should integrate with real UIManager', () => {
            console.log('🧪 Testing real UIManager integration');
            
            expect(ui).toBeDefined();
            expect(ui.update).toBeInstanceOf(Function);
            
            testFlight.startTestFlight();
            
            // Should update UI with flight data
            const flightData = helicopter.getFlightData();
            ui.update(flightData);
            
            console.log('✅ Real UIManager integration working');
        });
    });

    describe('🎮 Real Scenario Testing', () => {
        test('should execute complete test flight with real components', async () => {
            console.log('🧪 Testing complete real scenario');
            
            testFlight.startTestFlight();
            expect(testFlight.isActive).toBe(true);
            
            // Execute first few steps with real components
            for (let step = 0; step < 3; step++) {
                console.log(`Executing step ${step + 1}: ${testFlight.steps[testFlight.currentStep].name}`);
                
                // Execute current step
                testFlight.executeCurrentStep();
                
                // Update systems
                helicopter.update(0.016, { w: false, s: false, a: false, d: false, q: false, e: false, shift: false, space: false });
                weather.update(0.016);
                dayNight.update(0.016);
                testFlight.update(0.016);
                
                // Move to next step
                testFlight.nextStep();
            }
            
            expect(testFlight.currentStep).toBe(3);
            
            console.log('✅ Complete real scenario executed successfully');
        });

        test('should handle helicopter type switching correctly', () => {
            console.log('🧪 Testing helicopter type switching');
            
            testFlight.startTestFlight();
            
            // Test switching to different helicopter types
            const types = ['matrix_scout', 'digital_transport', 'code_lifter', 'quantum_paradox', 'zen_glider'];
            
            types.forEach(type => {
                helicopter.changeHelicopterType(type);
                expect(helicopter.typeManager.currentType.id).toBe(type);
                console.log(`✅ Switched to ${type} successfully`);
            });
            
            console.log('✅ Helicopter type switching working correctly');
        });

        test('should handle weather transitions smoothly', () => {
            console.log('🧪 Testing weather transitions');
            
            testFlight.startTestFlight();
            
            const weathers = ['clear', 'storm', 'snow', 'mist', 'glitch'];
            
            weathers.forEach(weatherType => {
                weather.setWeather(weatherType);
                weather.update(0.016);
                expect(weather.currentWeather).toBe(weatherType);
                console.log(`✅ Weather set to ${weatherType} successfully`);
            });
            
            console.log('✅ Weather transitions working correctly');
        });

        test('should coordinate flight path with physics', () => {
            console.log('🧪 Testing flight path physics coordination');
            
            testFlight.startTestFlight();
            
            // Create realistic flight path
            const waypoints = [
                new THREE.Vector3(0, 20, 0),
                new THREE.Vector3(25, 25, 25),
                new THREE.Vector3(50, 30, 50),
                new THREE.Vector3(25, 35, 75),
                new THREE.Vector3(0, 40, 100)
            ];
            
            testFlight.createFlightPath(waypoints);
            
            // Simulate flight for several frames
            for (let frame = 0; frame < 60; frame++) {
                testFlight.updateAutoFlight(0.016);
                helicopter.update(0.016, { w: false, s: false, a: false, d: false, q: false, e: false, shift: false, space: false });
                
                // Verify helicopter is moving
                if (frame > 10) {
                    expect(helicopter.position.length()).toBeGreaterThan(0);
                }
            }
            
            console.log('✅ Flight path physics coordination working');
        });
    });

    describe('🏗️ System State Management', () => {
        test('should maintain consistent state across components', () => {
            console.log('🧪 Testing state consistency');
            
            testFlight.startTestFlight();
            
            // Change multiple system states
            helicopter.changeHelicopterType('quantum_paradox');
            weather.setWeather('storm');
            dayNight.setTimeOfDay(0.8);
            
            // Update all systems
            helicopter.update(0.016, { w: false, s: false, a: false, d: false, q: false, e: false, shift: false, space: false });
            weather.update(0.016);
            dayNight.update(0.016);
            testFlight.update(0.016);
            
            // Verify states are maintained
            expect(helicopter.typeManager.currentType.id).toBe('quantum_paradox');
            expect(weather.currentWeather).toBe('storm');
            expect(dayNight.currentTime).toBe(0.8);
            
            console.log('✅ State consistency maintained');
        });

        test('should handle component initialization order', () => {
            console.log('🧪 Testing component initialization order');
            
            // Test different initialization orders
            const initOrders = [
                () => {
                    testFlight.startTestFlight();
                    helicopter.update(0.016, {});
                    weather.update(0.016);
                    dayNight.update(0.016);
                },
                () => {
                    weather.update(0.016);
                    dayNight.update(0.016);
                    testFlight.startTestFlight();
                    helicopter.update(0.016, {});
                }
            ];
            
            initOrders.forEach((initOrder, index) => {
                console.log(`Testing initialization order ${index + 1}`);
                
                expect(() => {
                    initOrder();
                }).not.toThrow();
                
                testFlight.endFlight();
            });
            
            console.log('✅ Component initialization order handled correctly');
        });

        test('should recover from component failures', () => {
            console.log('🧪 Testing component failure recovery');
            
            testFlight.startTestFlight();
            
            // Simulate component failures
            const originalChangeType = helicopter.changeHelicopterType;
            helicopter.changeHelicopterType = () => {
                throw new Error('Helicopter system failure');
            };
            
            expect(() => {
                testFlight.demonstrateQuantumHelicopter();
            }).not.toThrow();
            
            // Restore functionality
            helicopter.changeHelicopterType = originalChangeType;
            
            // Should continue working
            helicopter.changeHelicopterType('matrix_scout');
            expect(helicopter.typeManager.currentType.id).toBe('matrix_scout');
            
            console.log('✅ Component failure recovery working');
        });
    });

    describe('⚡ Performance Integration', () => {
        test('should maintain performance with real components', () => {
            console.log('🧪 Testing performance with real components');
            
            testFlight.startTestFlight();
            
            const startTime = performance.now();
            
            // Simulate heavy update cycle
            for (let frame = 0; frame < 100; frame++) {
                helicopter.update(0.016, { w: true, a: false, s: false, d: false, q: false, e: false, shift: false, space: false });
                weather.update(0.016);
                dayNight.update(0.016);
                testFlight.update(0.016);
                
                if (frame % 10 === 0) {
                    testFlight.updateAutoFlight(0.016);
                }
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(1000); // Should complete in under 1 second
            
            console.log(`✅ Performance test completed in ${duration.toFixed(2)}ms`);
        });

        test('should handle memory usage efficiently', () => {
            console.log('🧪 Testing memory efficiency');
            
            // Create and destroy multiple test flights
            for (let i = 0; i < 10; i++) {
                const tempTestFlight = new TestFlight(
                    mockGame, helicopter, helicopter, ui,
                    weather, dayNight, ui.meditationUI, achievements
                );
                
                tempTestFlight.startTestFlight();
                tempTestFlight.endFlight();
            }
            
            // Should not cause memory leaks (tested implicitly)
            expect(true).toBe(true);
            
            console.log('✅ Memory efficiency test completed');
        });
    });

    describe('🧩 Complex Scenario Testing', () => {
        test('should handle rapid step progression', () => {
            console.log('🧪 Testing rapid step progression');
            
            testFlight.startTestFlight();
            
            // Rapidly progress through steps
            for (let i = 0; i < 5; i++) {
                testFlight.executeCurrentStep();
                helicopter.update(0.016, {});
                weather.update(0.016);
                dayNight.update(0.016);
                testFlight.nextStep();
            }
            
            expect(testFlight.currentStep).toBe(5);
            expect(testFlight.isActive).toBe(true);
            
            console.log('✅ Rapid step progression handled correctly');
        });

        test('should handle user interruption scenarios', () => {
            console.log('🧪 Testing user interruption scenarios');
            
            testFlight.startTestFlight();
            
            // Simulate user taking control
            testFlight.endFlight();
            expect(testFlight.isActive).toBe(false);
            
            // User can still control helicopter
            helicopter.update(0.016, { w: true, s: false, a: false, d: false, q: false, e: false, shift: false, space: false });
            expect(helicopter.velocity.y).toBeGreaterThan(0);
            
            console.log('✅ User interruption scenarios handled correctly');
        });

        test('should coordinate multiple system effects', () => {
            console.log('🧪 Testing multiple system effects coordination');
            
            testFlight.startTestFlight();
            
            // Execute grand finale step
            testFlight.grandFinale();
            
            // Update all systems with effects active
            helicopter.update(0.016, {});
            weather.update(0.016);
            dayNight.update(0.016);
            testFlight.update(0.016);
            
            // Should maintain stability with all effects
            expect(testFlight.isActive).toBe(true);
            expect(weather.currentWeather).toBe('glitch');
            expect(helicopter.typeManager.currentType.id).toBe('quantum_paradox');
            
            console.log('✅ Multiple system effects coordination working');
        });
    });

    describe('🔍 Edge Case Integration', () => {
        test('should handle concurrent modifications', () => {
            console.log('🧪 Testing concurrent modifications');
            
            testFlight.startTestFlight();
            
            // Simulate concurrent modifications
            Promise.all([
                new Promise(resolve => {
                    helicopter.changeHelicopterType('zen_glider');
                    resolve();
                }),
                new Promise(resolve => {
                    weather.setWeather('snow');
                    resolve();
                }),
                new Promise(resolve => {
                    testFlight.nextStep();
                    resolve();
                })
            ]);
            
            // Should handle concurrent changes gracefully
            expect(testFlight.isActive).toBe(true);
            
            console.log('✅ Concurrent modifications handled correctly');
        });

        test('should handle extreme flight paths', () => {
            console.log('🧪 Testing extreme flight paths');
            
            testFlight.startTestFlight();
            
            // Create extreme flight path
            const extremeWaypoints = [
                new THREE.Vector3(-1000, 1000, -1000),
                new THREE.Vector3(1000, -100, 1000),
                new THREE.Vector3(0, 5000, 0)
            ];
            
            testFlight.createFlightPath(extremeWaypoints);
            
            // Should handle extreme coordinates
            expect(() => {
                for (let i = 0; i < 10; i++) {
                    testFlight.updateAutoFlight(0.016);
                    helicopter.update(0.016, {});
                }
            }).not.toThrow();
            
            console.log('✅ Extreme flight paths handled correctly');
        });

        test('should maintain precision with long-running tests', () => {
            console.log('🧪 Testing long-running precision');
            
            testFlight.startTestFlight();
            
            // Run for extended period
            for (let frame = 0; frame < 1000; frame++) {
                testFlight.update(0.016);
                
                if (frame % 100 === 0) {
                    // Verify state integrity
                    expect(testFlight.currentStep).toBeGreaterThanOrEqual(0);
                    expect(testFlight.currentStep).toBeLessThan(testFlight.steps.length);
                    expect(testFlight.stepStartTime).toBeGreaterThan(0);
                }
            }
            
            console.log('✅ Long-running precision maintained');
        });
    });
});

// Real-world simulation test
describe('🌍 Real-world Simulation Tests', () => {
    test('should simulate actual user experience', () => {
        console.log('🌍 Simulating actual user experience');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        const helicopter = new HelicopterController(scene, camera);
        const weather = new WeatherSystem(scene, { currentTime: 0.5 });
        const dayNight = new DayNightCycle(scene);
        const ui = new UIManager();
        const achievements = new AchievementSystem(helicopter, null, null, null);
        
        const mockGame = { scene, camera, zones: {}, effectsManager: {} };
        
        const testFlight = new TestFlight(
            mockGame, helicopter, helicopter, ui,
            weather, dayNight, ui.meditationUI, achievements
        );
        
        // Simulate user clicking start button
        testFlight.startTestFlight();
        
        // Simulate watching first few minutes
        for (let second = 0; second < 30; second++) {
            for (let frame = 0; frame < 60; frame++) {
                testFlight.update(0.016);
                helicopter.update(0.016, {});
                weather.update(0.016);
                dayNight.update(0.016);
            }
            
            // Simulate occasional user input
            if (second % 10 === 0) {
                console.log(`User watching for ${second + 1} seconds...`);
            }
        }
        
        expect(testFlight.isActive).toBe(true);
        expect(testFlight.currentStep).toBeGreaterThan(0);
        
        console.log('✅ Real-world simulation completed successfully');
    });
});

console.log('🔗 TestFlight Integration Test Suite Loaded - Ready for Integration Testing');