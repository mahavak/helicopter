import { AdvancedHelicopterPhysics } from '../../src/helicopter/AdvancedHelicopterPhysics.js';
import * as THREE from 'three';

// Mock helicopter controller
const createMockController = () => ({
    position: new THREE.Vector3(0, 50, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    collective: 0.5,
    pedal: 0,
    rotorSpeed: 6.67, // 400 RPM / 60
    mass: 800
});

describe('AdvancedHelicopterPhysics', () => {
    let physics;
    let mockController;

    beforeEach(() => {
        mockController = createMockController();
        physics = new AdvancedHelicopterPhysics(mockController);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(physics.controller).toBe(mockController);
            expect(physics.airDensity).toBe(1.225);
            expect(physics.rotorRadius).toBe(4.0);
            expect(physics.rotorArea).toBeCloseTo(Math.PI * 16, 5);
            expect(physics.groundEffectHeight).toBe(6.0); // 1.5 * rotorRadius
            expect(physics.windVector).toBeInstanceOf(THREE.Vector3);
            expect(physics.autorotationEngaged).toBe(false);
        });

        test('should calculate rotor area correctly', () => {
            const expectedArea = Math.PI * physics.rotorRadius * physics.rotorRadius;
            expect(physics.rotorArea).toBeCloseTo(expectedArea, 5);
        });

        test('should initialize environmental factors', () => {
            expect(physics.turbulenceIntensity).toBe(0);
            expect(physics.densityAltitude).toBe(0);
            expect(physics.windVector.length()).toBe(0);
        });
    });

    describe('Lift Force Calculations', () => {
        test('should calculate basic lift force', () => {
            const collective = 0.5;
            const rpm = 400;
            const velocity = new THREE.Vector3(0, 0, 0);
            
            const lift = physics.calculateLiftForce(collective, rpm, velocity);
            
            expect(lift).toBeInstanceOf(THREE.Vector3);
            expect(lift.y).toBeGreaterThan(0); // Should produce upward force
            expect(lift.x).toBe(0);
            expect(lift.z).toBe(0);
        });

        test('should increase lift with higher collective', () => {
            const velocity = new THREE.Vector3(0, 0, 0);
            const rpm = 400;
            
            const lowLift = physics.calculateLiftForce(0.3, rpm, velocity);
            const highLift = physics.calculateLiftForce(0.8, rpm, velocity);
            
            expect(highLift.y).toBeGreaterThan(lowLift.y);
        });

        test('should increase lift with higher RPM', () => {
            const collective = 0.5;
            const velocity = new THREE.Vector3(0, 0, 0);
            
            const lowRPMLift = physics.calculateLiftForce(collective, 300, velocity);
            const highRPMLift = physics.calculateLiftForce(collective, 500, velocity);
            
            expect(highRPMLift.y).toBeGreaterThan(lowRPMLift.y);
        });

        test('should apply ground effect near ground', () => {
            mockController.position.y = 3; // Within ground effect height
            
            const lift = physics.calculateLiftForce(0.5, 400, new THREE.Vector3(0, 0, 0));
            const groundEffect = physics.calculateGroundEffect();
            
            expect(groundEffect).toBeGreaterThan(1.0);
            expect(lift.y).toBeGreaterThan(0);
        });

        test('should not apply ground effect at high altitude', () => {
            mockController.position.y = 100; // Above ground effect height
            
            const groundEffect = physics.calculateGroundEffect();
            
            expect(groundEffect).toBe(1.0);
        });
    });

    describe('Ground Effect Calculations', () => {
        test('should calculate maximum ground effect at ground level', () => {
            mockController.position.y = 0;
            
            const effect = physics.calculateGroundEffect();
            
            expect(effect).toBeCloseTo(1.25, 2); // Maximum 25% increase
        });

        test('should calculate no ground effect above threshold', () => {
            mockController.position.y = physics.groundEffectHeight + 1;
            
            const effect = physics.calculateGroundEffect();
            
            expect(effect).toBe(1.0);
        });

        test('should calculate intermediate ground effect', () => {
            mockController.position.y = physics.groundEffectHeight / 2;
            
            const effect = physics.calculateGroundEffect();
            
            expect(effect).toBeGreaterThan(1.0);
            expect(effect).toBeLessThan(1.25);
        });
    });

    describe('Vortex Ring State Detection', () => {
        test('should detect vortex ring state during rapid descent', () => {
            const velocity = new THREE.Vector3(0, -5, 0); // Fast descent
            
            const isInVortex = physics.isInVortexRingState(velocity);
            
            expect(isInVortex).toBe(true);
        });

        test('should not detect vortex ring state with forward speed', () => {
            const velocity = new THREE.Vector3(20, -5, 0); // Fast descent with forward speed
            
            const isInVortex = physics.isInVortexRingState(velocity);
            
            expect(isInVortex).toBe(false);
        });

        test('should not detect vortex ring state during climb', () => {
            const velocity = new THREE.Vector3(0, 5, 0); // Climbing
            
            const isInVortex = physics.isInVortexRingState(velocity);
            
            expect(isInVortex).toBe(false);
        });

        test('should not detect vortex ring state during slow descent', () => {
            const velocity = new THREE.Vector3(0, -1, 0); // Slow descent
            
            const isInVortex = physics.isInVortexRingState(velocity);
            
            expect(isInVortex).toBe(false);
        });
    });

    describe('Torque Effects', () => {
        test('should calculate torque based on collective and RPM', () => {
            const torque = physics.calculateTorqueEffects(400, 0.5);
            
            expect(typeof torque).toBe('number');
            expect(torque).not.toBe(0);
        });

        test('should increase torque with higher collective', () => {
            const lowTorque = physics.calculateTorqueEffects(400, 0.3);
            const highTorque = physics.calculateTorqueEffects(400, 0.8);
            
            expect(Math.abs(highTorque)).toBeGreaterThan(Math.abs(lowTorque));
        });

        test('should apply anti-torque from pedal input', () => {
            mockController.pedal = 0.5;
            
            const torqueWithPedal = physics.calculateTorqueEffects(400, 0.5);
            
            expect(typeof torqueWithPedal).toBe('number');
        });
    });

    describe('Gyroscopic Effects', () => {
        test('should calculate gyroscopic precession', () => {
            const angularVelocity = new THREE.Vector3(0.1, 0, 0.1);
            
            const gyro = physics.calculateGyroscopicEffects(angularVelocity, 400);
            
            expect(gyro).toBeInstanceOf(THREE.Vector3);
            expect(gyro.x).not.toBe(0);
            expect(gyro.z).not.toBe(0);
        });

        test('should have opposite precession for opposite angular velocity', () => {
            const angularVel1 = new THREE.Vector3(0.1, 0, 0);
            const angularVel2 = new THREE.Vector3(-0.1, 0, 0);
            
            const gyro1 = physics.calculateGyroscopicEffects(angularVel1, 400);
            const gyro2 = physics.calculateGyroscopicEffects(angularVel2, 400);
            
            expect(gyro1.z).toBeCloseTo(-gyro2.z, 5);
        });
    });

    describe('Advanced Drag Calculations', () => {
        test('should calculate drag force', () => {
            const velocity = new THREE.Vector3(10, 0, 0);
            
            const drag = physics.calculateAdvancedDrag(velocity, 400);
            
            expect(drag).toBeInstanceOf(THREE.Vector3);
            expect(drag.length()).toBeGreaterThan(0);
        });

        test('should have drag opposite to velocity direction', () => {
            const velocity = new THREE.Vector3(10, 0, 0);
            
            const drag = physics.calculateAdvancedDrag(velocity, 400);
            
            expect(drag.x).toBeLessThan(0); // Drag opposes forward motion
        });

        test('should increase drag with higher speed', () => {
            const lowSpeedVelocity = new THREE.Vector3(5, 0, 0);
            const highSpeedVelocity = new THREE.Vector3(15, 0, 0);
            
            const lowDrag = physics.calculateAdvancedDrag(lowSpeedVelocity, 400);
            const highDrag = physics.calculateAdvancedDrag(highSpeedVelocity, 400);
            
            expect(highDrag.length()).toBeGreaterThan(lowDrag.length());
        });

        test('should handle zero velocity', () => {
            const velocity = new THREE.Vector3(0, 0, 0);
            
            const drag = physics.calculateAdvancedDrag(velocity, 400);
            
            expect(drag.length()).toBe(0);
        });
    });

    describe('Wind Effects', () => {
        test('should apply wind effects', () => {
            physics.setWind(Math.PI / 4, 10, 2); // 45 degrees, 10 m/s, turbulence 2
            
            const windEffect = physics.applyWindEffects(0.016);
            
            expect(windEffect).toBeInstanceOf(THREE.Vector3);
            expect(windEffect.length()).toBeGreaterThan(0);
        });

        test('should set wind vector correctly', () => {
            const direction = Math.PI / 2; // 90 degrees
            const speed = 5;
            
            physics.setWind(direction, speed, 1);
            
            expect(physics.windVector.x).toBeCloseTo(speed, 1);
            expect(physics.windVector.z).toBeCloseTo(0, 1);
            expect(physics.turbulenceIntensity).toBe(1);
        });

        test('should include turbulence in wind effects', () => {
            physics.setWind(0, 5, 3); // No base wind, turbulence 3
            
            const windEffect = physics.applyWindEffects(0.016);
            
            expect(windEffect.length()).toBeGreaterThan(0);
        });
    });

    describe('Ground Interaction', () => {
        test('should prevent penetration below ground', () => {
            mockController.position.y = -1; // Below ground
            mockController.velocity.y = -5;
            
            physics.handleGroundInteraction(
                mockController.position,
                mockController.velocity,
                mockController.rotation
            );
            
            expect(mockController.position.y).toBeGreaterThanOrEqual(1); // Skid height
        });

        test('should apply ground friction', () => {
            mockController.position.y = 0.5; // On ground
            mockController.velocity.x = 10;
            mockController.velocity.z = 10;
            
            const initialSpeed = Math.sqrt(
                mockController.velocity.x ** 2 + mockController.velocity.z ** 2
            );
            
            physics.handleGroundInteraction(
                mockController.position,
                mockController.velocity,
                mockController.rotation
            );
            
            const finalSpeed = Math.sqrt(
                mockController.velocity.x ** 2 + mockController.velocity.z ** 2
            );
            
            expect(finalSpeed).toBeLessThan(initialSpeed);
        });

        test('should handle bounce on hard landing', () => {
            mockController.position.y = 0.5; // On ground
            mockController.velocity.y = -3; // Hard impact
            
            physics.handleGroundInteraction(
                mockController.position,
                mockController.velocity,
                mockController.rotation
            );
            
            expect(mockController.velocity.y).toBeGreaterThan(-3); // Some energy absorbed
        });

        test('should level out rotation on ground', () => {
            mockController.position.y = 0.5; // On ground
            mockController.rotation.x = 0.5;
            mockController.rotation.z = 0.3;
            
            const initialRotX = mockController.rotation.x;
            const initialRotZ = mockController.rotation.z;
            
            physics.handleGroundInteraction(
                mockController.position,
                mockController.velocity,
                mockController.rotation
            );
            
            expect(Math.abs(mockController.rotation.x)).toBeLessThan(Math.abs(initialRotX));
            expect(Math.abs(mockController.rotation.z)).toBeLessThan(Math.abs(initialRotZ));
        });
    });

    describe('Autorotation', () => {
        test('should engage autorotation', () => {
            physics.engageAutorotation();
            
            expect(physics.autorotationEngaged).toBe(true);
        });

        test('should simulate autorotation RPM', () => {
            physics.autorotationEngaged = true;
            const velocity = new THREE.Vector3(0, -15, 30); // Optimal autorotation
            
            const rpm = physics.simulateAutorotation(0.3, velocity);
            
            expect(rpm).toBeGreaterThan(0);
            expect(rpm).toBeLessThan(600); // Reasonable RPM range
        });

        test('should optimize for specific descent rate and forward speed', () => {
            physics.autorotationEngaged = true;
            const optimalVelocity = new THREE.Vector3(0, -15, 30);
            const suboptimalVelocity = new THREE.Vector3(0, -5, 10);
            
            const optimalRPM = physics.simulateAutorotation(0.5, optimalVelocity);
            const suboptimalRPM = physics.simulateAutorotation(0.5, suboptimalVelocity);
            
            expect(optimalRPM).toBeGreaterThan(suboptimalRPM);
        });
    });

    describe('Density Corrections', () => {
        test('should calculate density correction at sea level', () => {
            mockController.position.y = 0;
            
            const correction = physics.getDensityCorrection();
            
            expect(correction).toBeCloseTo(1.0, 2);
        });

        test('should reduce density at altitude', () => {
            mockController.position.y = 5000;
            
            const correction = physics.getDensityCorrection();
            
            expect(correction).toBeLessThan(1.0);
        });

        test('should have lower density at higher altitudes', () => {
            mockController.position.y = 1000;
            const lowAltCorrection = physics.getDensityCorrection();
            
            mockController.position.y = 3000;
            const highAltCorrection = physics.getDensityCorrection();
            
            expect(highAltCorrection).toBeLessThan(lowAltCorrection);
        });
    });

    describe('Lift Coefficient', () => {
        test('should calculate lift coefficient for various angles', () => {
            const cl0 = physics.getLiftCoefficient(0);
            const cl5 = physics.getLiftCoefficient(5);
            const cl10 = physics.getLiftCoefficient(10);
            
            expect(cl5).toBeGreaterThan(cl0);
            expect(cl10).toBeGreaterThan(cl5);
        });

        test('should handle stall conditions', () => {
            const normalCl = physics.getLiftCoefficient(10);
            const stallCl = physics.getLiftCoefficient(20);
            
            expect(stallCl).toBeLessThan(normalCl);
        });

        test('should handle negative angles', () => {
            const negativeCl = physics.getLiftCoefficient(-5);
            
            expect(negativeCl).toBeLessThan(0);
        });
    });

    describe('Full Physics Update', () => {
        test('should update physics without errors', () => {
            expect(() => {
                physics.update(0.016);
            }).not.toThrow();
        });

        test('should apply all forces during update', () => {
            const initialVelocity = mockController.velocity.clone();
            
            physics.update(0.016);
            
            // Velocity should change due to forces
            expect(mockController.velocity.equals(initialVelocity)).toBe(false);
        });

        test('should handle autorotation during update', () => {
            physics.engageAutorotation();
            mockController.velocity.set(0, -15, 30);
            
            expect(() => {
                physics.update(0.016);
            }).not.toThrow();
            
            expect(mockController.rotorSpeed).toBeGreaterThan(0);
        });

        test('should update angular velocity with torque effects', () => {
            mockController.collective = 0.8;
            mockController.pedal = 0.3;
            
            const initialAngularVel = mockController.angularVelocity.y;
            
            physics.update(0.016);
            
            expect(mockController.angularVelocity.y).not.toBe(initialAngularVel);
        });
    });

    describe('Flight Status', () => {
        test('should return comprehensive flight status', () => {
            const status = physics.getFlightStatus();
            
            expect(status).toHaveProperty('groundEffect');
            expect(status).toHaveProperty('vortexRingState');
            expect(status).toHaveProperty('autorotation');
            expect(status).toHaveProperty('groundContact');
            expect(status).toHaveProperty('torque');
            expect(status).toHaveProperty('windSpeed');
            expect(status).toHaveProperty('densityAltitude');
        });

        test('should report ground effect status correctly', () => {
            mockController.position.y = 2; // Within ground effect
            
            const status = physics.getFlightStatus();
            
            expect(status.groundEffect).toBe(true);
        });

        test('should report vortex ring state correctly', () => {
            mockController.velocity.set(0, -5, 0); // Rapid descent, low forward speed
            
            const status = physics.getFlightStatus();
            
            expect(status.vortexRingState).toBe(true);
        });

        test('should report autorotation status', () => {
            physics.engageAutorotation();
            
            const status = physics.getFlightStatus();
            
            expect(status.autorotation).toBe(true);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle NaN values in velocity', () => {
            mockController.velocity.set(NaN, NaN, NaN);
            
            expect(() => {
                physics.update(0.016);
            }).not.toThrow();
        });

        test('should handle zero RPM', () => {
            mockController.rotorSpeed = 0;
            
            expect(() => {
                physics.calculateLiftForce(0.5, 0, new THREE.Vector3(0, 0, 0));
            }).not.toThrow();
        });

        test('should handle extreme collective values', () => {
            expect(() => {
                physics.calculateLiftForce(2.0, 400, new THREE.Vector3(0, 0, 0));
                physics.calculateLiftForce(-1.0, 400, new THREE.Vector3(0, 0, 0));
            }).not.toThrow();
        });

        test('should handle extreme wind conditions', () => {
            physics.setWind(0, 100, 50); // Hurricane conditions
            
            expect(() => {
                physics.applyWindEffects(0.016);
            }).not.toThrow();
        });

        test('should handle very large time steps', () => {
            expect(() => {
                physics.update(1.0); // 1 second time step
            }).not.toThrow();
        });

        test('should handle negative altitudes gracefully', () => {
            mockController.position.y = -100;
            
            expect(() => {
                physics.calculateGroundEffect();
                physics.getDensityCorrection();
            }).not.toThrow();
        });
    });
});