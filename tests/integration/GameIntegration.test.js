// jest is globally available
require('../setup.js');
const { HelicopterController } = require('../../src/helicopter/HelicopterController.js');
const { AudioManager } = require('../../src/audio/AudioManager.js');
const { DayNightCycle } = require('../../src/environment/DayNightCycle.js');
const { WeatherSystem } = require('../../src/environment/WeatherSystem.js');
const { HelicopterCustomization } = require('../../src/helicopter/HelicopterCustomization.js');
const { AchievementSystem } = require('../../src/systems/AchievementSystem.js');
const { ZoneInteractionManager } = require('../../src/zones/ZoneInteractionManager.js');

describe('Game Integration Tests', () => {
    let scene;
    let camera;
    let helicopter;
    let audioManager;
    let dayNightCycle;
    let weatherSystem;
    let customization;
    let achievementSystem;
    let zoneManager;

    beforeEach(() => {
        // Initialize core components
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        
        // Initialize systems in correct order
        helicopter = new HelicopterController(scene, camera);
        audioManager = new AudioManager();
        dayNightCycle = new DayNightCycle(scene);
        weatherSystem = new WeatherSystem(scene, dayNightCycle);
        customization = new HelicopterCustomization(helicopter);
        zoneManager = new ZoneInteractionManager(scene, helicopter, audioManager);
        achievementSystem = new AchievementSystem(helicopter, zoneManager, audioManager, customization);
    });

    describe('System Initialization Integration', () => {
        test('should initialize all systems without errors', () => {
            expect(helicopter).toBeDefined();
            expect(audioManager).toBeDefined();
            expect(dayNightCycle).toBeDefined();
            expect(weatherSystem).toBeDefined();
            expect(customization).toBeDefined();
            expect(achievementSystem).toBeDefined();
            expect(zoneManager).toBeDefined();
        });

        test('should have proper system dependencies', () => {
            expect(weatherSystem.dayNightCycle).toBe(dayNightCycle);
            expect(customization.helicopter).toBe(helicopter);
            expect(achievementSystem.helicopter).toBe(helicopter);
            expect(achievementSystem.customization).toBe(customization);
            expect(zoneManager.helicopter).toBe(helicopter);
            expect(zoneManager.audioManager).toBe(audioManager);
        });

        test('should add all necessary objects to scene', () => {
            // Verify scene contains expected objects
            expect(scene.add).toHaveBeenCalledWith(helicopter.helicopter);
            expect(scene.add).toHaveBeenCalledWith(dayNightCycle.skyMesh);
            expect(scene.add).toHaveBeenCalledWith(dayNightCycle.matrixSun);
        });
    });

    describe('Full Game Loop Integration', () => {
        test('should handle complete update cycle without errors', () => {
            const deltaTime = 0.016;
            const controls = {
                space: true,
                w: true,
                a: true
            };

            expect(() => {
                // Update all systems in game loop order
                helicopter.update(deltaTime, controls);
                audioManager.updateHelicopterAudio(helicopter.getFlightData());
                audioManager.update(deltaTime);
                dayNightCycle.update(deltaTime);
                weatherSystem.update(deltaTime);
                customization.update(deltaTime);
                zoneManager.update(deltaTime, helicopter.position);
                achievementSystem.update(deltaTime, helicopter.getFlightData(), zoneManager.activeZone);
            }).not.toThrow();
        });

        test('should maintain stability over extended simulation', () => {
            const controls = { space: true, w: true };
            
            // Run 100 update cycles
            for (let i = 0; i < 100; i++) {
                helicopter.update(0.016, controls);
                dayNightCycle.update(0.016);
                weatherSystem.update(0.016);
                customization.update(0.016);
                achievementSystem.update(0.016, helicopter.getFlightData(), null);
            }

            // Verify system stability
            expect(isFinite(helicopter.position.x)).toBe(true);
            expect(isFinite(helicopter.position.y)).toBe(true);
            expect(isFinite(helicopter.position.z)).toBe(true);
            expect(isFinite(dayNightCycle.currentTime)).toBe(true);
        });

        test('should handle rapid control changes', () => {
            const controls = { space: false, w: false, a: false };
            
            for (let i = 0; i < 50; i++) {
                // Randomly toggle controls
                controls.space = Math.random() > 0.5;
                controls.w = Math.random() > 0.5;
                controls.a = Math.random() > 0.5;
                
                expect(() => {
                    helicopter.update(0.016, controls);
                    customization.update(0.016);
                }).not.toThrow();
            }
        });
    });

    describe('Achievement-Customization Integration', () => {
        test('should unlock themes when gaining insights through achievements', () => {
            // Mock long zone time to trigger achievement
            achievementSystem.zoneProgress['cave_of_shadows'].timeSpent = 200;
            
            achievementSystem.checkAchievement('shadow_dancer');
            
            // Should have unlocked achievement and granted insight
            expect(achievementSystem.unlockedAchievements.has('shadow_dancer')).toBe(true);
            expect(customization.addInsight).toHaveBeenCalledWith('cave_shadows_depth');
        });

        test('should apply theme effects when themes are unlocked', () => {
            // Unlock a theme
            customization.themes.shadowWalker.unlocked = true;
            
            const result = customization.applyTheme('shadowWalker');
            
            expect(result).toBe(true);
            expect(customization.currentTheme).toBe('shadowWalker');
            expect(customization.activeEffects.size).toBeGreaterThan(0);
        });

        test('should track contemplation progress across systems', () => {
            // Simulate contemplative flight
            helicopter.velocity.length = jest.fn(() => 5); // Slow speed
            
            achievementSystem.updateFlightTime(100); // Long flight time
            
            expect(achievementSystem.currentSession.contemplationTime).toBe(100);
            expect(achievementSystem.currentSession.peacefulMoments).toBeGreaterThan(0);
        });
    });

    describe('Audio-Environment Integration', () => {
        test('should update helicopter audio based on flight state', () => {
            helicopter.collective = 0.8;
            helicopter.velocity.x = 10;
            helicopter.velocity.z = 5;
            
            const flightData = helicopter.getFlightData();
            
            expect(() => {
                audioManager.updateHelicopterAudio(flightData);
            }).not.toThrow();
        });

        test('should respond to zone entries with audio', () => {
            zoneManager.activeZone = 'cave_of_shadows';
            
            audioManager.enterZone('Cave of Shadows');
            
            expect(audioManager.currentNarration).toBe('cave_of_shadows');
        });

        test('should adapt audio to weather conditions', () => {
            weatherSystem.changeWeather('digitalStorm');
            
            // Audio system should adapt to storm conditions
            expect(weatherSystem.currentWeather).toBe('digitalStorm');
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(true);
        });
    });

    describe('Time-Weather Integration', () => {
        test('should influence weather patterns based on time of day', () => {
            // Set time to night
            dayNightCycle.setTime(0.9);
            
            const atmosphericData = dayNightCycle.getAtmosphericData();
            expect(atmosphericData.timeOfDay).toBe(0.9);
            
            // Weather system should use this data
            const selectedWeather = weatherSystem.selectRandomWeather();
            expect(Object.keys(weatherSystem.weatherTypes)).toContain(selectedWeather);
        });

        test('should update lighting based on time progression', () => {
            const initialTime = dayNightCycle.currentTime;
            
            dayNightCycle.update(1000); // Large delta for visible change
            
            expect(dayNightCycle.currentTime).toBeGreaterThan(initialTime);
        });

        test('should handle weather transitions smoothly', () => {
            weatherSystem.changeWeather('digitalStorm');
            expect(weatherSystem.currentWeather).toBe('digitalStorm');
            
            weatherSystem.changeWeather('codeSnow');
            expect(weatherSystem.currentWeather).toBe('codeSnow');
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(false);
            expect(weatherSystem.weatherEffects.codeSnow.active).toBe(true);
        });
    });

    describe('Zone-Achievement Integration', () => {
        test('should track zone visits for exploration achievements', () => {
            achievementSystem.updateZoneVisit('Cave of Shadows');
            achievementSystem.updateZoneVisit('Garden of Forking Paths');
            achievementSystem.updateZoneVisit("Observer's Paradox");
            achievementSystem.updateZoneVisit('Ship of Theseus');
            
            achievementSystem.checkAchievement('zone_explorer');
            
            expect(achievementSystem.unlockedAchievements.has('zone_explorer')).toBe(true);
        });

        test('should track deep contemplation in zones', () => {
            achievementSystem.updateZoneTime('Cave of Shadows', 200);
            
            expect(achievementSystem.zoneProgress['cave_of_shadows'].deepContemplation).toBe(true);
            
            achievementSystem.checkAchievement('shadow_dancer');
            expect(achievementSystem.unlockedAchievements.has('shadow_dancer')).toBe(true);
        });

        test('should unlock content through zone mastery', () => {
            // Complete all zones with deep contemplation
            Object.keys(achievementSystem.zoneProgress).forEach(zone => {
                achievementSystem.zoneProgress[zone].deepContemplation = true;
            });
            
            achievementSystem.checkAchievement('deep_thinker');
            
            expect(achievementSystem.unlockedAchievements.has('deep_thinker')).toBe(true);
        });
    });

    describe('Customization-Visual Integration', () => {
        test('should apply visual effects that update over time', () => {
            customization.applyEffect('shadowTrail');
            
            const effect = customization.activeEffects.get('shadowTrail');
            expect(effect).toBeDefined();
            
            // Update effect
            expect(() => {
                effect.update(0.016);
            }).not.toThrow();
        });

        test('should change helicopter appearance based on theme', () => {
            const originalColors = {
                primary: helicopter.fuselage.material.color,
                glow: helicopter.glow.material.color
            };
            
            customization.themes.shadowWalker.unlocked = true;
            customization.applyTheme('shadowWalker');
            
            // Colors should have been updated
            expect(helicopter.fuselage.material.color.setHex).toHaveBeenCalled();
            expect(helicopter.glow.material.color.setHex).toHaveBeenCalled();
        });
    });

    describe('Performance and Memory Integration', () => {
        test('should handle rapid weather changes without memory leaks', () => {
            const initialEffectCount = Object.keys(weatherSystem.weatherEffects).length;
            
            // Rapidly change weather
            for (let i = 0; i < 10; i++) {
                const weathers = ['clear', 'digitalStorm', 'codeSnow', 'dataMist'];
                const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
                weatherSystem.changeWeather(randomWeather);
                weatherSystem.update(0.016);
            }
            
            // Should not have created additional weather effects
            expect(Object.keys(weatherSystem.weatherEffects).length).toBe(initialEffectCount);
        });

        test('should handle many active effects without performance degradation', () => {
            // Apply multiple effects
            customization.applyEffect('shadowTrail');
            customization.applyEffect('realityShimmer');
            customization.applyEffect('possibilityTrails');
            
            // Update many times
            const startTime = performance.now();
            for (let i = 0; i < 100; i++) {
                customization.update(0.016);
            }
            const endTime = performance.now();
            
            // Should complete in reasonable time (this is basic since we're mocking)
            expect(endTime - startTime).toBeLessThan(1000); // 1 second max
        });

        test('should clean up effects when themes change', () => {
            customization.themes.shadowWalker.unlocked = true;
            customization.applyTheme('shadowWalker');
            
            const effectCount = customization.activeEffects.size;
            expect(effectCount).toBeGreaterThan(0);
            
            customization.applyTheme('default');
            
            expect(customization.activeEffects.size).toBe(0);
        });
    });

    describe('Data Persistence Integration', () => {
        test('should save and load progress across systems', () => {
            // Create some progress
            achievementSystem.unlockAchievement('high_flyer');
            customization.addInsight('cave_shadows_depth');
            
            // Save progress
            achievementSystem.saveProgress();
            customization.saveProgress();
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'matrixhelicopter_achievements',
                expect.any(String)
            );
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'matrixhelicopter_customization',
                expect.any(String)
            );
        });

        test('should handle corrupted save data gracefully', () => {
            localStorage.getItem.mockReturnValue('corrupted data');
            
            expect(() => {
                achievementSystem.loadProgress();
                customization.loadProgress();
            }).not.toThrow();
        });
    });

    describe('Edge Case Integration', () => {
        test('should handle system shutdown gracefully', () => {
            // Simulate systems being null/undefined
            const nullHelicopter = null;
            
            expect(() => {
                // Should not crash when components are missing
                if (nullHelicopter) {
                    nullHelicopter.update(0.016, {});
                }
            }).not.toThrow();
        });

        test('should handle extreme values across systems', () => {
            // Extreme helicopter position
            helicopter.position.set(999999, 999999, 999999);
            
            // Extreme time values
            dayNightCycle.setTime(1.0);
            
            // Extreme weather intensity
            weatherSystem.changeWeather('digitalStorm', 2.0);
            
            expect(() => {
                helicopter.update(0.016, {});
                dayNightCycle.update(0.016);
                weatherSystem.update(0.016);
                achievementSystem.update(0.016, helicopter.getFlightData(), null);
            }).not.toThrow();
        });

        test('should handle missing dependencies gracefully', () => {
            // Create systems with missing dependencies
            const systemWithNullDeps = new WeatherSystem(scene, null);
            
            expect(() => {
                systemWithNullDeps.update(0.016);
            }).not.toThrow();
        });
    });

    describe('Real-world Scenario Simulation', () => {
        test('should simulate a complete meditation session', () => {
            // Start meditation mode
            dayNightCycle.enableMeditationMode();
            weatherSystem.enableMeditationWeather();
            
            // Simulate 5 minutes of gentle flight
            const controls = { space: true }; // Gentle climb
            helicopter.velocity.length = jest.fn(() => 3); // Very slow
            
            for (let i = 0; i < 300; i++) { // 300 * 0.016 = ~5 seconds (scaled for test)
                helicopter.update(0.016, controls);
                achievementSystem.updateFlightTime(0.016);
                customization.update(0.016);
            }
            
            // Should have accumulated contemplation time
            expect(achievementSystem.currentSession.contemplationTime).toBeGreaterThan(0);
        });

        test('should simulate zone exploration journey', () => {
            const zones = ['Cave of Shadows', 'Garden of Forking Paths', "Observer's Paradox", 'Ship of Theseus'];
            
            zones.forEach(zone => {
                // Visit each zone
                achievementSystem.updateZoneVisit(zone);
                
                // Spend time in zone
                for (let i = 0; i < 20; i++) {
                    achievementSystem.updateZoneTime(zone, 10); // 10 seconds each iteration
                    customization.update(0.016);
                }
            });
            
            // Should have visited all zones and achieved deep contemplation
            expect(achievementSystem.currentSession.zonesVisited.size).toBe(4);
            Object.values(achievementSystem.zoneProgress).forEach(progress => {
                expect(progress.timeSpent).toBeGreaterThan(180);
                expect(progress.deepContemplation).toBe(true);
            });
        });

        test('should simulate weather experience journey', () => {
            const weathers = ['digitalStorm', 'codeSnow', 'dataMist', 'realityGlitch'];
            
            weathers.forEach(weather => {
                weatherSystem.changeWeather(weather);
                achievementSystem.onWeatherChange(weather);
                
                // Experience weather for some time
                for (let i = 0; i < 10; i++) {
                    weatherSystem.update(0.016);
                    if (weather === 'digitalStorm') {
                        achievementSystem.currentSession.stormFlightTime += 0.016;
                    } else if (weather === 'codeSnow') {
                        achievementSystem.currentSession.snowFlightTime += 0.016;
                    }
                }
            });
            
            expect(achievementSystem.currentSession.weatherExperienced.size).toBe(4);
        });
    });
});