import { MindfulnessPrompts } from '../../src/ui/MindfulnessPrompts.js';

// Mock DOM elements
const mockDocument = {
    createElement: jest.fn(() => ({
        id: '',
        style: { cssText: '', animation: '' },
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(),
        remove: jest.fn(),
        parentElement: { remove: jest.fn() }
    })),
    getElementById: jest.fn(),
    body: { appendChild: jest.fn() },
    head: { appendChild: jest.fn() }
};

global.document = mockDocument;
global.setTimeout = jest.fn();
global.Date = {
    now: jest.fn(() => 1000000)
};

describe('MindfulnessPrompts', () => {
    let prompts;

    beforeEach(() => {
        jest.clearAllMocks();
        prompts = new MindfulnessPrompts();
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(prompts.isActive).toBe(false);
            expect(prompts.currentPrompt).toBeNull();
            expect(prompts.promptHistory).toEqual([]);
            expect(prompts.promptInterval).toBe(30000);
            expect(prompts.lastPromptTime).toBe(0);
        });

        test('should setup prompt database', () => {
            expect(prompts.prompts).toBeDefined();
            expect(prompts.prompts.flying).toBeDefined();
            expect(prompts.prompts.zones).toBeDefined();
            expect(prompts.prompts.timeOfDay).toBeDefined();
            expect(prompts.prompts.flightStates).toBeDefined();
            expect(prompts.prompts.breathing).toBeDefined();
        });

        test('should have comprehensive prompt categories', () => {
            expect(prompts.prompts.flying.general).toBeInstanceOf(Array);
            expect(prompts.prompts.flying.stable).toBeInstanceOf(Array);
            expect(prompts.prompts.flying.turbulent).toBeInstanceOf(Array);
            expect(prompts.prompts.flying.ascending).toBeInstanceOf(Array);
            expect(prompts.prompts.flying.descending).toBeInstanceOf(Array);
        });

        test('should have zone-specific prompts', () => {
            expect(prompts.prompts.zones['Cave of Shadows']).toBeInstanceOf(Array);
            expect(prompts.prompts.zones['Garden of Forking Paths']).toBeInstanceOf(Array);
            expect(prompts.prompts.zones["Observer's Paradox"]).toBeInstanceOf(Array);
            expect(prompts.prompts.zones['Ship of Theseus']).toBeInstanceOf(Array);
        });

        test('should have time-based prompts', () => {
            expect(prompts.prompts.timeOfDay.morning).toBeInstanceOf(Array);
            expect(prompts.prompts.timeOfDay.noon).toBeInstanceOf(Array);
            expect(prompts.prompts.timeOfDay.evening).toBeInstanceOf(Array);
            expect(prompts.prompts.timeOfDay.night).toBeInstanceOf(Array);
        });

        test('should have flight state prompts', () => {
            expect(prompts.prompts.flightStates.groundEffect).toBeInstanceOf(Array);
            expect(prompts.prompts.flightStates.autorotation).toBeInstanceOf(Array);
            expect(prompts.prompts.flightStates.vortexRing).toBeInstanceOf(Array);
            expect(prompts.prompts.flightStates.hovering).toBeInstanceOf(Array);
        });

        test('should have breathing prompts', () => {
            expect(prompts.prompts.breathing.inhale).toBeInstanceOf(Array);
            expect(prompts.prompts.breathing.exhale).toBeInstanceOf(Array);
            expect(prompts.prompts.breathing.hold).toBeInstanceOf(Array);
        });
    });

    describe('Activation and Deactivation', () => {
        test('should activate prompts system', () => {
            prompts.activate();
            
            expect(prompts.isActive).toBe(true);
            expect(prompts.lastPromptTime).toBe(1000000);
        });

        test('should deactivate prompts system', () => {
            const hidePromptSpy = jest.spyOn(prompts, 'hideCurrentPrompt');
            prompts.isActive = true;
            
            prompts.deactivate();
            
            expect(prompts.isActive).toBe(false);
            expect(hidePromptSpy).toHaveBeenCalled();
        });

        test('should hide current prompt when deactivating', () => {
            mockDocument.getElementById.mockReturnValue({
                style: { animation: '' },
                parentElement: { remove: jest.fn() }
            });
            
            prompts.deactivate();
            
            expect(mockDocument.getElementById).toHaveBeenCalledWith('mindfulness-floating-prompt');
        });
    });

    describe('Context Analysis', () => {
        test('should analyze flight context correctly', () => {
            const flightData = {
                velocity: { x: 2, y: 1, z: 1 },
                advancedStatus: {
                    groundEffect: true,
                    autorotation: false,
                    vortexRingState: false
                }
            };
            
            const context = prompts.analyzeContext(flightData, 'Cave of Shadows', 'morning');
            
            expect(context.zone).toBe('Cave of Shadows');
            expect(context.timeOfDay).toBe('morning');
            expect(context.stability).toBe('stable');
            expect(context.verticalMotion).toBe('ascending');
            expect(context.specialStates).toContain('groundEffect');
        });

        test('should detect turbulent flight', () => {
            const flightData = {
                velocity: { x: 10, y: 0, z: 10 }
            };
            
            const context = prompts.analyzeContext(flightData, null, null);
            
            expect(context.stability).toBe('turbulent');
        });

        test('should detect vertical motion', () => {
            const ascendingData = { velocity: { x: 0, y: 3, z: 0 } };
            const descendingData = { velocity: { x: 0, y: -3, z: 0 } };
            const levelData = { velocity: { x: 0, y: 0.5, z: 0 } };
            
            expect(prompts.analyzeContext(ascendingData).verticalMotion).toBe('ascending');
            expect(prompts.analyzeContext(descendingData).verticalMotion).toBe('descending');
            expect(prompts.analyzeContext(levelData).verticalMotion).toBe('level');
        });

        test('should detect hovering state', () => {
            const hoveringData = {
                velocity: { x: 0.2, y: 0.2, z: 0.2 },
                advancedStatus: {}
            };
            
            const context = prompts.analyzeContext(hoveringData);
            
            expect(context.specialStates).toContain('hovering');
        });

        test('should detect special flight states', () => {
            const flightData = {
                velocity: { x: 0, y: 0, z: 0 },
                advancedStatus: {
                    groundEffect: true,
                    autorotation: true,
                    vortexRingState: true
                }
            };
            
            const context = prompts.analyzeContext(flightData);
            
            expect(context.specialStates).toContain('groundEffect');
            expect(context.specialStates).toContain('autorotation');
            expect(context.specialStates).toContain('vortexRing');
        });

        test('should handle missing flight data', () => {
            expect(() => {
                prompts.analyzeContext(null, null, null);
                prompts.analyzeContext({}, null, null);
                prompts.analyzeContext({ velocity: null }, null, null);
            }).not.toThrow();
        });
    });

    describe('Prompt Selection', () => {
        test('should prioritize zone-specific prompts', () => {
            const context = {
                zone: 'Cave of Shadows',
                timeOfDay: 'morning',
                flightState: 'general',
                stability: 'stable',
                verticalMotion: 'level',
                specialStates: []
            };
            
            const prompt = prompts.selectPrompt(context);
            
            expect(typeof prompt).toBe('string');
            expect(prompt.length).toBeGreaterThan(0);
        });

        test('should select special state prompts', () => {
            const context = {
                zone: null,
                timeOfDay: null,
                specialStates: ['autorotation']
            };
            
            const prompt = prompts.selectPrompt(context);
            
            expect(prompts.prompts.flightStates.autorotation).toContain(prompt);
        });

        test('should fall back to general prompts', () => {
            const context = {
                zone: null,
                timeOfDay: null,
                flightState: 'general',
                stability: 'stable',
                verticalMotion: 'level',
                specialStates: []
            };
            
            const prompt = prompts.selectPrompt(context);
            
            expect(typeof prompt).toBe('string');
        });

        test('should avoid recently used prompts', () => {
            const context = {
                zone: 'Cave of Shadows',
                specialStates: []
            };
            
            // Fill history with all Cave of Shadows prompts
            prompts.promptHistory = prompts.prompts.zones['Cave of Shadows'].map(prompt => ({
                text: prompt,
                timestamp: Date.now()
            }));
            
            const selectedPrompt = prompts.selectPrompt(context);
            
            // Should not select recently used prompts
            const recentPrompts = prompts.promptHistory.slice(-10).map(p => p.text);
            expect(recentPrompts).not.toContain(selectedPrompt);
        });

        test('should handle empty prompt categories', () => {
            const context = {
                zone: 'NonexistentZone',
                timeOfDay: 'invalid',
                specialStates: ['invalid']
            };
            
            const prompt = prompts.selectPrompt(context);
            
            expect(typeof prompt).toBe('string');
            expect(prompts.prompts.flying.general).toContain(prompt);
        });
    });

    describe('Prompt Display', () => {
        test('should display contextual prompt', () => {
            const context = { zone: 'Cave of Shadows' };
            
            prompts.displayPrompt('Test prompt', context);
            
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
            expect(mockDocument.body.appendChild).toHaveBeenCalled();
        });

        test('should include context indicator for zones', () => {
            const context = { zone: 'Cave of Shadows' };
            const mockDiv = { innerHTML: '', style: { cssText: '' } };
            mockDocument.createElement.mockReturnValue(mockDiv);
            
            prompts.displayPrompt('Test prompt', context);
            
            expect(mockDiv.innerHTML).toContain('Cave of Shadows');
        });

        test('should auto-hide prompt after timeout', () => {
            prompts.displayPrompt('Test prompt', {});
            
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 8000);
        });

        test('should hide existing prompt before showing new one', () => {
            const hidePromptSpy = jest.spyOn(prompts, 'hideCurrentPrompt');
            
            prompts.displayPrompt('Test prompt', {});
            
            expect(hidePromptSpy).toHaveBeenCalled();
        });

        test('should create CSS animations on first use', () => {
            mockDocument.getElementById.mockReturnValue(null); // No existing animations
            
            prompts.displayPrompt('Test prompt', {});
            
            expect(mockDocument.createElement).toHaveBeenCalledWith('style');
            expect(mockDocument.head.appendChild).toHaveBeenCalled();
        });
    });

    describe('Breathing Prompts', () => {
        test('should show breathing prompt when active', () => {
            prompts.isActive = true;
            
            prompts.showBreathingPrompt('inhale');
            
            expect(mockDocument.createElement).toHaveBeenCalledWith('div');
        });

        test('should not show breathing prompt when inactive', () => {
            prompts.isActive = false;
            
            prompts.showBreathingPrompt('inhale');
            
            expect(mockDocument.createElement).not.toHaveBeenCalled();
        });

        test('should handle different breathing phases', () => {
            prompts.isActive = true;
            
            expect(() => {
                prompts.showBreathingPrompt('inhale');
                prompts.showBreathingPrompt('exhale');
                prompts.showBreathingPrompt('hold');
            }).not.toThrow();
        });

        test('should handle invalid breathing phases', () => {
            prompts.isActive = true;
            
            expect(() => {
                prompts.showBreathingPrompt('invalid');
                prompts.showBreathingPrompt(null);
                prompts.showBreathingPrompt(undefined);
            }).not.toThrow();
        });

        test('should auto-hide breathing prompt quickly', () => {
            prompts.isActive = true;
            
            prompts.showBreathingPrompt('inhale');
            
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
        });
    });

    describe('Update System', () => {
        test('should not update when inactive', () => {
            const showPromptSpy = jest.spyOn(prompts, 'showContextualPrompt');
            
            prompts.update({}, null, null, 0.016);
            
            expect(showPromptSpy).not.toHaveBeenCalled();
        });

        test('should show prompt when interval has passed', () => {
            prompts.isActive = true;
            prompts.lastPromptTime = 0;
            Date.now.mockReturnValue(31000); // 31 seconds later
            
            const showPromptSpy = jest.spyOn(prompts, 'showContextualPrompt');
            
            prompts.update({}, null, null, 0.016);
            
            expect(showPromptSpy).toHaveBeenCalled();
        });

        test('should not show prompt before interval', () => {
            prompts.isActive = true;
            prompts.lastPromptTime = 0;
            Date.now.mockReturnValue(15000); // 15 seconds later
            
            const showPromptSpy = jest.spyOn(prompts, 'showContextualPrompt');
            
            prompts.update({}, null, null, 0.016);
            
            expect(showPromptSpy).not.toHaveBeenCalled();
        });

        test('should update last prompt time after showing', () => {
            prompts.isActive = true;
            prompts.lastPromptTime = 0;
            Date.now.mockReturnValue(31000);
            
            prompts.update({}, null, null, 0.016);
            
            expect(prompts.lastPromptTime).toBe(31000);
        });
    });

    describe('Contextual Prompt System', () => {
        test('should show contextual prompt with flight data', () => {
            const analyzeContextSpy = jest.spyOn(prompts, 'analyzeContext');
            const selectPromptSpy = jest.spyOn(prompts, 'selectPrompt');
            const displayPromptSpy = jest.spyOn(prompts, 'displayPrompt');
            
            const flightData = { velocity: { x: 0, y: 0, z: 0 } };
            
            prompts.showContextualPrompt(flightData, 'Cave of Shadows', 'morning');
            
            expect(analyzeContextSpy).toHaveBeenCalledWith(flightData, 'Cave of Shadows', 'morning');
            expect(selectPromptSpy).toHaveBeenCalled();
            expect(displayPromptSpy).toHaveBeenCalled();
        });

        test('should add prompt to history', () => {
            const initialHistoryLength = prompts.promptHistory.length;
            
            prompts.showContextualPrompt({}, null, null);
            
            expect(prompts.promptHistory.length).toBe(initialHistoryLength + 1);
            expect(prompts.currentPrompt).toBeDefined();
        });

        test('should limit history size', () => {
            // Fill history to capacity
            for (let i = 0; i < 55; i++) {
                prompts.promptHistory.push({ text: `Prompt ${i}`, timestamp: Date.now() });
            }
            
            prompts.showContextualPrompt({}, null, null);
            
            expect(prompts.promptHistory.length).toBeLessThanOrEqual(50);
        });

        test('should store complete prompt information', () => {
            prompts.showContextualPrompt({ velocity: { x: 0, y: 0, z: 0 } }, 'Cave of Shadows', 'morning');
            
            expect(prompts.currentPrompt).toHaveProperty('text');
            expect(prompts.currentPrompt).toHaveProperty('context');
            expect(prompts.currentPrompt).toHaveProperty('timestamp');
            expect(prompts.currentPrompt.context.zone).toBe('Cave of Shadows');
        });
    });

    describe('Configuration and Utilities', () => {
        test('should set prompt interval with minimum limit', () => {
            prompts.setPromptInterval(5000); // Below minimum
            expect(prompts.promptInterval).toBe(10000);
            
            prompts.setPromptInterval(45000); // Above minimum
            expect(prompts.promptInterval).toBe(45000);
        });

        test('should return prompt history copy', () => {
            prompts.promptHistory.push({ text: 'Test', timestamp: Date.now() });
            
            const history = prompts.getPromptHistory();
            
            expect(history).toEqual(prompts.promptHistory);
            expect(history).not.toBe(prompts.promptHistory); // Should be a copy
        });

        test('should return contextual prompts for testing', () => {
            const context = {
                zone: 'Cave of Shadows',
                specialStates: ['autorotation']
            };
            
            const contextualPrompts = prompts.getContextualPrompts(context);
            
            expect(Array.isArray(contextualPrompts)).toBe(true);
            expect(contextualPrompts.length).toBeGreaterThan(0);
        });

        test('should include zone and special state prompts', () => {
            const context = {
                zone: 'Cave of Shadows',
                specialStates: ['autorotation', 'groundEffect']
            };
            
            const contextualPrompts = prompts.getContextualPrompts(context);
            
            // Should include prompts from all relevant categories
            const zonePrompts = prompts.prompts.zones['Cave of Shadows'];
            const autoPrompts = prompts.prompts.flightStates.autorotation;
            const groundPrompts = prompts.prompts.flightStates.groundEffect;
            
            expect(contextualPrompts.some(p => zonePrompts.includes(p))).toBe(true);
            expect(contextualPrompts.some(p => autoPrompts.includes(p))).toBe(true);
            expect(contextualPrompts.some(p => groundPrompts.includes(p))).toBe(true);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle DOM errors gracefully', () => {
            mockDocument.createElement.mockImplementation(() => {
                throw new Error('DOM error');
            });
            
            expect(() => {
                prompts.displayPrompt('Test prompt', {});
                prompts.showBreathingPrompt('inhale');
            }).not.toThrow();
        });

        test('should handle missing DOM elements', () => {
            mockDocument.getElementById.mockReturnValue(null);
            
            expect(() => {
                prompts.hideCurrentPrompt();
            }).not.toThrow();
        });

        test('should handle invalid flight data', () => {
            expect(() => {
                prompts.analyzeContext(null, null, null);
                prompts.analyzeContext({}, null, null);
                prompts.analyzeContext({ velocity: null }, null, null);
                prompts.analyzeContext({ velocity: { x: NaN, y: undefined, z: 'invalid' } }, null, null);
            }).not.toThrow();
        });

        test('should handle extreme time values', () => {
            Date.now.mockReturnValue(Number.MAX_SAFE_INTEGER);
            
            expect(() => {
                prompts.update({}, null, null, 0.016);
            }).not.toThrow();
        });

        test('should handle rapid consecutive updates', () => {
            prompts.isActive = true;
            
            expect(() => {
                for (let i = 0; i < 100; i++) {
                    prompts.update({}, null, null, 0.016);
                }
            }).not.toThrow();
        });

        test('should maintain consistency during errors', () => {
            const originalState = {
                isActive: prompts.isActive,
                promptInterval: prompts.promptInterval,
                historyLength: prompts.promptHistory.length
            };
            
            // Cause error in prompt selection
            jest.spyOn(prompts, 'selectPrompt').mockImplementation(() => {
                throw new Error('Selection error');
            });
            
            try {
                prompts.showContextualPrompt({}, null, null);
            } catch (e) {
                // Should handle gracefully
            }
            
            // State should remain consistent
            expect(prompts.isActive).toBe(originalState.isActive);
            expect(prompts.promptInterval).toBe(originalState.promptInterval);
        });

        test('should handle memory constraints with large history', () => {
            // Simulate large history
            for (let i = 0; i < 1000; i++) {
                prompts.promptHistory.push({
                    text: `Very long prompt text that might consume memory ${i.toString().repeat(100)}`,
                    context: { complex: 'data'.repeat(100) },
                    timestamp: Date.now() + i
                });
            }
            
            expect(() => {
                prompts.showContextualPrompt({}, null, null);
            }).not.toThrow();
            
            // Should limit history size
            expect(prompts.promptHistory.length).toBeLessThanOrEqual(50);
        });

        test('should validate prompt database integrity', () => {
            // All categories should have at least one prompt
            expect(prompts.prompts.flying.general.length).toBeGreaterThan(0);
            expect(prompts.prompts.flying.stable.length).toBeGreaterThan(0);
            expect(prompts.prompts.zones['Cave of Shadows'].length).toBeGreaterThan(0);
            expect(prompts.prompts.breathing.inhale.length).toBeGreaterThan(0);
            
            // All prompts should be strings
            Object.values(prompts.prompts.flying).forEach(category => {
                category.forEach(prompt => {
                    expect(typeof prompt).toBe('string');
                    expect(prompt.length).toBeGreaterThan(0);
                });
            });
        });
    });
});