// jest is globally available
require('../setup.js');
const { AudioManager } = require('../../src/audio/AudioManager.js');

describe('AudioManager', () => {
    let audioManager;

    beforeEach(() => {
        audioManager = new AudioManager();
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(audioManager.listener).toBeDefined();
            expect(audioManager.audioLoader).toBeDefined();
            expect(audioManager.masterVolume).toBe(0.7);
            expect(audioManager.ambientVolume).toBe(0.4);
            expect(audioManager.narrationVolume).toBe(0.8);
            expect(audioManager.helicopterVolume).toBe(0.3);
        });

        test('should create audio context when available', () => {
            expect(audioManager.audioContext).toBeDefined();
        });

        test('should initialize procedural ambient sounds', () => {
            expect(audioManager.ambientSounds.matrix_void).toBeDefined();
            expect(audioManager.ambientSounds.digital_wind).toBeDefined();
            expect(audioManager.ambientSounds.meditation_drone).toBeDefined();
        });

        test('should initialize helicopter sounds', () => {
            expect(audioManager.helicopterSounds.rotor_main).toBeDefined();
            expect(audioManager.helicopterSounds.rotor_tail).toBeDefined();
            expect(audioManager.helicopterSounds.engine).toBeDefined();
        });

        test('should initialize narration content', () => {
            expect(audioManager.narrationContent).toBeDefined();
            expect(audioManager.narrationContent['cave_of_shadows']).toBeDefined();
            expect(audioManager.narrationContent['garden_of_paths']).toBeDefined();
            expect(audioManager.narrationContent['observers_paradox']).toBeDefined();
            expect(audioManager.narrationContent['ship_theseus']).toBeDefined();
        });
    });

    describe('Ambient Sound Management', () => {
        test('should play ambient sound', () => {
            audioManager.playAmbient('matrix_void');
            
            expect(audioManager.currentAmbient).toBe('matrix_void');
            expect(audioManager.ambientSounds['matrix_void'].isPlaying).toBe(true);
        });

        test('should stop current ambient when playing new one', () => {
            audioManager.playAmbient('matrix_void');
            audioManager.playAmbient('digital_wind');
            
            expect(audioManager.currentAmbient).toBe('digital_wind');
            expect(audioManager.ambientSounds['matrix_void'].isPlaying).toBe(false);
            expect(audioManager.ambientSounds['digital_wind'].isPlaying).toBe(true);
        });

        test('should handle invalid ambient sound name', () => {
            audioManager.playAmbient('nonexistent_sound');
            
            expect(audioManager.currentAmbient).toBeNull();
        });

        test('should stop ambient sound', () => {
            audioManager.playAmbient('matrix_void');
            audioManager.stopAmbient();
            
            expect(audioManager.currentAmbient).toBeNull();
            expect(audioManager.ambientSounds['matrix_void'].isPlaying).toBe(false);
        });
    });

    describe('Narration System', () => {
        test('should play narration', () => {
            audioManager.playNarration('cave_of_shadows');
            
            expect(audioManager.currentNarration).toBe('cave_of_shadows');
        });

        test('should stop current narration when playing new one', () => {
            audioManager.playNarration('cave_of_shadows');
            audioManager.playNarration('garden_of_paths');
            
            expect(audioManager.currentNarration).toBe('garden_of_paths');
        });

        test('should handle invalid narration key', () => {
            audioManager.playNarration('nonexistent_narration');
            
            expect(audioManager.currentNarration).toBeNull();
        });

        test('should auto-stop narration after duration', (done) => {
            // Mock shorter duration for testing
            audioManager.narrationContent['test_short'] = {
                text: 'Test narration',
                duration: 50 // 50ms
            };
            
            audioManager.playNarration('test_short');
            expect(audioManager.currentNarration).toBe('test_short');
            
            setTimeout(() => {
                expect(audioManager.currentNarration).toBeNull();
                done();
            }, 100);
        });
    });

    describe('Helicopter Audio Updates', () => {
        test('should update helicopter audio based on flight data', () => {
            const flightData = {
                collective: 0.8,
                speed: 25
            };

            expect(() => {
                audioManager.updateHelicopterAudio(flightData);
            }).not.toThrow();
        });

        test('should handle zero collective', () => {
            const flightData = {
                collective: 0,
                speed: 0
            };

            expect(() => {
                audioManager.updateHelicopterAudio(flightData);
            }).not.toThrow();
        });

        test('should handle maximum collective', () => {
            const flightData = {
                collective: 1.0,
                speed: 100
            };

            expect(() => {
                audioManager.updateHelicopterAudio(flightData);
            }).not.toThrow();
        });
    });

    describe('Zone Interactions', () => {
        test('should enter zone correctly', () => {
            audioManager.enterZone('Cave of Shadows');
            
            expect(audioManager.currentNarration).toBe('cave_of_shadows');
        });

        test('should handle all zone names', () => {
            const zones = [
                'Cave of Shadows',
                'Garden of Forking Paths',
                "Observer's Paradox",
                'Ship of Theseus'
            ];

            zones.forEach(zone => {
                expect(() => {
                    audioManager.enterZone(zone);
                }).not.toThrow();
            });
        });

        test('should handle invalid zone name', () => {
            expect(() => {
                audioManager.enterZone('Invalid Zone');
            }).not.toThrow();
        });

        test('should exit zone correctly', () => {
            audioManager.enterZone('Cave of Shadows');
            audioManager.exitZone();
            
            expect(audioManager.currentAmbient).toBe('matrix_void');
            expect(audioManager.currentNarration).toBeNull();
        });
    });

    describe('Volume Controls', () => {
        test('should set master volume correctly', () => {
            audioManager.setMasterVolume(0.5);
            
            expect(audioManager.masterVolume).toBe(0.5);
        });

        test('should clamp master volume to valid range', () => {
            audioManager.setMasterVolume(-0.5);
            expect(audioManager.masterVolume).toBe(0);
            
            audioManager.setMasterVolume(1.5);
            expect(audioManager.masterVolume).toBe(1);
        });
    });

    describe('Audio Context Management', () => {
        test('should resume audio context', () => {
            // Mock suspended context
            audioManager.audioContext = {
                state: 'suspended',
                resume: jest.fn()
            };
            
            audioManager.resumeAudioContext();
            
            expect(audioManager.audioContext.resume).toHaveBeenCalled();
        });

        test('should not resume running context', () => {
            // Mock running context
            audioManager.audioContext = {
                state: 'running',
                resume: jest.fn()
            };
            
            audioManager.resumeAudioContext();
            
            expect(audioManager.audioContext.resume).not.toHaveBeenCalled();
        });
    });

    describe('Procedural Sound Creation', () => {
        test('should create matrix void ambient', () => {
            const matrixVoid = audioManager.createMatrixVoidAmbient();
            
            expect(matrixVoid).toBeDefined();
            expect(matrixVoid.audio).toBeDefined();
            expect(matrixVoid.loop).toBe(true);
            expect(matrixVoid.volume).toBeGreaterThan(0);
        });

        test('should create digital wind ambient', () => {
            const digitalWind = audioManager.createDigitalWindAmbient();
            
            expect(digitalWind).toBeDefined();
            expect(digitalWind.audio).toBeDefined();
            expect(digitalWind.loop).toBe(true);
        });

        test('should create meditation drone', () => {
            const meditationDrone = audioManager.createMeditationDrone();
            
            expect(meditationDrone).toBeDefined();
            expect(meditationDrone.audio).toBeDefined();
            expect(meditationDrone.loop).toBe(true);
        });

        test('should create rotor sounds', () => {
            const mainRotor = audioManager.createRotorSound('main', 8);
            const tailRotor = audioManager.createRotorSound('tail', 25);
            
            expect(mainRotor).toBeDefined();
            expect(tailRotor).toBeDefined();
            expect(mainRotor.baseFreq).toBe(8);
            expect(tailRotor.baseFreq).toBe(25);
        });

        test('should create engine sound', () => {
            const engine = audioManager.createEngineSound();
            
            expect(engine).toBeDefined();
            expect(engine.source).toBeDefined();
            expect(engine.gainNode).toBeDefined();
        });
    });

    describe('Update Cycle', () => {
        test('should handle update without errors', () => {
            expect(() => {
                audioManager.update(0.016);
            }).not.toThrow();
        });

        test('should handle update with no audio context', () => {
            audioManager.audioContext = null;
            
            expect(() => {
                audioManager.update(0.016);
            }).not.toThrow();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle missing audio context gracefully', () => {
            audioManager.audioContext = null;
            
            expect(() => {
                audioManager.updateHelicopterAudio({ collective: 0.5, speed: 10 });
            }).not.toThrow();
        });

        test('should handle missing narration content', () => {
            expect(() => {
                audioManager.playNarration('missing_narration');
            }).not.toThrow();
        });

        test('should handle missing ambient sound', () => {
            expect(() => {
                audioManager.playAmbient('missing_ambient');
            }).not.toThrow();
        });
    });
});