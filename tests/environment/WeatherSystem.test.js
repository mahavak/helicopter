// jest is globally available
require('../setup.js');
const { WeatherSystem } = require('../../src/environment/WeatherSystem.js');

describe('WeatherSystem', () => {
    let weatherSystem;
    let mockScene;
    let mockDayNightCycle;

    beforeEach(() => {
        mockScene = new THREE.Scene();
        mockDayNightCycle = {
            getAtmosphericData: jest.fn(() => ({
                timeOfDay: 0.5,
                phase: { name: 'Code Noon' },
                lightIntensity: 0.8,
                codeIntensity: 0.5,
                realityStability: 1.0
            }))
        };
        weatherSystem = new WeatherSystem(mockScene, mockDayNightCycle);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(weatherSystem.currentWeather).toBe('clear');
            expect(weatherSystem.weatherIntensity).toBe(0);
            expect(weatherSystem.transitionTime).toBe(0);
            expect(weatherSystem.weatherDuration).toBe(0);
            expect(weatherSystem.nextWeatherChange).toBeGreaterThan(0);
        });

        test('should define weather types correctly', () => {
            expect(weatherSystem.weatherTypes).toBeDefined();
            expect(weatherSystem.weatherTypes.clear).toBeDefined();
            expect(weatherSystem.weatherTypes.digitalStorm).toBeDefined();
            expect(weatherSystem.weatherTypes.codeSnow).toBeDefined();
            expect(weatherSystem.weatherTypes.dataMist).toBeDefined();
            expect(weatherSystem.weatherTypes.realityGlitch).toBeDefined();
        });

        test('should create weather effects', () => {
            expect(weatherSystem.weatherEffects.digitalStorm).toBeDefined();
            expect(weatherSystem.weatherEffects.codeSnow).toBeDefined();
            expect(weatherSystem.weatherEffects.dataMist).toBeDefined();
            expect(weatherSystem.weatherEffects.realityGlitch).toBeDefined();
        });

        test('should have philosophical meanings for each weather type', () => {
            Object.values(weatherSystem.weatherTypes).forEach(weather => {
                expect(weather.meaning).toBeDefined();
                expect(typeof weather.meaning).toBe('string');
            });
        });
    });

    describe('Digital Storm Creation', () => {
        test('should create digital storm with particles', () => {
            const storm = weatherSystem.weatherEffects.digitalStorm;
            
            expect(storm).toBeDefined();
            expect(storm.particles).toBeDefined();
            expect(storm.lightning).toBeDefined();
            expect(Array.isArray(storm.lightning)).toBe(true);
            expect(storm.active).toBe(false);
        });

        test('should create lightning system', () => {
            const storm = weatherSystem.weatherEffects.digitalStorm;
            
            expect(storm.lightning.length).toBeGreaterThan(0);
            storm.lightning.forEach(lightning => {
                expect(lightning.userData.isLightning).toBe(true);
                expect(lightning.userData.nextFlash).toBeGreaterThan(0);
            });
        });
    });

    describe('Code Snow Creation', () => {
        test('should create code snow with character sprites', () => {
            const snow = weatherSystem.weatherEffects.codeSnow;
            
            expect(snow).toBeDefined();
            expect(snow.sprites).toBeDefined();
            expect(Array.isArray(snow.sprites)).toBe(true);
            expect(snow.sprites.length).toBeGreaterThan(0);
            expect(snow.characters).toBeDefined();
            expect(snow.active).toBe(false);
        });

        test('should create sprites with velocity data', () => {
            const snow = weatherSystem.weatherEffects.codeSnow;
            
            snow.sprites.forEach(sprite => {
                expect(sprite.userData.velocity).toBeDefined();
                expect(sprite.userData.rotationSpeed).toBeDefined();
                expect(sprite.userData.originalY).toBeDefined();
            });
        });
    });

    describe('Data Mist Creation', () => {
        test('should create data mist with fog effects', () => {
            const mist = weatherSystem.weatherEffects.dataMist;
            
            expect(mist).toBeDefined();
            expect(mist.fog).toBeDefined();
            expect(mist.active).toBe(false);
        });
    });

    describe('Reality Glitch Creation', () => {
        test('should create reality glitch with distortion field', () => {
            const glitch = weatherSystem.weatherEffects.realityGlitch;
            
            expect(glitch).toBeDefined();
            expect(glitch.distortionField).toBeDefined();
            expect(glitch.active).toBe(false);
        });
    });

    describe('Weather Change Management', () => {
        test('should change weather correctly', () => {
            weatherSystem.changeWeather('digitalStorm', 0.8);
            
            expect(weatherSystem.currentWeather).toBe('digitalStorm');
            expect(weatherSystem.weatherIntensity).toBe(0.8);
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(true);
        });

        test('should not change to same weather', () => {
            const originalDuration = weatherSystem.weatherDuration;
            
            weatherSystem.changeWeather('clear');
            
            expect(weatherSystem.weatherDuration).toBe(originalDuration);
        });

        test('should deactivate previous weather when changing', () => {
            weatherSystem.changeWeather('digitalStorm');
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(true);
            
            weatherSystem.changeWeather('codeSnow');
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(false);
            expect(weatherSystem.weatherEffects.codeSnow.active).toBe(true);
        });
    });

    describe('Weather Activation/Deactivation', () => {
        test('should activate digital storm correctly', () => {
            weatherSystem.activateWeather('digitalStorm');
            
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(true);
            expect(mockScene.add).toHaveBeenCalledWith(
                weatherSystem.weatherEffects.digitalStorm.particles
            );
        });

        test('should activate code snow correctly', () => {
            weatherSystem.activateWeather('codeSnow');
            
            expect(weatherSystem.weatherEffects.codeSnow.active).toBe(true);
            // Should add all sprites to scene
            weatherSystem.weatherEffects.codeSnow.sprites.forEach(sprite => {
                expect(mockScene.add).toHaveBeenCalledWith(sprite);
            });
        });

        test('should activate data mist correctly', () => {
            weatherSystem.activateWeather('dataMist');
            
            expect(weatherSystem.weatherEffects.dataMist.active).toBe(true);
            expect(mockScene.add).toHaveBeenCalledWith(
                weatherSystem.weatherEffects.dataMist.fog
            );
            expect(mockScene.fog.density).toBe(0.001);
        });

        test('should deactivate weather correctly', () => {
            weatherSystem.activateWeather('digitalStorm');
            weatherSystem.deactivateWeather('digitalStorm');
            
            expect(weatherSystem.weatherEffects.digitalStorm.active).toBe(false);
            expect(mockScene.remove).toHaveBeenCalledWith(
                weatherSystem.weatherEffects.digitalStorm.particles
            );
        });
    });

    describe('Weather Updates', () => {
        test('should update digital storm particles', () => {
            weatherSystem.activateWeather('digitalStorm');
            const deltaTime = 0.016;
            
            expect(() => {
                weatherSystem.updateDigitalStorm(deltaTime);
            }).not.toThrow();
        });

        test('should update code snow sprites', () => {
            weatherSystem.activateWeather('codeSnow');
            const deltaTime = 0.016;
            
            expect(() => {
                weatherSystem.updateCodeSnow(deltaTime);
            }).not.toThrow();
        });

        test('should update data mist effects', () => {
            weatherSystem.activateWeather('dataMist');
            const deltaTime = 0.016;
            
            expect(() => {
                weatherSystem.updateDataMist(deltaTime);
            }).not.toThrow();
        });

        test('should update reality glitch effects', () => {
            weatherSystem.activateWeather('realityGlitch');
            const deltaTime = 0.016;
            
            expect(() => {
                weatherSystem.updateRealityGlitch(deltaTime);
            }).not.toThrow();
        });

        test('should not update inactive weather', () => {
            // Digital storm is not active by default
            expect(() => {
                weatherSystem.updateDigitalStorm(0.016);
            }).not.toThrow();
        });
    });

    describe('Random Weather Selection', () => {
        test('should select random weather based on probabilities', () => {
            const selectedWeather = weatherSystem.selectRandomWeather();
            
            expect(Object.keys(weatherSystem.weatherTypes)).toContain(selectedWeather);
        });

        test('should adjust probabilities based on time of day', () => {
            // Mock night time
            mockDayNightCycle.getAtmosphericData.mockReturnValue({
                timeOfDay: 0.9, // Night
                phase: { name: 'Digital Night' },
                lightIntensity: 0.1,
                codeIntensity: 0.9,
                realityStability: 1.0
            });
            
            const selectedWeather = weatherSystem.selectRandomWeather();
            expect(Object.keys(weatherSystem.weatherTypes)).toContain(selectedWeather);
        });

        test('should handle dawn time adjustments', () => {
            // Mock dawn time
            mockDayNightCycle.getAtmosphericData.mockReturnValue({
                timeOfDay: 0.1, // Dawn
                phase: { name: 'Digital Dawn' },
                lightIntensity: 0.3,
                codeIntensity: 0.7,
                realityStability: 1.0
            });
            
            const selectedWeather = weatherSystem.selectRandomWeather();
            expect(Object.keys(weatherSystem.weatherTypes)).toContain(selectedWeather);
        });
    });

    describe('Main Update Cycle', () => {
        test('should update weather change timer', () => {
            const initialNextChange = weatherSystem.nextWeatherChange;
            const deltaTime = 10; // 10 seconds
            
            weatherSystem.update(deltaTime);
            
            expect(weatherSystem.nextWeatherChange).toBeLessThan(initialNextChange);
            expect(weatherSystem.weatherDuration).toBe(deltaTime);
            expect(weatherSystem.transitionTime).toBe(deltaTime);
        });

        test('should change weather when timer expires', () => {
            weatherSystem.nextWeatherChange = 5; // 5 seconds remaining
            const deltaTime = 10; // 10 seconds delta
            
            const originalWeather = weatherSystem.currentWeather;
            weatherSystem.update(deltaTime);
            
            // Weather should have changed or stayed the same (random)
            expect(Object.keys(weatherSystem.weatherTypes)).toContain(weatherSystem.currentWeather);
            expect(weatherSystem.nextWeatherChange).toBeGreaterThan(0);
        });

        test('should update all active weather effects', () => {
            weatherSystem.changeWeather('digitalStorm');
            
            expect(() => {
                weatherSystem.update(0.016);
            }).not.toThrow();
        });
    });

    describe('Weather Control Methods', () => {
        test('should force weather change', () => {
            weatherSystem.forceWeather('codeSnow');
            
            expect(weatherSystem.currentWeather).toBe('codeSnow');
            expect(weatherSystem.weatherEffects.codeSnow.active).toBe(true);
        });

        test('should force weather with duration', (done) => {
            weatherSystem.forceWeather('digitalStorm', 0.1); // 0.1 seconds
            
            expect(weatherSystem.currentWeather).toBe('digitalStorm');
            
            setTimeout(() => {
                expect(weatherSystem.currentWeather).toBe('clear');
                done();
            }, 150); // Wait for duration + buffer
        });

        test('should get current weather info', () => {
            weatherSystem.changeWeather('dataMist', 0.6);
            
            const weatherInfo = weatherSystem.getCurrentWeatherInfo();
            
            expect(weatherInfo.type).toBe('dataMist');
            expect(weatherInfo.name).toBe('Data Mist');
            expect(weatherInfo.meaning).toBe('Uncertainty and Mystery');
            expect(weatherInfo.intensity).toBe(0.6);
            expect(weatherInfo.duration).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Meditation Weather Mode', () => {
        test('should enable meditation weather mode', () => {
            weatherSystem.enableMeditationWeather();
            
            expect(weatherSystem.currentWeather).toBe('clear');
            expect(weatherSystem.nextWeatherChange).toBe(999999);
        });

        test('should disable meditation weather mode', () => {
            weatherSystem.enableMeditationWeather();
            weatherSystem.disableMeditationWeather();
            
            expect(weatherSystem.nextWeatherChange).toBe(30);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle missing day/night cycle', () => {
            const weatherSystemWithoutCycle = new WeatherSystem(mockScene, null);
            
            expect(() => {
                weatherSystemWithoutCycle.update(0.016);
            }).not.toThrow();
        });

        test('should handle invalid weather type in activation', () => {
            expect(() => {
                weatherSystem.activateWeather('invalidWeather');
            }).not.toThrow();
        });

        test('should handle invalid weather type in deactivation', () => {
            expect(() => {
                weatherSystem.deactivateWeather('invalidWeather');
            }).not.toThrow();
        });

        test('should handle very large delta times', () => {
            expect(() => {
                weatherSystem.update(10000); // Very large delta
            }).not.toThrow();
        });

        test('should handle zero delta time', () => {
            expect(() => {
                weatherSystem.update(0);
            }).not.toThrow();
        });

        test('should handle missing weather effects gracefully', () => {
            weatherSystem.weatherEffects.digitalStorm = null;
            
            expect(() => {
                weatherSystem.activateWeather('digitalStorm');
            }).not.toThrow();
        });
    });

    describe('Weather Effect Probabilities', () => {
        test('should have valid probabilities for all weather types', () => {
            Object.values(weatherSystem.weatherTypes).forEach(weather => {
                expect(weather.probability).toBeGreaterThan(0);
                expect(weather.probability).toBeLessThanOrEqual(1);
            });
        });

        test('should have total probability that makes sense', () => {
            const totalProbability = Object.values(weatherSystem.weatherTypes)
                .reduce((sum, weather) => sum + weather.probability, 0);
            
            expect(totalProbability).toBeGreaterThan(0.8); // Should be close to 1.0
            expect(totalProbability).toBeLessThanOrEqual(1.2); // Allow some flexibility
        });
    });
});