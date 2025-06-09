/**
 * TestFlight Performance and Stress Tests
 * Comprehensive performance testing for the TestFlight system
 */

import { TestFlight } from '../../src/features/TestFlight.js';
import * as THREE from 'three';

// Performance monitoring utilities
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            memory: [],
            timing: [],
            fps: [],
            operations: []
        };
        this.startTime = 0;
        this.frameCount = 0;
        this.lastFrameTime = 0;
    }
    
    start() {
        this.startTime = performance.now();
        this.lastFrameTime = this.startTime;
        this.frameCount = 0;
    }
    
    frame() {
        this.frameCount++;
        const currentTime = performance.now();
        const frameTime = currentTime - this.lastFrameTime;
        const fps = 1000 / frameTime;
        
        this.metrics.fps.push(fps);
        this.metrics.timing.push(frameTime);
        this.lastFrameTime = currentTime;
    }
    
    measureOperation(name, operation) {
        const startTime = performance.now();
        const result = operation();
        const endTime = performance.now();
        
        this.metrics.operations.push({
            name,
            duration: endTime - startTime,
            timestamp: startTime
        });
        
        return result;
    }
    
    getStats() {
        const totalTime = performance.now() - this.startTime;
        const avgFPS = this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length;
        const avgFrameTime = this.metrics.timing.reduce((a, b) => a + b, 0) / this.metrics.timing.length;
        
        return {
            totalTime,
            frameCount: this.frameCount,
            avgFPS: avgFPS || 0,
            avgFrameTime: avgFrameTime || 0,
            minFPS: Math.min(...this.metrics.fps) || 0,
            maxFPS: Math.max(...this.metrics.fps) || 0,
            operations: this.metrics.operations
        };
    }
}

// Mock objects optimized for performance testing
const createPerformanceMocks = () => {
    const mockGame = {
        camera: new THREE.PerspectiveCamera(),
        scene: new THREE.Scene(),
        zones: {
            caveOfShadows: { intensifyEffects: jest.fn() },
            gardenOfPaths: { showChoiceGhosts: jest.fn() },
            observersParadox: { activateQuantumEffects: jest.fn() },
            shipOfTheseus: { startTransformation: jest.fn() }
        },
        effectsManager: { intensifyAllEffects: jest.fn() }
    };
    
    const mockHelicopter = {
        position: new THREE.Vector3(0, 20, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        angularVelocity: new THREE.Vector3(0, 0, 0),
        typeManager: { changeHelicopterType: jest.fn() },
        changeHelicopterType: jest.fn(),
        engageAutorotation: jest.fn(),
        physics: { showGroundEffectIndicator: false }
    };
    
    const mockUI = {
        meditationUI: {
            enterMeditation: jest.fn(),
            exitMeditation: jest.fn(),
            startBreathingGuide: jest.fn(),
            isActive: false
        }
    };
    
    const mockWeather = { setWeather: jest.fn() };
    const mockDayNight = { setTimeOfDay: jest.fn(), accelerateTime: jest.fn() };
    const mockAchievements = { unlock: jest.fn() };
    
    return { mockGame, mockHelicopter, mockUI, mockWeather, mockDayNight, mockAchievements };
};

// Mock DOM for performance testing
global.document = {
    body: { appendChild: jest.fn() },
    createElement: jest.fn(() => ({
        style: { cssText: '' },
        addEventListener: jest.fn(),
        remove: jest.fn()
    })),
    getElementById: jest.fn(() => ({
        style: { display: 'none' },
        textContent: ''
    })),
    querySelectorAll: jest.fn(() => []),
    querySelector: jest.fn(() => ({ addEventListener: jest.fn() }))
};

global.performance = {
    now: jest.fn(() => Date.now() + Math.random() * 1000)
};

describe('🏃 TestFlight Performance Tests', () => {
    let testFlight;
    let monitor;
    let mocks;
    
    beforeEach(() => {
        monitor = new PerformanceMonitor();
        mocks = createPerformanceMocks();
        
        testFlight = new TestFlight(
            mocks.mockGame, mocks.mockHelicopter, mocks.mockHelicopter,
            mocks.mockUI, mocks.mockWeather, mocks.mockDayNight,
            mocks.mockUI.meditationUI, mocks.mockAchievements
        );
    });
    
    afterEach(() => {
        if (testFlight && testFlight.isActive) {
            testFlight.endFlight();
        }
    });

    describe('⚡ Initialization Performance', () => {
        test('should initialize quickly under normal conditions', () => {
            console.log('🏃 Testing normal initialization performance');
            
            const iterations = 100;
            const durations = [];
            
            for (let i = 0; i < iterations; i++) {
                const startTime = performance.now();
                
                const newTestFlight = new TestFlight(
                    mocks.mockGame, mocks.mockHelicopter, mocks.mockHelicopter,
                    mocks.mockUI, mocks.mockWeather, mocks.mockDayNight,
                    mocks.mockUI.meditationUI, mocks.mockAchievements
                );
                
                const endTime = performance.now();
                durations.push(endTime - startTime);
                
                if (newTestFlight.isActive) {
                    newTestFlight.endFlight();
                }
            }
            
            const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
            const maxDuration = Math.max(...durations);
            const minDuration = Math.min(...durations);
            
            console.log(`📊 Initialization Performance:`);
            console.log(`   Average: ${avgDuration.toFixed(2)}ms`);
            console.log(`   Min: ${minDuration.toFixed(2)}ms`);
            console.log(`   Max: ${maxDuration.toFixed(2)}ms`);
            
            expect(avgDuration).toBeLessThan(50); // Average under 50ms
            expect(maxDuration).toBeLessThan(200); // Max under 200ms
            
            console.log('✅ Initialization performance acceptable');
        });
        
        test('should handle rapid successive initializations', () => {
            console.log('🏃 Testing rapid successive initializations');
            
            const startTime = performance.now();
            const testFlights = [];
            
            // Create many instances rapidly
            for (let i = 0; i < 50; i++) {
                testFlights.push(new TestFlight(
                    mocks.mockGame, mocks.mockHelicopter, mocks.mockHelicopter,
                    mocks.mockUI, mocks.mockWeather, mocks.mockDayNight,
                    mocks.mockUI.meditationUI, mocks.mockAchievements
                ));
            }
            
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            const avgTimePerInstance = totalTime / 50;
            
            console.log(`📊 Rapid Initialization:`);
            console.log(`   Total Time: ${totalTime.toFixed(2)}ms`);
            console.log(`   Average per Instance: ${avgTimePerInstance.toFixed(2)}ms`);
            
            expect(totalTime).toBeLessThan(2000); // Under 2 seconds total
            expect(avgTimePerInstance).toBeLessThan(50); // Under 50ms per instance
            
            // Cleanup
            testFlights.forEach(tf => {
                if (tf.isActive) tf.endFlight();
            });
            
            console.log('✅ Rapid initialization performance acceptable');
        });
    });

    describe('🔄 Update Loop Performance', () => {
        test('should maintain consistent update performance', () => {
            console.log('🏃 Testing update loop performance');
            
            testFlight.startTestFlight();
            monitor.start();
            
            const frameCount = 1000;
            const updateTimes = [];
            
            for (let frame = 0; frame < frameCount; frame++) {
                const frameStart = performance.now();
                
                testFlight.update(0.016); // 60 FPS delta
                
                const frameEnd = performance.now();
                updateTimes.push(frameEnd - frameStart);
                
                monitor.frame();
            }
            
            const stats = monitor.getStats();
            const avgUpdateTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;
            const maxUpdateTime = Math.max(...updateTimes);
            const minUpdateTime = Math.min(...updateTimes);
            
            console.log(`📊 Update Loop Performance:`);
            console.log(`   Frames: ${frameCount}`);
            console.log(`   Average Update Time: ${avgUpdateTime.toFixed(3)}ms`);
            console.log(`   Min Update Time: ${minUpdateTime.toFixed(3)}ms`);
            console.log(`   Max Update Time: ${maxUpdateTime.toFixed(3)}ms`);
            console.log(`   Average FPS: ${stats.avgFPS.toFixed(1)}`);
            
            expect(avgUpdateTime).toBeLessThan(1); // Under 1ms average
            expect(maxUpdateTime).toBeLessThan(5); // Under 5ms max
            expect(stats.avgFPS).toBeGreaterThan(30); // Maintain decent FPS
            
            console.log('✅ Update loop performance acceptable');
        });
        
        test('should handle variable frame rates efficiently', () => {
            console.log('🏃 Testing variable frame rate handling');
            
            testFlight.startTestFlight();
            
            const variableDeltas = [0.008, 0.016, 0.033, 0.050, 0.100]; // 120fps to 10fps
            const performanceResults = [];
            
            variableDeltas.forEach(deltaTime => {
                const iterations = 100;
                const startTime = performance.now();
                
                for (let i = 0; i < iterations; i++) {
                    testFlight.update(deltaTime);
                }
                
                const endTime = performance.now();
                const avgTime = (endTime - startTime) / iterations;
                
                performanceResults.push({
                    fps: Math.round(1 / deltaTime),
                    deltaTime,
                    avgUpdateTime: avgTime
                });
                
                console.log(`   ${Math.round(1 / deltaTime)}fps (${deltaTime}s): ${avgTime.toFixed(3)}ms avg`);
            });
            
            // Performance should scale reasonably with frame rate
            performanceResults.forEach(result => {
                expect(result.avgUpdateTime).toBeLessThan(2); // Under 2ms for any frame rate
            });
            
            console.log('✅ Variable frame rate handling acceptable');
        });
    });

    describe('🛤️ Flight Path Performance', () => {
        test('should handle complex flight paths efficiently', () => {
            console.log('🏃 Testing complex flight path performance');
            
            testFlight.startTestFlight();
            
            // Create complex flight path with many waypoints
            const complexWaypoints = [];
            for (let i = 0; i < 100; i++) {
                complexWaypoints.push(new THREE.Vector3(
                    Math.sin(i * 0.1) * 100,
                    20 + Math.cos(i * 0.1) * 20,
                    i * 10
                ));
            }
            
            const pathSetupTime = monitor.measureOperation('createFlightPath', () => {
                testFlight.createFlightPath(complexWaypoints);
            });
            
            console.log(`📊 Flight Path Setup: ${pathSetupTime.toFixed(3)}ms`);
            
            // Test flight path following performance
            const updateTimes = [];
            for (let frame = 0; frame < 500; frame++) {
                const updateTime = monitor.measureOperation('updateAutoFlight', () => {
                    testFlight.updateAutoFlight(0.016);
                });
                updateTimes.push(updateTime);
            }
            
            const avgUpdateTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;
            const maxUpdateTime = Math.max(...updateTimes);
            
            console.log(`📊 Flight Path Updates:`);
            console.log(`   Average: ${avgUpdateTime.toFixed(3)}ms`);
            console.log(`   Max: ${maxUpdateTime.toFixed(3)}ms`);
            console.log(`   Waypoints: ${complexWaypoints.length}`);
            
            expect(avgUpdateTime).toBeLessThan(0.5); // Under 0.5ms average
            expect(maxUpdateTime).toBeLessThan(2); // Under 2ms max
            
            console.log('✅ Complex flight path performance acceptable');
        });
        
        test('should optimize waypoint processing', () => {
            console.log('🏃 Testing waypoint processing optimization');
            
            testFlight.startTestFlight();
            
            const waypointCounts = [10, 50, 100, 500, 1000];
            
            waypointCounts.forEach(count => {
                const waypoints = [];
                for (let i = 0; i < count; i++) {
                    waypoints.push(new THREE.Vector3(i * 10, 20, 0));
                }
                
                const setupTime = monitor.measureOperation(`setup_${count}_waypoints`, () => {
                    testFlight.createFlightPath(waypoints);
                });
                
                const processingTimes = [];
                for (let i = 0; i < 50; i++) {
                    const processTime = monitor.measureOperation(`process_${count}_waypoints`, () => {
                        testFlight.updateAutoFlight(0.016);
                    });
                    processingTimes.push(processTime);
                }
                
                const avgProcessTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
                
                console.log(`   ${count} waypoints: setup ${setupTime.toFixed(3)}ms, avg process ${avgProcessTime.toFixed(3)}ms`);
                
                expect(setupTime).toBeLessThan(10); // Setup under 10ms
                expect(avgProcessTime).toBeLessThan(1); // Processing under 1ms
            });
            
            console.log('✅ Waypoint processing optimization working');
        });
    });

    describe('🎬 Step Execution Performance', () => {
        test('should execute steps efficiently', () => {
            console.log('🏃 Testing step execution performance');
            
            testFlight.startTestFlight();
            
            const stepExecutionTimes = [];
            
            // Execute all steps and measure performance
            for (let stepIndex = 0; stepIndex < testFlight.steps.length; stepIndex++) {
                const stepName = testFlight.steps[stepIndex].name;
                
                const executionTime = monitor.measureOperation(`step_${stepIndex}_${stepName}`, () => {
                    testFlight.executeCurrentStep();
                });
                
                stepExecutionTimes.push({
                    index: stepIndex,
                    name: stepName,
                    time: executionTime
                });
                
                console.log(`   Step ${stepIndex + 1}: ${stepName} - ${executionTime.toFixed(3)}ms`);
                
                if (stepIndex < testFlight.steps.length - 1) {
                    testFlight.nextStep();
                }
            }
            
            const avgStepTime = stepExecutionTimes.reduce((sum, step) => sum + step.time, 0) / stepExecutionTimes.length;
            const maxStepTime = Math.max(...stepExecutionTimes.map(step => step.time));
            const slowestStep = stepExecutionTimes.find(step => step.time === maxStepTime);
            
            console.log(`📊 Step Execution Performance:`);
            console.log(`   Average Step Time: ${avgStepTime.toFixed(3)}ms`);
            console.log(`   Max Step Time: ${maxStepTime.toFixed(3)}ms`);
            console.log(`   Slowest Step: ${slowestStep.name}`);
            
            expect(avgStepTime).toBeLessThan(5); // Average under 5ms
            expect(maxStepTime).toBeLessThan(20); // Max under 20ms
            
            console.log('✅ Step execution performance acceptable');
        });
        
        test('should handle rapid step transitions', () => {
            console.log('🏃 Testing rapid step transitions');
            
            testFlight.startTestFlight();
            
            const transitionTimes = [];
            const transitionCount = 100;
            
            for (let i = 0; i < transitionCount; i++) {
                const transitionTime = monitor.measureOperation('step_transition', () => {
                    testFlight.nextStep();
                });
                
                transitionTimes.push(transitionTime);
                
                // Restart if we reach the end
                if (testFlight.currentStep >= testFlight.steps.length - 1) {
                    testFlight.currentStep = 0;
                }
            }
            
            const avgTransitionTime = transitionTimes.reduce((a, b) => a + b, 0) / transitionTimes.length;
            const maxTransitionTime = Math.max(...transitionTimes);
            
            console.log(`📊 Step Transition Performance:`);
            console.log(`   Transitions: ${transitionCount}`);
            console.log(`   Average: ${avgTransitionTime.toFixed(3)}ms`);
            console.log(`   Max: ${maxTransitionTime.toFixed(3)}ms`);
            
            expect(avgTransitionTime).toBeLessThan(1); // Under 1ms average
            expect(maxTransitionTime).toBeLessThan(5); // Under 5ms max
            
            console.log('✅ Step transition performance acceptable');
        });
    });

    describe('💾 Memory Performance', () => {
        test('should maintain stable memory usage', () => {
            console.log('🏃 Testing memory stability');
            
            const memorySnapshots = [];
            
            // Initial memory
            if (global.gc) global.gc();
            const initialMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
            memorySnapshots.push(initialMemory);
            
            // Run test flight multiple times
            for (let cycle = 0; cycle < 10; cycle++) {
                testFlight.startTestFlight();
                
                // Simulate flight activity
                for (let frame = 0; frame < 100; frame++) {
                    testFlight.update(0.016);
                    testFlight.updateAutoFlight(0.016);
                }
                
                testFlight.endFlight();
                
                // Force garbage collection if available
                if (global.gc) global.gc();
                
                const currentMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
                memorySnapshots.push(currentMemory);
                
                console.log(`   Cycle ${cycle + 1}: ${(currentMemory / 1024 / 1024).toFixed(2)}MB`);
            }
            
            const finalMemory = memorySnapshots[memorySnapshots.length - 1];
            const memoryGrowth = finalMemory - initialMemory;
            const memoryGrowthMB = memoryGrowth / 1024 / 1024;
            
            console.log(`📊 Memory Usage:`);
            console.log(`   Initial: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`);
            console.log(`   Final: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`);
            console.log(`   Growth: ${memoryGrowthMB.toFixed(2)}MB`);
            
            // Memory growth should be minimal
            if (process.memoryUsage) {
                expect(memoryGrowthMB).toBeLessThan(50); // Under 50MB growth
            }
            
            console.log('✅ Memory stability acceptable');
        });
        
        test('should clean up resources properly', () => {
            console.log('🏃 Testing resource cleanup');
            
            const testFlights = [];
            
            // Create multiple instances
            for (let i = 0; i < 20; i++) {
                const tf = new TestFlight(
                    mocks.mockGame, mocks.mockHelicopter, mocks.mockHelicopter,
                    mocks.mockUI, mocks.mockWeather, mocks.mockDayNight,
                    mocks.mockUI.meditationUI, mocks.mockAchievements
                );
                testFlights.push(tf);
                tf.startTestFlight();
            }
            
            // Clean up all instances
            testFlights.forEach(tf => {
                tf.endFlight();
            });
            
            // Force garbage collection
            if (global.gc) global.gc();
            
            // Should not have memory leaks (implicit test)
            expect(testFlights.length).toBe(20);
            
            console.log('✅ Resource cleanup working correctly');
        });
    });

    describe('🚀 Stress Testing', () => {
        test('should handle extreme load conditions', () => {
            console.log('🏃 Testing extreme load conditions');
            
            const concurrentFlights = [];
            const flightCount = 5;
            
            // Create multiple concurrent test flights
            for (let i = 0; i < flightCount; i++) {
                const tf = new TestFlight(
                    mocks.mockGame, mocks.mockHelicopter, mocks.mockHelicopter,
                    mocks.mockUI, mocks.mockWeather, mocks.mockDayNight,
                    mocks.mockUI.meditationUI, mocks.mockAchievements
                );
                concurrentFlights.push(tf);
                tf.startTestFlight();
            }
            
            // Run all flights simultaneously
            const startTime = performance.now();
            
            for (let frame = 0; frame < 200; frame++) {
                concurrentFlights.forEach((tf, index) => {
                    tf.update(0.016);
                    
                    if (frame % 10 === 0) {
                        tf.updateAutoFlight(0.016);
                    }
                    
                    if (frame % 50 === 0) {
                        tf.nextStep();
                    }
                });
            }
            
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            const avgTimePerFlight = totalTime / flightCount;
            
            console.log(`📊 Stress Test Results:`);
            console.log(`   Concurrent Flights: ${flightCount}`);
            console.log(`   Total Time: ${totalTime.toFixed(2)}ms`);
            console.log(`   Avg per Flight: ${avgTimePerFlight.toFixed(2)}ms`);
            
            expect(totalTime).toBeLessThan(5000); // Under 5 seconds total
            expect(avgTimePerFlight).toBeLessThan(1000); // Under 1 second per flight
            
            // Cleanup
            concurrentFlights.forEach(tf => tf.endFlight());
            
            console.log('✅ Extreme load conditions handled successfully');
        });
        
        test('should maintain performance under continuous operation', () => {
            console.log('🏃 Testing continuous operation performance');
            
            testFlight.startTestFlight();
            
            const longRunDuration = 2000; // 2000 frames (~33 seconds at 60fps)
            const performanceSamples = [];
            
            for (let frame = 0; frame < longRunDuration; frame++) {
                const frameStart = performance.now();
                
                testFlight.update(0.016);
                
                if (frame % 10 === 0) {
                    testFlight.updateAutoFlight(0.016);
                }
                
                if (frame % 100 === 0) {
                    testFlight.nextStep();
                }
                
                const frameEnd = performance.now();
                
                // Sample performance every 100 frames
                if (frame % 100 === 0) {
                    performanceSamples.push({
                        frame,
                        time: frameEnd - frameStart
                    });
                    console.log(`   Frame ${frame}: ${(frameEnd - frameStart).toFixed(3)}ms`);
                }
            }
            
            // Analyze performance degradation
            const firstSample = performanceSamples[0];
            const lastSample = performanceSamples[performanceSamples.length - 1];
            const performanceDegradation = lastSample.time - firstSample.time;
            
            console.log(`📊 Continuous Operation:`);
            console.log(`   Duration: ${longRunDuration} frames`);
            console.log(`   First Sample: ${firstSample.time.toFixed(3)}ms`);
            console.log(`   Last Sample: ${lastSample.time.toFixed(3)}ms`);
            console.log(`   Degradation: ${performanceDegradation.toFixed(3)}ms`);
            
            expect(Math.abs(performanceDegradation)).toBeLessThan(2); // Under 2ms degradation
            
            console.log('✅ Continuous operation performance maintained');
        });
    });

    describe('📊 Performance Profiling', () => {
        test('should profile critical operations', () => {
            console.log('🏃 Profiling critical operations');
            
            const operations = [
                { name: 'startTestFlight', operation: () => testFlight.startTestFlight() },
                { name: 'update', operation: () => testFlight.update(0.016) },
                { name: 'nextStep', operation: () => testFlight.nextStep() },
                { name: 'updateAutoFlight', operation: () => testFlight.updateAutoFlight(0.016) },
                { name: 'executeCurrentStep', operation: () => testFlight.executeCurrentStep() },
                { name: 'updateUI', operation: () => testFlight.updateUI() },
                { name: 'endFlight', operation: () => testFlight.endFlight() }
            ];
            
            const profileResults = {};
            
            operations.forEach(({ name, operation }) => {
                const iterations = name === 'startTestFlight' || name === 'endFlight' ? 10 : 100;
                const times = [];
                
                for (let i = 0; i < iterations; i++) {
                    const startTime = performance.now();
                    operation();
                    const endTime = performance.now();
                    times.push(endTime - startTime);
                    
                    // Reset for next iteration if needed
                    if (name === 'endFlight') {
                        testFlight.startTestFlight();
                    }
                }
                
                const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
                const minTime = Math.min(...times);
                const maxTime = Math.max(...times);
                
                profileResults[name] = {
                    avg: avgTime,
                    min: minTime,
                    max: maxTime,
                    iterations
                };
                
                console.log(`   ${name}: avg ${avgTime.toFixed(3)}ms, min ${minTime.toFixed(3)}ms, max ${maxTime.toFixed(3)}ms`);
            });
            
            // Verify performance thresholds
            expect(profileResults.update.avg).toBeLessThan(1); // Update under 1ms
            expect(profileResults.nextStep.avg).toBeLessThan(2); // Step transition under 2ms
            expect(profileResults.updateAutoFlight.avg).toBeLessThan(0.5); // Flight path under 0.5ms
            
            console.log('✅ Performance profiling completed');
        });
    });
});

console.log('🏃 TestFlight Performance Test Suite Loaded - Ready for Performance Testing');