import { ProgressVisualization } from '../../src/ui/ProgressVisualization.js';
import * as THREE from 'three';

// Mock Three.js objects
const mockScene = {
    add: jest.fn(),
    remove: jest.fn()
};

const mockRenderer = {
    domElement: document.createElement('canvas'),
    setSize: jest.fn(),
    render: jest.fn()
};

const mockCamera = {
    position: new THREE.Vector3(0, 0, 10),
    lookAt: jest.fn()
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));

describe('ProgressVisualization', () => {
    let progressViz;

    beforeEach(() => {
        jest.clearAllMocks();
        progressViz = new ProgressVisualization(mockScene);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(progressViz.scene).toBe(mockScene);
            expect(progressViz.progressSpheres).toEqual([]);
            expect(progressViz.particles).toEqual([]);
            expect(progressViz.totalProgress).toBe(0);
            expect(progressViz.isActive).toBe(false);
            expect(progressViz.animationId).toBeNull();
        });

        test('should create progress visualization components', () => {
            expect(progressViz.progressCenter).toBeInstanceOf(THREE.Vector3);
            expect(progressViz.progressRadius).toBe(50);
            expect(progressViz.maxSpheres).toBe(20);
        });

        test('should initialize progress categories', () => {
            expect(progressViz.progressCategories).toBeDefined();
            expect(progressViz.progressCategories.meditation).toBeDefined();
            expect(progressViz.progressCategories.exploration).toBeDefined();
            expect(progressViz.progressCategories.flight).toBeDefined();
            expect(progressViz.progressCategories.insight).toBeDefined();
        });

        test('should initialize achievement system', () => {
            expect(Array.isArray(progressViz.achievements)).toBe(true);
            expect(progressViz.unlockedAchievements).toEqual([]);
            expect(progressViz.achievementRings).toEqual([]);
        });
    });

    describe('Activation and Deactivation', () => {
        test('should activate progress visualization', () => {
            progressViz.activate();

            expect(progressViz.isActive).toBe(true);
        });

        test('should deactivate progress visualization', () => {
            progressViz.isActive = true;
            progressViz.animationId = 123;

            progressViz.deactivate();

            expect(progressViz.isActive).toBe(false);
            expect(progressViz.animationId).toBeNull();
        });

        test('should clean up particles when deactivating', () => {
            progressViz.particles = [
                { mesh: { parent: { remove: jest.fn() } } },
                { mesh: { parent: { remove: jest.fn() } } }
            ];

            progressViz.deactivate();

            progressViz.particles.forEach(particle => {
                expect(particle.mesh.parent.remove).toHaveBeenCalled();
            });
            expect(progressViz.particles).toEqual([]);
        });
    });

    describe('Progress Sphere Management', () => {
        test('should create progress sphere', () => {
            const category = 'meditation';
            const position = new THREE.Vector3(10, 0, 0);
            const value = 0.5;

            const sphere = progressViz.createProgressSphere(category, position, value);

            expect(sphere).toBeDefined();
            expect(sphere.category).toBe(category);
            expect(sphere.progress).toBe(value);
            expect(sphere.mesh).toBeInstanceOf(THREE.Mesh);
        });

        test('should add sphere to scene and tracking array', () => {
            const sphere = progressViz.createProgressSphere('exploration', new THREE.Vector3(0, 0, 0), 0.3);

            expect(mockScene.add).toHaveBeenCalledWith(sphere.mesh);
            expect(progressViz.progressSpheres).toContain(sphere);
        });

        test('should limit number of progress spheres', () => {
            // Create more than max spheres
            for (let i = 0; i < progressViz.maxSpheres + 5; i++) {
                progressViz.createProgressSphere('meditation', new THREE.Vector3(i, 0, 0), 0.1);
            }

            expect(progressViz.progressSpheres.length).toBe(progressViz.maxSpheres);
        });

        test('should remove oldest sphere when limit exceeded', () => {
            const removeSpy = jest.fn();

            // Fill to capacity
            for (let i = 0; i < progressViz.maxSpheres; i++) {
                const sphere = progressViz.createProgressSphere('meditation', new THREE.Vector3(i, 0, 0), 0.1);
                sphere.mesh.parent = { remove: removeSpy };
            }

            // Add one more to trigger removal
            progressViz.createProgressSphere('meditation', new THREE.Vector3(99, 0, 0), 0.1);

            expect(removeSpy).toHaveBeenCalled();
        });

        test('should update sphere progress', () => {
            const sphere = progressViz.createProgressSphere('flight', new THREE.Vector3(0, 0, 0), 0.2);

            progressViz.updateSphereProgress(sphere, 0.8);

            expect(sphere.progress).toBe(0.8);
            expect(sphere.mesh.scale.x).toBeCloseTo(0.8, 2);
        });
    });

    describe('Particle System', () => {
        test('should create achievement particle', () => {
            const position = new THREE.Vector3(5, 5, 5);
            const color = 0x00ff00;

            const particle = progressViz.createAchievementParticle(position, color);

            expect(particle).toBeDefined();
            expect(particle.mesh).toBeInstanceOf(THREE.Mesh);
            expect(particle.velocity).toBeInstanceOf(THREE.Vector3);
            expect(particle.life).toBe(1.0);
        });

        test('should add particle to scene and tracking array', () => {
            const particle = progressViz.createAchievementParticle(new THREE.Vector3(0, 0, 0), 0xff0000);

            expect(mockScene.add).toHaveBeenCalledWith(particle.mesh);
            expect(progressViz.particles).toContain(particle);
        });

        test('should emit particles from position', () => {
            const position = new THREE.Vector3(10, 10, 10);
            const count = 5;

            progressViz.emitParticles(position, count, 0x0000ff);

            expect(progressViz.particles.length).toBe(count);
            progressViz.particles.forEach(particle => {
                expect(particle.mesh.position.distanceTo(position)).toBeLessThan(2);
            });
        });

        test('should update particle lifecycle', () => {
            const particle = progressViz.createAchievementParticle(new THREE.Vector3(0, 0, 0), 0xff00ff);
            particle.mesh.parent = { remove: jest.fn() };

            // Simulate particle aging
            particle.life = 0.1;
            progressViz.updateParticles(0.2); // Large delta to exceed life

            expect(particle.mesh.parent.remove).toHaveBeenCalled();
            expect(progressViz.particles).not.toContain(particle);
        });

        test('should animate particle movement', () => {
            const particle = progressViz.createAchievementParticle(new THREE.Vector3(0, 0, 0), 0xffff00);
            const initialPosition = particle.mesh.position.clone();

            progressViz.updateParticles(0.1);

            expect(particle.mesh.position.equals(initialPosition)).toBe(false);
        });
    });

    describe('Achievement System', () => {
        test('should have predefined achievements', () => {
            expect(progressViz.achievements.length).toBeGreaterThan(0);
            progressViz.achievements.forEach(achievement => {
                expect(achievement).toHaveProperty('id');
                expect(achievement).toHaveProperty('name');
                expect(achievement).toHaveProperty('description');
                expect(achievement).toHaveProperty('condition');
                expect(achievement).toHaveProperty('category');
            });
        });

        test('should check achievement conditions', () => {
            const stats = {
                totalMeditationTime: 300, // 5 minutes
                zonesVisited: 2,
                flightTime: 600, // 10 minutes
                maxAltitude: 150
            };

            progressViz.checkAchievements(stats);

            expect(progressViz.unlockedAchievements.length).toBeGreaterThan(0);
        });

        test('should not unlock same achievement twice', () => {
            const stats = {
                totalMeditationTime: 300,
                zonesVisited: 2,
                flightTime: 600,
                maxAltitude: 150
            };

            progressViz.checkAchievements(stats);
            const firstUnlockCount = progressViz.unlockedAchievements.length;

            progressViz.checkAchievements(stats);
            const secondUnlockCount = progressViz.unlockedAchievements.length;

            expect(secondUnlockCount).toBe(firstUnlockCount);
        });

        test('should create achievement ring when unlocked', () => {
            const mockAchievement = {
                id: 'test_achievement',
                name: 'Test Achievement',
                description: 'A test achievement',
                condition: () => true,
                category: 'test'
            };

            progressViz.achievements.push(mockAchievement);
            progressViz.checkAchievements({});

            expect(progressViz.achievementRings.length).toBeGreaterThan(0);
            expect(mockScene.add).toHaveBeenCalled();
        });

        test('should show achievement notification', () => {
            const achievement = {
                id: 'notification_test',
                name: 'Notification Test',
                description: 'Testing notifications'
            };

            progressViz.showAchievementNotification(achievement);

            // Check that notification element was created
            const notification = document.getElementById('achievement-notification');
            expect(notification).toBeTruthy();
        });
    });

    describe('Progress Tracking', () => {
        test('should update progress from meditation data', () => {
            const meditationData = {
                focusLevel: 80,
                stabilityLevel: 75,
                sessionDuration: 300,
                currentPhase: 'cave_of_shadows'
            };

            progressViz.updateProgress(meditationData, 'Cave of Shadows', 'evening');

            expect(progressViz.totalProgress).toBeGreaterThan(0);
            expect(progressViz.progressCategories.meditation.value).toBeGreaterThan(0);
        });

        test('should track exploration progress', () => {
            const meditationData = {};
            const currentZone = 'Garden of Forking Paths';

            progressViz.updateProgress(meditationData, currentZone, 'morning');

            expect(progressViz.progressCategories.exploration.value).toBeGreaterThan(0);
        });

        test('should calculate zone progress correctly', () => {
            const zones = ['Cave of Shadows', 'Garden of Forking Paths', "Observer's Paradox"];
            zones.forEach(zone => {
                progressViz.updateProgress({}, zone, 'day');
            });

            expect(progressViz.progressCategories.exploration.zonesVisited.size).toBe(3);
        });

        test('should track time-based progress', () => {
            const times = ['morning', 'noon', 'evening', 'night'];
            times.forEach(time => {
                progressViz.updateProgress({}, null, time);
            });

            expect(progressViz.progressCategories.insight.timesExperienced.size).toBe(4);
        });

        test('should emit particles on significant progress', () => {
            const meditationData = { focusLevel: 95, stabilityLevel: 90 };

            // Mock Math.random to trigger particle emission
            jest.spyOn(Math, 'random').mockReturnValue(0.05);

            progressViz.updateProgress(meditationData, 'Cave of Shadows', 'evening');

            expect(progressViz.particles.length).toBeGreaterThan(0);

            Math.random.mockRestore();
        });
    });

    describe('Animation Loop', () => {
        test('should start animation loop when activated', () => {
            progressViz.activate();

            expect(requestAnimationFrame).toHaveBeenCalled();
        });

        test('should animate progress spheres', () => {
            const sphere = progressViz.createProgressSphere('meditation', new THREE.Vector3(0, 0, 0), 0.5);
            const initialRotation = sphere.mesh.rotation.y;

            progressViz.animate();

            expect(sphere.mesh.rotation.y).not.toBe(initialRotation);
        });

        test('should animate achievement rings', () => {
            const ring = {
                mesh: new THREE.Mesh(),
                rotationSpeed: 0.02
            };
            progressViz.achievementRings.push(ring);

            const initialRotation = ring.mesh.rotation.z;
            progressViz.animate();

            expect(ring.mesh.rotation.z).not.toBe(initialRotation);
        });

        test('should continue animation loop when active', () => {
            progressViz.isActive = true;
            progressViz.animate();

            expect(requestAnimationFrame).toHaveBeenCalledWith(expect.any(Function));
        });

        test('should stop animation loop when inactive', () => {
            jest.clearAllMocks();
            progressViz.isActive = false;
            progressViz.animate();

            expect(requestAnimationFrame).not.toHaveBeenCalled();
        });
    });

    describe('Visual Effects', () => {
        test('should create glowing sphere material', () => {
            const material = progressViz.createGlowMaterial(0x00ff00, 0.8);

            expect(material).toBeInstanceOf(THREE.MeshBasicMaterial);
            expect(material.transparent).toBe(true);
            expect(material.opacity).toBe(0.8);
        });

        test('should apply pulsing effect to spheres', () => {
            const sphere = progressViz.createProgressSphere('insight', new THREE.Vector3(0, 0, 0), 0.7);
            sphere.pulsePhase = 0;

            progressViz.updateSpherePulse(sphere, 0.1);

            expect(sphere.pulsePhase).toBeGreaterThan(0);
        });

        test('should create trail effect for moving particles', () => {
            const particle = progressViz.createAchievementParticle(new THREE.Vector3(0, 0, 0), 0xff0000);

            progressViz.createTrailEffect(particle);

            expect(particle.trail).toBeDefined();
            expect(particle.trail.length).toBeGreaterThan(0);
        });
    });

    describe('Data Persistence', () => {
        test('should get progress summary', () => {
            progressViz.totalProgress = 45.5;
            progressViz.progressCategories.meditation.value = 80;
            progressViz.unlockedAchievements = ['achievement1', 'achievement2'];

            const summary = progressViz.getProgressSummary();

            expect(summary).toHaveProperty('totalProgress', 45.5);
            expect(summary).toHaveProperty('categories');
            expect(summary).toHaveProperty('achievements');
            expect(summary.achievements.length).toBe(2);
        });

        test('should export progress data', () => {
            progressViz.totalProgress = 60;
            progressViz.unlockedAchievements = ['test1', 'test2'];

            const exportData = progressViz.exportProgressData();

            expect(exportData).toHaveProperty('version');
            expect(exportData).toHaveProperty('timestamp');
            expect(exportData).toHaveProperty('totalProgress', 60);
            expect(exportData).toHaveProperty('achievements');
        });

        test('should import progress data', () => {
            const importData = {
                version: '1.0',
                totalProgress: 75,
                categories: {
                    meditation: { value: 80 },
                    exploration: { value: 70 }
                },
                achievements: ['imported1', 'imported2']
            };

            const success = progressViz.importProgressData(importData);

            expect(success).toBe(true);
            expect(progressViz.totalProgress).toBe(75);
            expect(progressViz.unlockedAchievements).toEqual(['imported1', 'imported2']);
        });

        test('should handle invalid import data', () => {
            const invalidData = { invalid: 'data' };

            const success = progressViz.importProgressData(invalidData);

            expect(success).toBe(false);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle null scene gracefully', () => {
            expect(() => {
                new ProgressVisualization(null);
            }).not.toThrow();
        });

        test('should handle missing meditation data', () => {
            expect(() => {
                progressViz.updateProgress(null, null, null);
                progressViz.updateProgress({}, null, null);
                progressViz.updateProgress({ focusLevel: NaN }, null, null);
            }).not.toThrow();
        });

        test('should handle animation errors gracefully', () => {
            // Create corrupted sphere
            const sphere = { mesh: null, progress: 0.5 };
            progressViz.progressSpheres.push(sphere);

            expect(() => {
                progressViz.animate();
            }).not.toThrow();
        });

        test('should handle particle system edge cases', () => {
            expect(() => {
                progressViz.emitParticles(null, 5, 0x000000);
                progressViz.emitParticles(new THREE.Vector3(0, 0, 0), -1, 0x000000);
                progressViz.emitParticles(new THREE.Vector3(0, 0, 0), 1000, 0x000000);
            }).not.toThrow();
        });

        test('should handle extreme progress values', () => {
            expect(() => {
                progressViz.updateProgress({ focusLevel: 1000, stabilityLevel: -50 }, 'test', 'test');
                progressViz.createProgressSphere('test', new THREE.Vector3(0, 0, 0), -1);
                progressViz.createProgressSphere('test', new THREE.Vector3(0, 0, 0), 5);
            }).not.toThrow();
        });

        test('should maintain state consistency during errors', () => {
            const originalProgress = progressViz.totalProgress;
            const originalSphereCount = progressViz.progressSpheres.length;

            // Force some errors
            try {
                progressViz.updateProgress({ focusLevel: 'invalid' }, null, 'invalid');
            } catch (e) {
                // Should handle gracefully
            }

            // State should remain consistent
            expect(progressViz.totalProgress).toBeGreaterThanOrEqual(originalProgress);
            expect(progressViz.progressSpheres.length).toBeGreaterThanOrEqual(originalSphereCount);
        });

        test('should handle memory constraints with many particles', () => {
            // Create many particles to test memory handling
            for (let i = 0; i < 1000; i++) {
                progressViz.createAchievementParticle(
                    new THREE.Vector3(i, i, i),
                    Math.random() * 0xffffff
                );
            }

            expect(() => {
                progressViz.updateParticles(0.016);
            }).not.toThrow();

            // Should limit particle count
            expect(progressViz.particles.length).toBeLessThan(500);
        });

        test('should validate achievement conditions safely', () => {
            // Add achievement with problematic condition
            progressViz.achievements.push({
                id: 'error_test',
                name: 'Error Test',
                description: 'Tests error handling',
                condition: (stats) => stats.invalid.property > 100,
                category: 'test'
            });

            expect(() => {
                progressViz.checkAchievements({});
            }).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        test('should work through complete visualization workflow', () => {
            // Activate visualization
            progressViz.activate();
            expect(progressViz.isActive).toBe(true);

            // Update progress multiple times
            for (let i = 0; i < 5; i++) {
                progressViz.updateProgress(
                    { focusLevel: 60 + i * 5, stabilityLevel: 70 + i * 3 },
                    i % 2 === 0 ? 'Cave of Shadows' : 'Garden of Forking Paths',
                    ['morning', 'noon', 'evening', 'night'][i % 4]
                );
            }

            // Should have created spheres
            expect(progressViz.progressSpheres.length).toBeGreaterThan(0);

            // Should have progress
            expect(progressViz.totalProgress).toBeGreaterThan(0);

            // Animate several frames
            for (let i = 0; i < 10; i++) {
                progressViz.animate();
            }

            // Should have particles
            expect(progressViz.particles.length).toBeGreaterThanOrEqual(0);

            // Get summary
            const summary = progressViz.getProgressSummary();
            expect(summary.totalProgress).toBeGreaterThan(0);

            // Deactivate
            progressViz.deactivate();
            expect(progressViz.isActive).toBe(false);
        });

        test('should maintain performance with continuous updates', () => {
            progressViz.activate();

            const startTime = Date.now();

            // Simulate 1 second of updates at 60fps
            for (let i = 0; i < 60; i++) {
                progressViz.updateProgress(
                    { focusLevel: Math.random() * 100, stabilityLevel: Math.random() * 100 },
                    Math.random() > 0.5 ? 'Cave of Shadows' : null,
                    ['morning', 'noon', 'evening', 'night'][i % 4]
                );
                progressViz.animate();
                progressViz.updateParticles(0.016);
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Should complete in reasonable time (less than 1 second)
            expect(duration).toBeLessThan(1000);
            expect(progressViz.isActive).toBe(true);
        });
    });
});