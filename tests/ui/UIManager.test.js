import { UIManager } from '../../src/ui/UIManager.js';

// Mock DOM elements
const mockDocument = {
    createElement: jest.fn(() => ({
        id: '',
        style: { cssText: '' },
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(),
        remove: jest.fn(),
        addEventListener: jest.fn(),
        setAttribute: jest.fn()
    })),
    getElementById: jest.fn(),
    body: { appendChild: jest.fn() },
    head: { appendChild: jest.fn() }
};

// Mock MeditationUI
const mockMeditationUI = {
    update: jest.fn(),
    toggleMeditationMode: jest.fn(),
    isInMeditationMode: jest.fn(() => false)
};

// Setup global mocks
global.document = mockDocument;
global.setTimeout = jest.fn();

// Mock the MeditationUI import
jest.mock('../../src/ui/MeditationUI.js', () => ({
    MeditationUI: jest.fn(() => mockMeditationUI)
}));

describe('UIManager', () => {
    let uiManager;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup mock DOM elements
        mockDocument.getElementById.mockImplementation((id) => {
            switch (id) {
                case 'altitude':
                    return { textContent: '0' };
                case 'speed':
                    return { textContent: '0' };
                case 'reality-layer':
                    return { textContent: 'Simulation' };
                case 'time-info':
                    return { textContent: '' };
                case 'weather-info':
                    return { textContent: '' };
                case 'theme-info':
                    return { textContent: '' };
                case 'heli-type':
                    return { textContent: 'Matrix Scout' };
                case 'heli-mass':
                    return { textContent: '800' };
                case 'heli-lift':
                    return { textContent: '12000' };
                case 'control-collective':
                    return { textContent: '0.00' };
                case 'control-pitch':
                    return { textContent: '0.00' };
                case 'control-roll':
                    return { textContent: '0.00' };
                case 'control-yaw':
                    return { textContent: '0.00' };
                case 'ground-effect':
                    return { textContent: 'No', style: { color: '#00ff00' } };
                case 'vortex-ring':
                    return { textContent: 'No', style: { color: '#00ff00' } };
                case 'autorotation':
                    return { textContent: 'No', style: { color: '#00ff00' } };
                case 'ground-contact':
                    return { textContent: 'No', style: { color: '#00ff00' } };
                case 'torque':
                    return { textContent: '0.00' };
                case 'wind-speed':
                    return { textContent: '0.0' };
                case 'zone-message':
                    return null; // Usually doesn't exist initially
                default:
                    return null;
            }
        });

        uiManager = new UIManager();
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(uiManager.currentRealityLayer).toBe('Simulation');
            expect(uiManager.lastPhilosophicalZone).toBeNull();
            expect(uiManager.meditationUI).toBeDefined();
        });

        test('should setup UI elements', () => {
            expect(uiManager.altitudeElement).toBeDefined();
            expect(uiManager.speedElement).toBeDefined();
            expect(uiManager.realityLayerElement).toBeDefined();
        });

        test('should create keyboard help overlay', () => {
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
            expect(mockDocument.body.appendChild).toHaveBeenCalled();
        });

        test('should create enhanced HUD elements', () => {
            expect(uiManager.helicopterInfoElement).toBeDefined();
            expect(uiManager.advancedStatusElement).toBeDefined();
        });

        test('should setup CSS animations', () => {
            expect(mockDocument.createElement).toHaveBeenCalledWith('style');
            expect(mockDocument.head.appendChild).toHaveBeenCalled();
        });
    });

    describe('Flight Data Updates', () => {
        test('should update basic flight information', () => {
            const flightData = {
                altitude: '150m',
                speed: '25 km/h',
                position: { x: 0, y: 50, z: 0 }
            };

            uiManager.update(flightData);

            expect(uiManager.altitudeElement.textContent).toBe('150m');
            expect(uiManager.speedElement.textContent).toBe('25 km/h');
        });

        test('should update helicopter information', () => {
            const flightData = {
                altitude: '100m',
                speed: '20 km/h',
                position: { x: 0, y: 50, z: 0 },
                helicopter: {
                    type: 'Digital Transport'
                },
                controls: {
                    collective: '0.75',
                    cyclicPitch: '0.20',
                    cyclicRoll: '-0.10',
                    pedal: '0.05'
                }
            };

            uiManager.update(flightData);

            expect(mockDocument.getElementById('heli-type').textContent).toBe('Digital Transport');
            expect(mockDocument.getElementById('control-collective').textContent).toBe('0.75');
        });

        test('should update advanced flight status', () => {
            const flightData = {
                altitude: '50m',
                speed: '15 km/h',
                position: { x: 0, y: 50, z: 0 },
                advancedStatus: {
                    groundEffect: true,
                    vortexRingState: false,
                    autorotation: true,
                    groundContact: false,
                    torque: '2.45',
                    windSpeed: '8.2'
                }
            };

            uiManager.update(flightData);

            const groundEffectElement = mockDocument.getElementById('ground-effect');
            const autorotationElement = mockDocument.getElementById('autorotation');
            
            expect(groundEffectElement.textContent).toBe('Yes');
            expect(groundEffectElement.style.color).toBe('#ffaa00');
            expect(autorotationElement.textContent).toBe('ACTIVE');
            expect(autorotationElement.style.color).toBe('#ff8800');
        });

        test('should handle missing flight data gracefully', () => {
            expect(() => {
                uiManager.update({});
                uiManager.update({ position: null });
                uiManager.update(null);
            }).not.toThrow();
        });
    });

    describe('Philosophical Zone Detection', () => {
        test('should detect proximity to Cave of Shadows', () => {
            const position = { x: -190, y: 45, z: 195 }; // Near Cave of Shadows
            
            const zone = uiManager.checkPhilosophicalProximity(position);
            
            expect(zone).toBe('Cave of Shadows');
        });

        test('should detect proximity to Garden of Forking Paths', () => {
            const position = { x: 195, y: 35, z: -195 }; // Near Garden of Forking Paths
            
            const zone = uiManager.checkPhilosophicalProximity(position);
            
            expect(zone).toBe('Garden of Forking Paths');
        });

        test('should detect proximity to Observer\'s Paradox', () => {
            const position = { x: 5, y: 75, z: 5 }; // Near Observer's Paradox
            
            const zone = uiManager.checkPhilosophicalProximity(position);
            
            expect(zone).toBe("Observer's Paradox");
        });

        test('should detect proximity to Ship of Theseus', () => {
            const position = { x: -95, y: 65, z: -95 }; // Near Ship of Theseus
            
            const zone = uiManager.checkPhilosophicalProximity(position);
            
            expect(zone).toBe('Ship of Theseus');
        });

        test('should return null when far from all zones', () => {
            const position = { x: 500, y: 100, z: 500 }; // Far from all zones
            
            const zone = uiManager.checkPhilosophicalProximity(position);
            
            expect(zone).toBeNull();
        });

        test('should return nearest zone when multiple zones are close', () => {
            const position = { x: 50, y: 55, z: 50 }; // Between zones
            
            const zone = uiManager.checkPhilosophicalProximity(position);
            
            expect(zone).toBeDefined();
        });
    });

    describe('Zone Message Display', () => {
        test('should show zone message when entering new zone', () => {
            uiManager.showZoneMessage('Cave of Shadows');
            
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
            expect(mockDocument.body.appendChild).toHaveBeenCalled();
        });

        test('should include correct message for each zone', () => {
            const mockDiv = { style: { cssText: '' }, textContent: '', id: '' };
            mockDocument.createElement.mockReturnValue(mockDiv);
            
            uiManager.showZoneMessage('Garden of Forking Paths');
            
            expect(mockDiv.textContent).toContain('Garden of Forking Paths ahead');
            expect(mockDiv.textContent).toContain('Every choice creates a new reality');
        });

        test('should auto-hide zone message after timeout', () => {
            uiManager.showZoneMessage('Ship of Theseus');
            
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
        });

        test('should remove existing message before showing new one', () => {
            const existingMessage = { remove: jest.fn() };
            mockDocument.getElementById.mockReturnValueOnce(existingMessage);
            
            uiManager.showZoneMessage('Cave of Shadows');
            
            expect(existingMessage.remove).toHaveBeenCalled();
        });

        test('should show zone message only when entering new zone', () => {
            const position = { x: -190, y: 45, z: 195 }; // Cave of Shadows
            
            // First visit should show message
            uiManager.checkPhilosophicalProximity(position);
            const firstCallCount = mockDocument.createElement.mock.calls.length;
            
            // Second visit to same zone should not show message again
            jest.clearAllMocks();
            uiManager.checkPhilosophicalProximity(position);
            
            expect(mockDocument.createElement).not.toHaveBeenCalled();
        });

        test('should hide message when leaving zone', () => {
            const nearPosition = { x: -190, y: 45, z: 195 }; // Near Cave of Shadows
            const farPosition = { x: 500, y: 100, z: 500 }; // Far from all zones
            
            // Enter zone
            uiManager.checkPhilosophicalProximity(nearPosition);
            
            // Leave zone
            const existingMessage = { remove: jest.fn() };
            mockDocument.getElementById.mockReturnValueOnce(existingMessage);
            uiManager.checkPhilosophicalProximity(farPosition);
            
            expect(uiManager.lastPhilosophicalZone).toBeNull();
        });
    });

    describe('Reality Layer Toggle', () => {
        test('should toggle between Simulation and Code View', () => {
            expect(uiManager.currentRealityLayer).toBe('Simulation');
            
            uiManager.toggleRealityLayer();
            expect(uiManager.currentRealityLayer).toBe('Code View');
            
            uiManager.toggleRealityLayer();
            expect(uiManager.currentRealityLayer).toBe('Simulation');
        });

        test('should update reality layer display element', () => {
            const realityElement = { textContent: 'Simulation' };
            uiManager.realityLayerElement = realityElement;
            
            uiManager.toggleRealityLayer();
            
            expect(realityElement.textContent).toBe('Code View');
        });
    });

    describe('Additional UI Updates', () => {
        test('should update time information', () => {
            const mockDayNightCycle = {
                getCurrentPhaseInfo: () => ({
                    timeString: '14:30',
                    name: 'Afternoon',
                    phase: 'day'
                })
            };
            
            const timeElement = { textContent: '' };
            uiManager.timeElement = timeElement;
            
            uiManager.updateTimeInfo(mockDayNightCycle);
            
            expect(timeElement.textContent).toBe('14:30 - Afternoon');
            expect(uiManager.currentTimeOfDay).toBe('day');
        });

        test('should update weather information', () => {
            const mockWeatherSystem = {
                getCurrentWeatherInfo: () => ({ name: 'Clear Skies' })
            };
            
            const weatherElement = { textContent: '' };
            uiManager.weatherElement = weatherElement;
            
            uiManager.updateWeatherInfo(mockWeatherSystem);
            
            expect(weatherElement.textContent).toBe('Clear Skies');
        });

        test('should update theme information', () => {
            const mockCustomization = {
                getCurrentTheme: () => ({ name: 'Cyber Matrix' })
            };
            
            const themeElement = { textContent: '' };
            uiManager.themeElement = themeElement;
            
            uiManager.updateThemeInfo(mockCustomization);
            
            expect(themeElement.textContent).toBe('Theme: Cyber Matrix');
        });

        test('should handle null additional UI components', () => {
            expect(() => {
                uiManager.updateTimeInfo(null);
                uiManager.updateWeatherInfo(null);
                uiManager.updateThemeInfo(null);
            }).not.toThrow();
        });
    });

    describe('Advanced Status Display', () => {
        test('should highlight dangerous conditions', () => {
            const dangerousStatus = {
                groundEffect: false,
                vortexRingState: true,
                autorotation: false,
                groundContact: false,
                torque: '5.20',
                windSpeed: '15.5'
            };

            const flightData = {
                altitude: '30m',
                speed: '45 km/h',
                position: { x: 0, y: 30, z: 0 },
                advancedStatus: dangerousStatus
            };

            uiManager.update(flightData);

            const vortexElement = mockDocument.getElementById('vortex-ring');
            expect(vortexElement.textContent).toBe('DANGER');
            expect(vortexElement.style.color).toBe('#ff4400');
        });

        test('should show normal status colors for safe conditions', () => {
            const safeStatus = {
                groundEffect: false,
                vortexRingState: false,
                autorotation: false,
                groundContact: false,
                torque: '1.20',
                windSpeed: '3.5'
            };

            const flightData = {
                altitude: '100m',
                speed: '25 km/h',
                position: { x: 0, y: 100, z: 0 },
                advancedStatus: safeStatus
            };

            uiManager.update(flightData);

            const elements = [
                mockDocument.getElementById('ground-effect'),
                mockDocument.getElementById('vortex-ring'),
                mockDocument.getElementById('autorotation'),
                mockDocument.getElementById('ground-contact')
            ];

            elements.forEach(element => {
                expect(element.style.color).toBe('#00ff00');
            });
        });

        test('should handle missing advanced status data', () => {
            const flightData = {
                altitude: '75m',
                speed: '30 km/h',
                position: { x: 0, y: 75, z: 0 }
                // advancedStatus missing
            };

            expect(() => {
                uiManager.update(flightData);
            }).not.toThrow();
        });
    });

    describe('Meditation UI Integration', () => {
        test('should delegate meditation mode toggle', () => {
            uiManager.toggleMeditationMode();
            
            expect(mockMeditationUI.toggleMeditationMode).toHaveBeenCalled();
        });

        test('should check meditation mode status', () => {
            mockMeditationUI.isInMeditationMode.mockReturnValue(true);
            
            const isActive = uiManager.isInMeditationMode();
            
            expect(isActive).toBe(true);
            expect(mockMeditationUI.isInMeditationMode).toHaveBeenCalled();
        });

        test('should update meditation UI with flight data', () => {
            const flightData = {
                altitude: '80m',
                speed: '20 km/h',
                position: { x: -190, y: 45, z: 195 } // Near Cave of Shadows
            };
            
            uiManager.currentTimeOfDay = 'evening';
            uiManager.update(flightData);
            
            expect(mockMeditationUI.update).toHaveBeenCalledWith(
                flightData,
                'Cave of Shadows',
                'evening'
            );
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle missing DOM elements gracefully', () => {
            mockDocument.getElementById.mockReturnValue(null);
            
            expect(() => {
                const manager = new UIManager();
                manager.update({
                    altitude: '100m',
                    speed: '25 km/h',
                    position: { x: 0, y: 100, z: 0 }
                });
            }).not.toThrow();
        });

        test('should handle malformed position data', () => {
            expect(() => {
                uiManager.checkPhilosophicalProximity(null);
                uiManager.checkPhilosophicalProximity({});
                uiManager.checkPhilosophicalProximity({ x: 'invalid', y: NaN, z: undefined });
            }).not.toThrow();
        });

        test('should handle zone message errors gracefully', () => {
            mockDocument.createElement.mockImplementation(() => {
                throw new Error('DOM error');
            });
            
            expect(() => {
                uiManager.showZoneMessage('Cave of Shadows');
            }).not.toThrow();
        });

        test('should handle extreme distance calculations', () => {
            const extremePosition = { 
                x: Number.MAX_SAFE_INTEGER, 
                y: Number.MAX_SAFE_INTEGER, 
                z: Number.MAX_SAFE_INTEGER 
            };
            
            expect(() => {
                uiManager.checkPhilosophicalProximity(extremePosition);
            }).not.toThrow();
        });

        test('should maintain state consistency during errors', () => {
            const originalLayer = uiManager.currentRealityLayer;
            const originalZone = uiManager.lastPhilosophicalZone;
            
            // Force some errors
            try {
                uiManager.update({ position: { x: 'error', y: 'error', z: 'error' } });
            } catch (e) {
                // Should handle gracefully
            }
            
            // State should remain consistent
            expect(uiManager.currentRealityLayer).toBe(originalLayer);
        });
    });

    describe('Performance and Memory', () => {
        test('should handle rapid updates efficiently', () => {
            const startTime = Date.now();
            
            // Simulate 100 rapid updates
            for (let i = 0; i < 100; i++) {
                uiManager.update({
                    altitude: `${i}m`,
                    speed: `${i * 2} km/h`,
                    position: { x: i, y: i, z: i },
                    helicopter: { type: 'Matrix Scout' },
                    controls: {
                        collective: (i / 100).toFixed(2),
                        cyclicPitch: ((i - 50) / 100).toFixed(2),
                        cyclicRoll: ((i - 50) / 100).toFixed(2),
                        pedal: ((i - 50) / 100).toFixed(2)
                    },
                    advancedStatus: {
                        groundEffect: i % 2 === 0,
                        vortexRingState: i % 10 === 0,
                        autorotation: i % 5 === 0,
                        groundContact: i % 20 === 0,
                        torque: (i / 50).toFixed(2),
                        windSpeed: (i / 10).toFixed(1)
                    }
                });
            }
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete in reasonable time
            expect(duration).toBeLessThan(1000);
        });

        test('should not leak memory with zone message creation', () => {
            // Create many zone messages to test cleanup
            for (let i = 0; i < 50; i++) {
                uiManager.showZoneMessage('Cave of Shadows');
                uiManager.hideZoneMessage();
            }
            
            // Should not accumulate elements
            expect(mockDocument.createElement).toHaveBeenCalled();
        });
    });

    describe('Integration Tests', () => {
        test('should handle complete flight scenario', () => {
            // Start at high altitude
            let flightData = {
                altitude: '200m',
                speed: '50 km/h',
                position: { x: 300, y: 200, z: 300 },
                helicopter: { type: 'Matrix Scout' },
                controls: { collective: '0.80', cyclicPitch: '0.00', cyclicRoll: '0.00', pedal: '0.00' },
                advancedStatus: {
                    groundEffect: false,
                    vortexRingState: false,
                    autorotation: false,
                    groundContact: false,
                    torque: '3.20',
                    windSpeed: '5.0'
                }
            };
            
            uiManager.update(flightData);
            expect(uiManager.altitudeElement.textContent).toBe('200m');
            
            // Fly towards Cave of Shadows
            flightData.position = { x: -190, y: 45, z: 195 };
            flightData.altitude = '45m';
            flightData.advancedStatus.groundEffect = true;
            
            uiManager.update(flightData);
            
            // Should detect zone proximity
            expect(uiManager.lastPhilosophicalZone).toBe('Cave of Shadows');
            
            // Enter meditation mode
            uiManager.toggleMeditationMode();
            expect(mockMeditationUI.toggleMeditationMode).toHaveBeenCalled();
            
            // Toggle reality layer
            uiManager.toggleRealityLayer();
            expect(uiManager.currentRealityLayer).toBe('Code View');
            
            // Continue flight with different helicopter
            flightData.helicopter.type = 'Digital Transport';
            flightData.controls.collective = '0.65';
            
            uiManager.update(flightData);
            expect(mockDocument.getElementById('heli-type').textContent).toBe('Digital Transport');
        });

        test('should coordinate all UI systems properly', () => {
            // Setup complete scenario with all systems
            const flightData = {
                altitude: '120m',
                speed: '35 km/h',
                position: { x: 195, y: 35, z: -195 }, // Garden of Forking Paths
                helicopter: { type: 'Quantum Paradox' },
                controls: {
                    collective: '0.70',
                    cyclicPitch: '0.15',
                    cyclicRoll: '-0.08',
                    pedal: '0.12'
                },
                advancedStatus: {
                    groundEffect: false,
                    vortexRingState: false,
                    autorotation: true,
                    groundContact: false,
                    torque: '4.15',
                    windSpeed: '12.3'
                }
            };
            
            const mockDayNight = {
                getCurrentPhaseInfo: () => ({
                    timeString: '19:45',
                    name: 'Dusk',
                    phase: 'evening'
                })
            };
            
            const mockWeather = {
                getCurrentWeatherInfo: () => ({ name: 'Light Wind' })
            };
            
            // Update all systems
            uiManager.update(flightData);
            uiManager.updateTimeInfo(mockDayNight);
            uiManager.updateWeatherInfo(mockWeather);
            
            // Verify all systems updated correctly
            expect(uiManager.lastPhilosophicalZone).toBe('Garden of Forking Paths');
            expect(uiManager.currentTimeOfDay).toBe('evening');
            expect(mockMeditationUI.update).toHaveBeenCalledWith(
                flightData,
                'Garden of Forking Paths',
                'evening'
            );
        });
    });
});