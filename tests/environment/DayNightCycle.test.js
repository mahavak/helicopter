// jest is globally available
require('../setup.js');
const { DayNightCycle } = require('../../src/environment/DayNightCycle.js');

describe('DayNightCycle', () => {
    let dayNightCycle;
    let mockScene;

    beforeEach(() => {
        mockScene = new THREE.Scene();
        dayNightCycle = new DayNightCycle(mockScene);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(dayNightCycle.currentTime).toBe(0.1); // Starts at dawn
            expect(dayNightCycle.daySpeed).toBe(0.0001);
            expect(dayNightCycle.paused).toBe(false);
            expect(dayNightCycle.codeIntensity).toBe(0.7);
            expect(dayNightCycle.digitalNoiseLevel).toBe(0.3);
            expect(dayNightCycle.realityStability).toBe(1.0);
        });

        test('should create matrix sky components', () => {
            expect(dayNightCycle.skyGeometry).toBeDefined();
            expect(dayNightCycle.skyMaterial).toBeDefined();
            expect(dayNightCycle.skyMesh).toBeDefined();
        });

        test('should create digital sun', () => {
            expect(dayNightCycle.matrixSun).toBeDefined();
        });

        test('should define time phases correctly', () => {
            expect(dayNightCycle.timePhases).toBeDefined();
            expect(dayNightCycle.timePhases.digitalDawn).toBeDefined();
            expect(dayNightCycle.timePhases.matrixMorning).toBeDefined();
            expect(dayNightCycle.timePhases.codeNoon).toBeDefined();
            expect(dayNightCycle.timePhases.virtualEvening).toBeDefined();
            expect(dayNightCycle.timePhases.digitalNight).toBeDefined();
        });

        test('should add sky and sun to scene', () => {
            expect(mockScene.add).toHaveBeenCalledWith(dayNightCycle.skyMesh);
            expect(mockScene.add).toHaveBeenCalledWith(dayNightCycle.matrixSun);
        });
    });

    describe('Time Management', () => {
        test('should set time correctly', () => {
            dayNightCycle.setTime(0.5);
            expect(dayNightCycle.currentTime).toBe(0.5);
        });

        test('should clamp time to valid range', () => {
            dayNightCycle.setTime(-0.5);
            expect(dayNightCycle.currentTime).toBe(0);
            
            dayNightCycle.setTime(1.5);
            expect(dayNightCycle.currentTime).toBe(1);
        });

        test('should update time effects when setting time', () => {
            const originalSunPosition = { ...dayNightCycle.matrixSun.position };
            
            dayNightCycle.setTime(0.5);
            
            // Sun position should have changed
            expect(dayNightCycle.matrixSun.position.set).toHaveBeenCalled();
        });

        test('should pause and resume time correctly', () => {
            dayNightCycle.pauseTime();
            expect(dayNightCycle.paused).toBe(true);
            
            dayNightCycle.resumeTime();
            expect(dayNightCycle.paused).toBe(false);
        });

        test('should set day speed correctly', () => {
            dayNightCycle.setDaySpeed(0.001);
            expect(dayNightCycle.daySpeed).toBe(0.001);
        });
    });

    describe('Time Phases', () => {
        test('should identify correct phase for digital dawn', () => {
            dayNightCycle.setTime(0.1);
            const phase = dayNightCycle.getCurrentPhase(0.1);
            expect(phase).toBe('digitalDawn');
        });

        test('should identify correct phase for matrix morning', () => {
            dayNightCycle.setTime(0.25);
            const phase = dayNightCycle.getCurrentPhase(0.25);
            expect(phase).toBe('matrixMorning');
        });

        test('should identify correct phase for code noon', () => {
            dayNightCycle.setTime(0.5);
            const phase = dayNightCycle.getCurrentPhase(0.5);
            expect(phase).toBe('codeNoon');
        });

        test('should identify correct phase for virtual evening', () => {
            dayNightCycle.setTime(0.75);
            const phase = dayNightCycle.getCurrentPhase(0.75);
            expect(phase).toBe('virtualEvening');
        });

        test('should identify correct phase for digital night', () => {
            dayNightCycle.setTime(0.9);
            const phase = dayNightCycle.getCurrentPhase(0.9);
            expect(phase).toBe('digitalNight');
        });

        test('should get current phase info correctly', () => {
            dayNightCycle.setTime(0.5);
            const phaseInfo = dayNightCycle.getCurrentPhaseInfo();
            
            expect(phaseInfo.name).toBe('Code Noon');
            expect(phaseInfo.meaning).toBe('Peak Understanding');
            expect(phaseInfo.time).toBe(0.5);
            expect(phaseInfo.timeString).toBeDefined();
        });

        test('should skip to phase correctly', () => {
            dayNightCycle.skipToPhase('codeNoon');
            
            const phase = dayNightCycle.getCurrentPhase(dayNightCycle.currentTime);
            expect(phase).toBe('codeNoon');
        });

        test('should handle invalid phase name in skipToPhase', () => {
            const originalTime = dayNightCycle.currentTime;
            dayNightCycle.skipToPhase('invalidPhase');
            
            expect(dayNightCycle.currentTime).toBe(originalTime);
        });
    });

    describe('Lighting Effects', () => {
        test('should calculate sun intensity correctly', () => {
            const noonIntensity = dayNightCycle.getSunIntensity(0.5); // Noon
            const nightIntensity = dayNightCycle.getSunIntensity(0.0); // Midnight
            
            expect(noonIntensity).toBeGreaterThan(nightIntensity);
        });

        test('should get light color based on time', () => {
            const dawnColor = dayNightCycle.getLightColor(0.1);
            const noonColor = dayNightCycle.getLightColor(0.5);
            
            expect(dawnColor).toBeDefined();
            expect(noonColor).toBeDefined();
            expect(typeof dawnColor).toBe('number');
            expect(typeof noonColor).toBe('number');
        });

        test('should calculate ambient intensity correctly', () => {
            const dayAmbient = dayNightCycle.getAmbientIntensity(0.5);
            const nightAmbient = dayNightCycle.getAmbientIntensity(0.0);
            
            expect(dayAmbient).toBeGreaterThan(nightAmbient);
            expect(nightAmbient).toBeGreaterThan(0); // Never completely dark
        });

        test('should calculate day phase correctly', () => {
            const noonPhase = dayNightCycle.getDayPhase(0.5);
            const midnightPhase = dayNightCycle.getDayPhase(0.0);
            
            expect(noonPhase).toBeGreaterThan(midnightPhase);
            expect(noonPhase).toBeLessThanOrEqual(1);
            expect(midnightPhase).toBeGreaterThanOrEqual(0);
        });

        test('should calculate code intensity correctly', () => {
            const dayCodeIntensity = dayNightCycle.getCodeIntensity(0.5);
            const nightCodeIntensity = dayNightCycle.getCodeIntensity(0.0);
            
            expect(nightCodeIntensity).toBeGreaterThan(dayCodeIntensity);
        });
    });

    describe('Time String Formatting', () => {
        test('should format time string correctly for noon', () => {
            dayNightCycle.setTime(0.5); // Noon
            const timeString = dayNightCycle.getTimeString();
            expect(timeString).toBe('12:00');
        });

        test('should format time string correctly for midnight', () => {
            dayNightCycle.setTime(0.0); // Midnight
            const timeString = dayNightCycle.getTimeString();
            expect(timeString).toBe('00:00');
        });

        test('should format time string correctly for morning', () => {
            dayNightCycle.setTime(0.25); // 6 AM
            const timeString = dayNightCycle.getTimeString();
            expect(timeString).toBe('06:00');
        });

        test('should format time string with minutes', () => {
            dayNightCycle.setTime(0.520833); // 12:30
            const timeString = dayNightCycle.getTimeString();
            expect(timeString).toBe('12:30');
        });
    });

    describe('Meditation Mode', () => {
        test('should enable meditation mode correctly', () => {
            dayNightCycle.enableMeditationMode();
            
            expect(dayNightCycle.daySpeed).toBe(0.00001);
            expect(dayNightCycle.getCurrentPhase(dayNightCycle.currentTime)).toBe('digitalDawn');
        });
    });

    describe('Update Cycle', () => {
        test('should update time when not paused', () => {
            const initialTime = dayNightCycle.currentTime;
            const deltaTime = 1000; // Large delta for visible change
            
            dayNightCycle.update(deltaTime);
            
            expect(dayNightCycle.currentTime).toBeGreaterThan(initialTime);
        });

        test('should not update time when paused', () => {
            dayNightCycle.pauseTime();
            const initialTime = dayNightCycle.currentTime;
            
            dayNightCycle.update(1000);
            
            expect(dayNightCycle.currentTime).toBe(initialTime);
        });

        test('should loop time after reaching 1.0', () => {
            dayNightCycle.currentTime = 0.999;
            dayNightCycle.update(1000000); // Very large delta
            
            expect(dayNightCycle.currentTime).toBeLessThan(0.999);
        });

        test('should update shader uniforms continuously', () => {
            const initialTime = dayNightCycle.skyMaterial.uniforms.time.value;
            
            dayNightCycle.update(100);
            
            expect(dayNightCycle.skyMaterial.uniforms.time.value).toBeGreaterThan(initialTime);
        });
    });

    describe('Atmospheric Data', () => {
        test('should provide atmospheric data correctly', () => {
            const atmosphericData = dayNightCycle.getAtmosphericData();
            
            expect(atmosphericData.timeOfDay).toBeDefined();
            expect(atmosphericData.phase).toBeDefined();
            expect(atmosphericData.lightIntensity).toBeDefined();
            expect(atmosphericData.codeIntensity).toBeDefined();
            expect(atmosphericData.realityStability).toBeDefined();
            
            expect(typeof atmosphericData.timeOfDay).toBe('number');
            expect(atmosphericData.phase.name).toBeDefined();
            expect(atmosphericData.phase.meaning).toBeDefined();
        });
    });

    describe('Edge Cases', () => {
        test('should handle very small delta times', () => {
            expect(() => {
                dayNightCycle.update(0.0001);
            }).not.toThrow();
        });

        test('should handle very large delta times', () => {
            expect(() => {
                dayNightCycle.update(10000);
            }).not.toThrow();
        });

        test('should handle zero delta time', () => {
            const initialTime = dayNightCycle.currentTime;
            
            dayNightCycle.update(0);
            
            expect(dayNightCycle.currentTime).toBe(initialTime);
        });

        test('should handle missing lighting components gracefully', () => {
            dayNightCycle.directionalLight = null;
            dayNightCycle.ambientLight = null;
            
            expect(() => {
                dayNightCycle.updateTimeEffects();
            }).not.toThrow();
        });
    });
});