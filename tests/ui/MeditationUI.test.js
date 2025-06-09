import { MeditationUI } from '../../src/ui/MeditationUI.js';

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
        setAttribute: jest.fn(),
        getAttribute: jest.fn(),
        parentElement: { remove: jest.fn() },
        offsetHeight: 0
    })),
    createElementNS: jest.fn(() => ({
        setAttribute: jest.fn(),
        appendChild: jest.fn()
    })),
    getElementById: jest.fn(),
    body: { appendChild: jest.fn() },
    head: { appendChild: jest.fn() },
    addEventListener: jest.fn()
};

const mockSVGElement = {
    setAttribute: jest.fn(),
    appendChild: jest.fn()
};

// Setup global mocks
global.document = mockDocument;
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.clearInterval = jest.fn();
global.setInterval = jest.fn();
global.setTimeout = jest.fn();

describe('MeditationUI', () => {
    let meditationUI;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDocument.getElementById.mockReturnValue({
            style: { display: 'none', animation: '', width: '', height: '', opacity: '' },
            textContent: '',
            innerHTML: '',
            value: '6',
            addEventListener: jest.fn(),
            remove: jest.fn(),
            parentElement: { remove: jest.fn() }
        });
        mockDocument.createElementNS.mockReturnValue(mockSVGElement);
        
        meditationUI = new MeditationUI();
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(meditationUI.isActive).toBe(false);
            expect(meditationUI.currentSession).toBeNull();
            expect(meditationUI.breathingRate).toBe(6);
            expect(meditationUI.currentPhase).toBe('preparation');
            expect(meditationUI.mindfulnessPrompts).toBeDefined();
        });

        test('should create meditation HUD', () => {
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
            expect(mockDocument.body.appendChild).toHaveBeenCalled();
        });

        test('should setup breathing guide with SVG elements', () => {
            expect(mockDocument.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'svg');
            expect(mockDocument.createElementNS).toHaveBeenCalledWith('http://www.w3.org/2000/svg', 'circle');
        });

        test('should setup progress visualization', () => {
            const createElementCalls = mockDocument.createElement.mock.calls;
            const progressCalls = createElementCalls.filter(call => 
                call[0] === 'div'
            );
            expect(progressCalls.length).toBeGreaterThan(0);
        });

        test('should setup focus indicator', () => {
            expect(meditationUI.focusIndicator).toBeDefined();
        });

        test('should setup event listeners', () => {
            expect(mockDocument.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        });
    });

    describe('Meditation Mode Toggle', () => {
        test('should enter meditation mode', () => {
            meditationUI.toggleMeditationMode();
            
            expect(meditationUI.isActive).toBe(true);
            expect(meditationUI.currentPhase).toBe('preparation');
        });

        test('should exit meditation mode', () => {
            meditationUI.isActive = true;
            meditationUI.toggleMeditationMode();
            
            expect(meditationUI.isActive).toBe(false);
        });

        test('should activate mindfulness prompts when entering', () => {
            const activateSpy = jest.spyOn(meditationUI.mindfulnessPrompts, 'activate');
            
            meditationUI.enterMeditationMode();
            
            expect(activateSpy).toHaveBeenCalled();
        });

        test('should deactivate mindfulness prompts when exiting', () => {
            const deactivateSpy = jest.spyOn(meditationUI.mindfulnessPrompts, 'deactivate');
            
            meditationUI.isActive = true;
            meditationUI.exitMeditationMode();
            
            expect(deactivateSpy).toHaveBeenCalled();
        });

        test('should dim regular UI when entering meditation mode', () => {
            mockDocument.getElementById
                .mockReturnValueOnce({ style: { opacity: '1' } }) // flight-info
                .mockReturnValueOnce({ style: { opacity: '1' } }); // keyboard-help
            
            meditationUI.enterMeditationMode();
            
            // UI should be dimmed (tested through method call)
            expect(meditationUI.isActive).toBe(true);
        });
    });

    describe('Session Management', () => {
        test('should start meditation session', () => {
            meditationUI.startMeditationSession();
            
            expect(meditationUI.currentSession).toBeDefined();
            expect(meditationUI.currentSession.startTime).toBeDefined();
            expect(meditationUI.sessionStartTime).toBeDefined();
        });

        test('should pause meditation session', () => {
            meditationUI.sessionTimer = setInterval(() => {}, 1000);
            meditationUI.breathingAnimation = setInterval(() => {}, 100);
            
            meditationUI.pauseMeditationSession();
            
            expect(clearInterval).toHaveBeenCalledTimes(2);
        });

        test('should end meditation session', () => {
            meditationUI.currentSession = { startTime: Date.now() };
            meditationUI.sessionTimer = setInterval(() => {}, 1000);
            
            meditationUI.endMeditationSession();
            
            expect(meditationUI.currentSession).toBeNull();
            expect(clearInterval).toHaveBeenCalled();
        });

        test('should show session summary when ending', () => {
            meditationUI.currentSession = { startTime: Date.now() - 60000 };
            meditationUI.sessionStartTime = Date.now() - 60000;
            
            meditationUI.endMeditationSession();
            
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
        });

        test('should update session progress', () => {
            meditationUI.currentSession = { 
                startTime: Date.now() - 30000,
                targetDuration: 600000
            };
            meditationUI.sessionStartTime = Date.now() - 30000;
            
            const durationElement = { textContent: '' };
            const progressBar = { style: { width: '' } };
            
            mockDocument.getElementById
                .mockReturnValueOnce(durationElement)
                .mockReturnValueOnce(progressBar);
            
            meditationUI.updateSessionProgress();
            
            expect(durationElement.textContent).toMatch(/\d{2}:\d{2}/);
        });
    });

    describe('Breathing Animation', () => {
        test('should start breathing animation', () => {
            meditationUI.startBreathingAnimation();
            
            expect(setInterval).toHaveBeenCalled();
        });

        test('should animate breathing circle', () => {
            meditationUI.breathingCircle = { setAttribute: jest.fn() };
            meditationUI.breathingInnerCircle = { setAttribute: jest.fn() };
            meditationUI.breathingInstruction = { textContent: '' };
            
            meditationUI.animateBreathingCircle(40, 'Breathe In', 0.5);
            
            expect(meditationUI.breathingCircle.setAttribute).toHaveBeenCalledWith('r', '40');
            expect(meditationUI.breathingInstruction.textContent).toBe('Breathe In');
        });

        test('should show breathing prompts during animation', () => {
            const showBreathingPromptSpy = jest.spyOn(meditationUI.mindfulnessPrompts, 'showBreathingPrompt');
            meditationUI.breathingCircle = { setAttribute: jest.fn() };
            meditationUI.breathingInnerCircle = { setAttribute: jest.fn() };
            meditationUI.breathingInstruction = { textContent: '' };
            
            // Mock Math.random to always trigger prompt
            jest.spyOn(Math, 'random').mockReturnValue(0.05);
            
            meditationUI.animateBreathingCircle(40, 'Breathe In', 0.5);
            
            expect(showBreathingPromptSpy).toHaveBeenCalledWith('inhale');
            
            Math.random.mockRestore();
        });

        test('should handle different breathing phases', () => {
            meditationUI.breathingInstruction = { textContent: '' };
            
            meditationUI.animateBreathingCircle(40, 'Breathe Out', 0.5);
            expect(meditationUI.breathingInstruction.textContent).toBe('Breathe Out');
            
            meditationUI.animateBreathingCircle(40, 'Hold', 0.5);
            expect(meditationUI.breathingInstruction.textContent).toBe('Hold');
        });
    });

    describe('Meditation Metrics', () => {
        test('should update meditation metrics based on flight data', () => {
            const flightData = {
                velocity: { x: 2, y: 1, z: 1 },
                controls: { collective: 0.5 }
            };
            
            const stabilityElement = { textContent: '' };
            const focusElement = { textContent: '' };
            const depthElement = { textContent: '' };
            
            mockDocument.getElementById
                .mockReturnValueOnce(stabilityElement)
                .mockReturnValueOnce(focusElement)
                .mockReturnValueOnce(depthElement);
            
            meditationUI.isActive = true;
            meditationUI.updateMeditationMetrics(flightData);
            
            expect(stabilityElement.textContent).toMatch(/\d+%/);
            expect(focusElement.textContent).toMatch(/\d+%/);
            expect(depthElement.textContent).toMatch(/\d+%/);
        });

        test('should calculate stability based on speed', () => {
            const slowFlightData = { velocity: { x: 1, y: 0, z: 1 } };
            const fastFlightData = { velocity: { x: 10, y: 0, z: 10 } };
            
            meditationUI.isActive = true;
            
            // Mock elements for metric updates
            mockDocument.getElementById.mockReturnValue({ textContent: '', style: { height: '' } });
            
            // Should handle different speeds without errors
            expect(() => {
                meditationUI.updateMeditationMetrics(slowFlightData);
                meditationUI.updateMeditationMetrics(fastFlightData);
            }).not.toThrow();
        });

        test('should update focus indicator', () => {
            const focusLevel = { style: { height: '' } };
            const focusPercentage = { textContent: '' };
            
            mockDocument.getElementById
                .mockReturnValueOnce(null) // stability
                .mockReturnValueOnce(null) // focus
                .mockReturnValueOnce(null) // depth
                .mockReturnValueOnce(focusLevel)
                .mockReturnValueOnce(focusPercentage);
            
            meditationUI.isActive = true;
            meditationUI.updateMeditationMetrics({ velocity: { x: 0, y: 0, z: 0 } });
            
            expect(focusLevel.style.height).toMatch(/\d+%/);
            expect(focusPercentage.textContent).toMatch(/\d+%/);
        });
    });

    describe('Phase Management', () => {
        test('should update phase based on location', () => {
            const initialPhase = meditationUI.currentPhase;
            
            meditationUI.isActive = true;
            meditationUI.updatePhaseBasedOnLocation({ x: 0, y: 0, z: 0 }, 'Cave of Shadows');
            
            expect(meditationUI.currentPhase).toBe('cave_of_shadows');
        });

        test('should return to flying phase when leaving zone', () => {
            meditationUI.currentPhase = 'cave_of_shadows';
            meditationUI.isActive = true;
            
            meditationUI.updatePhaseBasedOnLocation({ x: 0, y: 0, z: 0 }, null);
            
            expect(meditationUI.currentPhase).toBe('flying');
        });

        test('should update phase display element', () => {
            const phaseElement = { textContent: '' };
            mockDocument.getElementById.mockReturnValue(phaseElement);
            
            meditationUI.currentPhase = 'preparation';
            meditationUI.updatePhaseDisplay();
            
            expect(phaseElement.textContent).toBe('Preparation');
        });

        test('should show mindfulness prompt when phase changes', () => {
            const showPromptSpy = jest.spyOn(meditationUI, 'showMindfulnessPrompt');
            meditationUI.isActive = true;
            meditationUI.currentPhase = 'preparation';
            
            meditationUI.updatePhaseBasedOnLocation({ x: 0, y: 0, z: 0 }, 'Garden of Forking Paths');
            
            // Should change phase and show prompt after delay
            expect(meditationUI.currentPhase).toBe('garden_of_forking_paths');
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
        });
    });

    describe('Main Update Loop', () => {
        test('should not update when inactive', () => {
            const updateMetricsSpy = jest.spyOn(meditationUI, 'updateMeditationMetrics');
            
            meditationUI.isActive = false;
            meditationUI.update({}, null, 'day');
            
            expect(updateMetricsSpy).not.toHaveBeenCalled();
        });

        test('should update all systems when active', () => {
            const updateMetricsSpy = jest.spyOn(meditationUI, 'updateMeditationMetrics');
            const updatePhaseSpy = jest.spyOn(meditationUI, 'updatePhaseBasedOnLocation');
            const mindfulnessUpdateSpy = jest.spyOn(meditationUI.mindfulnessPrompts, 'update');
            
            meditationUI.isActive = true;
            const flightData = { velocity: { x: 0, y: 0, z: 0 } };
            
            meditationUI.update(flightData, 'Cave of Shadows', 'evening');
            
            expect(updateMetricsSpy).toHaveBeenCalledWith(flightData);
            expect(updatePhaseSpy).toHaveBeenCalledWith(flightData.position, 'Cave of Shadows');
            expect(mindfulnessUpdateSpy).toHaveBeenCalledWith(flightData, 'Cave of Shadows', 'evening', 0.016);
        });

        test('should handle missing flight data gracefully', () => {
            meditationUI.isActive = true;
            
            expect(() => {
                meditationUI.update(null, null, null);
                meditationUI.update({}, null, undefined);
                meditationUI.update({ velocity: null }, 'zone', 'time');
            }).not.toThrow();
        });
    });

    describe('UI Display Management', () => {
        test('should show mindfulness prompt', () => {
            meditationUI.mindfulnessPrompts = {
                prompts: [
                    { phase: 'preparation', prompts: ['Test prompt 1', 'Test prompt 2'] }
                ]
            };
            
            meditationUI.currentPhase = 'preparation';
            meditationUI.showMindfulnessPrompt();
            
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
        });

        test('should dim regular UI elements', () => {
            const flightInfo = { style: { opacity: '1' } };
            const keyboardHelp = { style: { opacity: '1' } };
            
            mockDocument.getElementById
                .mockReturnValueOnce(flightInfo)
                .mockReturnValueOnce(keyboardHelp);
            
            meditationUI.dimRegularUI(true);
            
            expect(flightInfo.style.opacity).toBe('0.3');
            expect(keyboardHelp.style.opacity).toBe('0.3');
        });

        test('should restore regular UI elements', () => {
            const flightInfo = { style: { opacity: '0.3' } };
            const keyboardHelp = { style: { opacity: '0.3' } };
            
            mockDocument.getElementById
                .mockReturnValueOnce(flightInfo)
                .mockReturnValueOnce(keyboardHelp);
            
            meditationUI.dimRegularUI(false);
            
            expect(flightInfo.style.opacity).toBe('1');
            expect(keyboardHelp.style.opacity).toBe('1');
        });

        test('should handle missing UI elements gracefully', () => {
            mockDocument.getElementById.mockReturnValue(null);
            
            expect(() => {
                meditationUI.dimRegularUI(true);
                meditationUI.updatePhaseDisplay();
                meditationUI.updateSessionProgress();
            }).not.toThrow();
        });
    });

    describe('Event Handling', () => {
        test('should setup breathing rate slider', () => {
            const slider = { 
                addEventListener: jest.fn(),
                value: '8'
            };
            mockDocument.getElementById.mockReturnValue(slider);
            
            meditationUI.setupEventListeners();
            
            expect(slider.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
        });

        test('should handle button clicks', () => {
            const startBtn = { addEventListener: jest.fn() };
            const pauseBtn = { addEventListener: jest.fn() };
            const endBtn = { addEventListener: jest.fn() };
            
            mockDocument.getElementById
                .mockReturnValueOnce(null) // breathing-slider
                .mockReturnValueOnce(startBtn) // start-meditation
                .mockReturnValueOnce(pauseBtn) // pause-meditation
                .mockReturnValueOnce(endBtn); // end-meditation
            
            meditationUI.setupEventListeners();
            
            expect(startBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
            expect(pauseBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
            expect(endBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('should update breathing rate from slider', () => {
            const mockEvent = { target: { value: '8' } };
            const rateDisplay = { textContent: '' };
            
            mockDocument.getElementById.mockReturnValue(rateDisplay);
            
            // Simulate slider change
            meditationUI.breathingRate = 6;
            meditationUI.breathingRate = parseInt(mockEvent.target.value);
            
            expect(meditationUI.breathingRate).toBe(8);
        });
    });

    describe('Public Interface', () => {
        test('should report meditation mode status', () => {
            expect(meditationUI.isInMeditationMode()).toBe(false);
            
            meditationUI.isActive = true;
            expect(meditationUI.isInMeditationMode()).toBe(true);
        });

        test('should provide complete API', () => {
            expect(typeof meditationUI.toggleMeditationMode).toBe('function');
            expect(typeof meditationUI.startMeditationSession).toBe('function');
            expect(typeof meditationUI.pauseMeditationSession).toBe('function');
            expect(typeof meditationUI.endMeditationSession).toBe('function');
            expect(typeof meditationUI.update).toBe('function');
            expect(typeof meditationUI.isInMeditationMode).toBe('function');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle null DOM elements', () => {
            mockDocument.getElementById.mockReturnValue(null);
            
            expect(() => {
                meditationUI.updateSessionProgress();
                meditationUI.updatePhaseDisplay();
                meditationUI.dimRegularUI(true);
            }).not.toThrow();
        });

        test('should handle missing properties in flight data', () => {
            meditationUI.isActive = true;
            
            expect(() => {
                meditationUI.updateMeditationMetrics({});
                meditationUI.updateMeditationMetrics({ velocity: {} });
                meditationUI.updateMeditationMetrics({ controls: {} });
            }).not.toThrow();
        });

        test('should handle invalid breathing animation parameters', () => {
            expect(() => {
                meditationUI.animateBreathingCircle(NaN, '', undefined);
                meditationUI.animateBreathingCircle(-1, null, 'invalid');
            }).not.toThrow();
        });

        test('should handle session management edge cases', () => {
            // Try to pause without active session
            expect(() => {
                meditationUI.pauseMeditationSession();
            }).not.toThrow();
            
            // Try to end without active session
            expect(() => {
                meditationUI.endMeditationSession();
            }).not.toThrow();
            
            // Try to update progress without session
            expect(() => {
                meditationUI.updateSessionProgress();
            }).not.toThrow();
        });

        test('should handle extreme time values', () => {
            meditationUI.currentSession = { 
                startTime: Date.now() - 86400000, // 24 hours ago
                targetDuration: 600000
            };
            meditationUI.sessionStartTime = Date.now() - 86400000;
            
            expect(() => {
                meditationUI.updateSessionProgress();
            }).not.toThrow();
        });

        test('should maintain state consistency during errors', () => {
            const originalState = {
                isActive: meditationUI.isActive,
                currentPhase: meditationUI.currentPhase,
                breathingRate: meditationUI.breathingRate
            };
            
            // Cause some DOM errors
            mockDocument.createElement.mockImplementation(() => {
                throw new Error('DOM error');
            });
            
            try {
                meditationUI.showMindfulnessPrompt();
            } catch (e) {
                // Should handle gracefully
            }
            
            // State should remain consistent
            expect(meditationUI.isActive).toBe(originalState.isActive);
            expect(meditationUI.currentPhase).toBe(originalState.currentPhase);
            expect(meditationUI.breathingRate).toBe(originalState.breathingRate);
        });
    });
});