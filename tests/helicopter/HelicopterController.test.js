// jest is globally available
require('../setup.js');
const { HelicopterController } = require('../../src/helicopter/HelicopterController.js');

describe('HelicopterController', () => {
    let helicopter;
    let mockScene;
    let mockCamera;

    beforeEach(() => {
        mockScene = new THREE.Scene();
        mockCamera = new THREE.PerspectiveCamera();
        helicopter = new HelicopterController(mockScene, mockCamera);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(helicopter.position).toBeDefined();
            expect(helicopter.velocity).toBeDefined();
            expect(helicopter.rotation).toBeDefined();
            expect(helicopter.collective).toBe(0);
            expect(helicopter.cyclicPitch).toBe(0);
            expect(helicopter.cyclicRoll).toBe(0);
            expect(helicopter.pedal).toBe(0);
            expect(helicopter.mass).toBe(1000);
            expect(helicopter.maxLift).toBe(15000);
        });

        test('should create helicopter visual components', () => {
            expect(helicopter.helicopter).toBeDefined();
            expect(helicopter.fuselage).toBeDefined();
            expect(helicopter.mainRotor).toBeDefined();
            expect(helicopter.tailRotor).toBeDefined();
            expect(helicopter.glow).toBeDefined();
        });

        test('should add helicopter to scene', () => {
            expect(mockScene.add).toHaveBeenCalledWith(helicopter.helicopter);
        });

        test('should set initial position correctly', () => {
            expect(helicopter.position.x).toBe(0);
            expect(helicopter.position.y).toBe(50);
            expect(helicopter.position.z).toBe(0);
        });
    });

    describe('Control Processing', () => {
        test('should process collective controls correctly', () => {
            const controls = { space: true, shift: false };
            const deltaTime = 0.016;

            helicopter.processControls(controls, deltaTime);

            expect(helicopter.collective).toBeGreaterThan(0);
        });

        test('should process cyclic controls correctly', () => {
            const controls = { w: true, s: false, a: true, d: false };
            const deltaTime = 0.016;

            helicopter.processControls(controls, deltaTime);

            expect(helicopter.cyclicPitch).toBeGreaterThan(0);
            expect(helicopter.cyclicRoll).toBeGreaterThan(0);
        });

        test('should process pedal controls correctly', () => {
            const controls = { q: true, e: false };
            const deltaTime = 0.016;

            helicopter.processControls(controls, deltaTime);

            expect(helicopter.pedal).toBeGreaterThan(0);
        });

        test('should auto-center controls when released', () => {
            // Set initial control values
            helicopter.cyclicPitch = 0.5;
            helicopter.cyclicRoll = 0.5;
            helicopter.pedal = 0.5;

            const controls = {}; // No controls pressed
            const deltaTime = 0.016;

            helicopter.processControls(controls, deltaTime);

            expect(helicopter.cyclicPitch).toBeLessThan(0.5);
            expect(helicopter.cyclicRoll).toBeLessThan(0.5);
            expect(helicopter.pedal).toBeLessThan(0.5);
        });

        test('should auto-hover when no collective input', () => {
            helicopter.collective = 0.3;
            const controls = {}; // No collective input
            const deltaTime = 0.016;

            helicopter.processControls(controls, deltaTime);

            // Should move towards 0.5 (hover point)
            expect(helicopter.collective).toBeGreaterThan(0.3);
        });
    });

    describe('Physics Updates', () => {
        test('should apply gravity correctly', () => {
            const initialY = helicopter.velocity.y;
            const deltaTime = 0.016;

            helicopter.updatePhysics(deltaTime);

            expect(helicopter.velocity.y).toBeLessThan(initialY);
        });

        test('should apply lift when collective is up', () => {
            helicopter.collective = 1.0; // Full collective
            const initialY = helicopter.velocity.y;
            const deltaTime = 0.016;

            helicopter.updatePhysics(deltaTime);

            // Lift should overcome gravity
            expect(helicopter.velocity.y).toBeGreaterThan(initialY + helicopter.gravity * deltaTime);
        });

        test('should update position based on velocity', () => {
            helicopter.velocity.x = 10;
            helicopter.velocity.z = 5;
            const initialPos = { ...helicopter.position };
            const deltaTime = 0.016;

            helicopter.updatePhysics(deltaTime);

            expect(helicopter.position.x).toBeGreaterThan(initialPos.x);
            expect(helicopter.position.z).toBeGreaterThan(initialPos.z);
        });

        test('should prevent helicopter from going below ground', () => {
            helicopter.position.y = 1; // Below ground threshold
            helicopter.velocity.y = -10; // Falling

            helicopter.updatePhysics(0.016);

            expect(helicopter.position.y).toBe(2); // Ground level
            expect(helicopter.velocity.y).toBeGreaterThanOrEqual(0);
        });

        test('should apply drag to velocity', () => {
            helicopter.velocity.x = 10;
            helicopter.velocity.z = 10;
            const initialSpeed = Math.sqrt(helicopter.velocity.x ** 2 + helicopter.velocity.z ** 2);

            helicopter.updatePhysics(0.016);

            const finalSpeed = Math.sqrt(helicopter.velocity.x ** 2 + helicopter.velocity.z ** 2);
            expect(finalSpeed).toBeLessThan(initialSpeed);
        });
    });

    describe('Visual Updates', () => {
        test('should update rotor speeds based on controls', () => {
            helicopter.collective = 0.8;
            helicopter.pedal = 0.5;
            const initialRotorSpeed = helicopter.rotorSpeed;
            const initialTailRotorSpeed = helicopter.tailRotorSpeed;

            helicopter.updateVisuals(0.016);

            expect(helicopter.rotorSpeed).toBeGreaterThan(initialRotorSpeed);
            expect(helicopter.tailRotorSpeed).toBeGreaterThan(initialTailRotorSpeed);
        });

        test('should update glow intensity based on movement', () => {
            helicopter.velocity.x = 15;
            helicopter.velocity.y = 10;
            helicopter.velocity.z = 5;

            helicopter.updateVisuals(0.016);

            // Glow should be more intense with higher speed
            expect(helicopter.glow.material.opacity).toBeGreaterThan(0.05);
        });
    });

    describe('Camera Updates', () => {
        test('should update camera position to follow helicopter', () => {
            helicopter.position.x = 100;
            helicopter.position.y = 150;
            helicopter.position.z = 200;

            helicopter.updateCamera();

            expect(mockCamera.position.lerp).toHaveBeenCalled();
            expect(mockCamera.lookAt).toHaveBeenCalledWith(helicopter.position);
        });
    });

    describe('Flight Data', () => {
        test('should return correct flight data', () => {
            helicopter.position.y = 123.456;
            helicopter.velocity.x = 5;
            helicopter.velocity.y = 3;
            helicopter.velocity.z = 4;
            helicopter.collective = 0.75;

            const flightData = helicopter.getFlightData();

            expect(flightData.altitude).toBe(123);
            expect(flightData.speed).toBe(18); // ~5 m/s * 3.6 = 18 km/h
            expect(flightData.collective).toBe(0.75);
            expect(flightData.position).toBeDefined();
        });
    });

    describe('Full Update Cycle', () => {
        test('should handle complete update cycle without errors', () => {
            const controls = {
                space: true,
                w: true,
                a: true,
                q: true
            };
            const deltaTime = 0.016;

            expect(() => {
                helicopter.update(deltaTime, controls);
            }).not.toThrow();
        });

        test('should maintain stability over multiple updates', () => {
            const controls = { space: true }; // Gentle climb
            const deltaTime = 0.016;

            for (let i = 0; i < 100; i++) {
                helicopter.update(deltaTime, controls);
            }

            // Should not have exploded or become NaN
            expect(isNaN(helicopter.position.x)).toBe(false);
            expect(isNaN(helicopter.position.y)).toBe(false);
            expect(isNaN(helicopter.position.z)).toBe(false);
            expect(helicopter.position.y).toBeGreaterThan(50); // Should have climbed
        });
    });

    describe('Edge Cases', () => {
        test('should handle zero delta time', () => {
            const controls = { space: true };
            
            expect(() => {
                helicopter.update(0, controls);
            }).not.toThrow();
        });

        test('should handle very large delta time', () => {
            const controls = { space: true };
            
            expect(() => {
                helicopter.update(1.0, controls); // 1 second delta
            }).not.toThrow();
        });

        test('should handle empty controls object', () => {
            expect(() => {
                helicopter.update(0.016, {});
            }).not.toThrow();
        });

        test('should handle null controls', () => {
            expect(() => {
                helicopter.update(0.016, null);
            }).toThrow();
        });
    });
});