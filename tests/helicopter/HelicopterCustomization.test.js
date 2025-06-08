// jest is globally available
require('../setup.js');
const { HelicopterCustomization } = require('../../src/helicopter/HelicopterCustomization.js');

describe('HelicopterCustomization', () => {
    let customization;
    let mockHelicopter;

    beforeEach(() => {
        mockHelicopter = {
            helicopter: new THREE.Group(),
            fuselage: new THREE.Mesh(),
            glow: new THREE.Mesh(),
            scene: new THREE.Scene()
        };
        
        // Add some mock children to helicopter group
        mockHelicopter.helicopter.children = [
            mockHelicopter.fuselage,
            mockHelicopter.glow,
            { material: { color: { setHex: jest.fn() } }, userData: { isRotor: true } },
            { material: { color: { setHex: jest.fn() } }, userData: { isSkid: true } },
            { type: 'PointLight', color: { setHex: jest.fn() } }
        ];
        
        customization = new HelicopterCustomization(mockHelicopter);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(customization.currentTheme).toBe('default');
            expect(customization.insights).toBeDefined();
            expect(customization.contemplationLevel).toBe(0);
            expect(customization.enlightenmentProgress).toBe(0);
        });

        test('should define all themes correctly', () => {
            expect(customization.themes.default).toBeDefined();
            expect(customization.themes.shadowWalker).toBeDefined();
            expect(customization.themes.pathWeaver).toBeDefined();
            expect(customization.themes.quantumObserver).toBeDefined();
            expect(customization.themes.identitySeeker).toBeDefined();
            expect(customization.themes.enlightenedOne).toBeDefined();
        });

        test('should have default theme unlocked', () => {
            expect(customization.themes.default.unlocked).toBe(true);
        });

        test('should have other themes locked initially', () => {
            expect(customization.themes.shadowWalker.unlocked).toBe(false);
            expect(customization.themes.pathWeaver.unlocked).toBe(false);
            expect(customization.themes.quantumObserver.unlocked).toBe(false);
            expect(customization.themes.identitySeeker.unlocked).toBe(false);
            expect(customization.themes.enlightenedOne.unlocked).toBe(false);
        });

        test('should define effect definitions', () => {
            expect(customization.effectDefinitions.shadowTrail).toBeDefined();
            expect(customization.effectDefinitions.realityShimmer).toBeDefined();
            expect(customization.effectDefinitions.possibilityTrails).toBeDefined();
            expect(customization.effectDefinitions.quantumFlicker).toBeDefined();
            expect(customization.effectDefinitions.pureLight).toBeDefined();
        });

        test('should apply default theme on initialization', () => {
            expect(customization.currentTheme).toBe('default');
        });
    });

    describe('Theme Application', () => {
        test('should apply available theme successfully', () => {
            const result = customization.applyTheme('default');
            
            expect(result).toBe(true);
            expect(customization.currentTheme).toBe('default');
        });

        test('should fail to apply locked theme', () => {
            const result = customization.applyTheme('shadowWalker');
            
            expect(result).toBe(false);
            expect(customization.currentTheme).toBe('default');
        });

        test('should fail to apply non-existent theme', () => {
            const result = customization.applyTheme('nonExistentTheme');
            
            expect(result).toBe(false);
            expect(customization.currentTheme).toBe('default');
        });

        test('should update helicopter colors when applying theme', () => {
            customization.applyTheme('default');
            
            expect(mockHelicopter.fuselage.material.color.setHex).toHaveBeenCalled();
            expect(mockHelicopter.glow.material.color.setHex).toHaveBeenCalled();
        });

        test('should clear old effects when applying new theme', () => {
            // Apply a theme with effects first
            customization.themes.shadowWalker.unlocked = true;
            customization.applyTheme('shadowWalker');
            
            const initialEffectCount = customization.activeEffects.size;
            
            customization.applyTheme('default');
            
            expect(customization.activeEffects.size).toBe(0);
        });
    });

    describe('Color Updates', () => {
        test('should update helicopter colors correctly', () => {
            const colors = {
                primary: 0xff0000,
                secondary: 0x00ff00,
                accent: 0x0000ff
            };
            
            customization.updateHelicopterColors(colors);
            
            expect(mockHelicopter.fuselage.material.color.setHex).toHaveBeenCalledWith(colors.primary);
            expect(mockHelicopter.glow.material.color.setHex).toHaveBeenCalledWith(colors.accent);
        });

        test('should handle missing material gracefully', () => {
            mockHelicopter.helicopter.children.push({ material: null });
            
            const colors = { primary: 0xff0000, secondary: 0x00ff00, accent: 0x0000ff };
            
            expect(() => {
                customization.updateHelicopterColors(colors);
            }).not.toThrow();
        });
    });

    describe('Effect Management', () => {
        test('should apply effect correctly', () => {
            customization.applyEffect('shadowTrail');
            
            expect(customization.activeEffects.has('shadowTrail')).toBe(true);
        });

        test('should not apply same effect twice', () => {
            customization.applyEffect('shadowTrail');
            const effectCount = customization.activeEffects.size;
            
            customization.applyEffect('shadowTrail');
            
            expect(customization.activeEffects.size).toBe(effectCount);
        });

        test('should remove effect correctly', () => {
            customization.applyEffect('shadowTrail');
            expect(customization.activeEffects.has('shadowTrail')).toBe(true);
            
            customization.removeEffect('shadowTrail');
            
            expect(customization.activeEffects.has('shadowTrail')).toBe(false);
        });

        test('should handle removing non-existent effect', () => {
            expect(() => {
                customization.removeEffect('nonExistentEffect');
            }).not.toThrow();
        });

        test('should clear all active effects', () => {
            customization.applyEffect('shadowTrail');
            customization.applyEffect('realityShimmer');
            
            customization.clearActiveEffects();
            
            expect(customization.activeEffects.size).toBe(0);
        });
    });

    describe('Effect Creation', () => {
        test('should create shadow trail effect', () => {
            const effect = customization.createShadowTrailEffect();
            
            expect(effect).toBeDefined();
            expect(effect.name).toBe('shadowTrail');
            expect(effect.objects).toBeDefined();
            expect(effect.update).toBeDefined();
        });

        test('should create reality shimmer effect', () => {
            const effect = customization.createRealityShimmerEffect();
            
            expect(effect).toBeDefined();
            expect(effect.name).toBe('realityShimmer');
            expect(effect.update).toBeDefined();
        });

        test('should create possibility trails effect', () => {
            const effect = customization.createPossibilityTrailsEffect();
            
            expect(effect).toBeDefined();
            expect(effect.name).toBe('possibilityTrails');
            expect(effect.trails).toBeDefined();
        });

        test('should create quantum flicker effect', () => {
            const effect = customization.createQuantumFlickerEffect();
            
            expect(effect).toBeDefined();
            expect(effect.name).toBe('quantumFlicker');
        });

        test('should create pure light effect', () => {
            const effect = customization.createPureLightEffect();
            
            expect(effect).toBeDefined();
            expect(effect.name).toBe('pureLight');
        });
    });

    describe('Insight System', () => {
        test('should add insight correctly', () => {
            customization.addInsight('cave_shadows_depth');
            
            expect(customization.insights.has('cave_shadows_depth')).toBe(true);
            expect(customization.contemplationLevel).toBe(1);
        });

        test('should not add duplicate insights', () => {
            customization.addInsight('cave_shadows_depth');
            customization.addInsight('cave_shadows_depth');
            
            expect(customization.contemplationLevel).toBe(1);
        });

        test('should unlock themes when gaining insights', () => {
            customization.addInsight('cave_shadows_depth');
            
            expect(customization.themes.shadowWalker.unlocked).toBe(true);
        });

        test('should unlock enlightened theme with enough insights', () => {
            // Add many insights to reach enlightenment
            for (let i = 0; i < 10; i++) {
                customization.addInsight(`insight_${i}`);
            }
            
            expect(customization.themes.enlightenedOne.unlocked).toBe(true);
        });
    });

    describe('Theme Unlocking', () => {
        test('should unlock theme correctly', () => {
            customization.unlockTheme('shadowWalker');
            
            expect(customization.themes.shadowWalker.unlocked).toBe(true);
        });

        test('should not unlock already unlocked theme', () => {
            customization.themes.shadowWalker.unlocked = true;
            
            // Should not throw or cause issues
            expect(() => {
                customization.unlockTheme('shadowWalker');
            }).not.toThrow();
        });

        test('should handle unlocking non-existent theme', () => {
            expect(() => {
                customization.unlockTheme('nonExistentTheme');
            }).not.toThrow();
        });

        test('should check theme unlocks when adding insights', () => {
            customization.addInsight('garden_choice_master');
            
            expect(customization.themes.pathWeaver.unlocked).toBe(true);
        });
    });

    describe('Progress Persistence', () => {
        test('should save progress to localStorage', () => {
            customization.addInsight('cave_shadows_depth');
            customization.saveProgress();
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'matrixhelicopter_customization',
                expect.any(String)
            );
        });

        test('should load progress from localStorage', () => {
            const mockProgress = {
                currentTheme: 'shadowWalker',
                insights: ['cave_shadows_depth'],
                contemplationLevel: 1,
                unlockedThemes: ['default', 'shadowWalker']
            };
            
            localStorage.getItem.mockReturnValue(JSON.stringify(mockProgress));
            
            customization.loadProgress();
            
            expect(customization.insights.has('cave_shadows_depth')).toBe(true);
            expect(customization.contemplationLevel).toBe(1);
            expect(customization.themes.shadowWalker.unlocked).toBe(true);
        });

        test('should handle missing localStorage data', () => {
            localStorage.getItem.mockReturnValue(null);
            
            expect(() => {
                customization.loadProgress();
            }).not.toThrow();
        });

        test('should handle corrupted localStorage data', () => {
            localStorage.getItem.mockReturnValue('invalid json');
            
            expect(() => {
                customization.loadProgress();
            }).not.toThrow();
        });
    });

    describe('Update Cycle', () => {
        test('should update all active effects', () => {
            const mockEffect = {
                update: jest.fn()
            };
            
            customization.activeEffects.set('testEffect', mockEffect);
            
            customization.update(0.016);
            
            expect(mockEffect.update).toHaveBeenCalledWith(0.016);
        });

        test('should handle effects without update method', () => {
            const mockEffect = {
                name: 'testEffect'
                // No update method
            };
            
            customization.activeEffects.set('testEffect', mockEffect);
            
            expect(() => {
                customization.update(0.016);
            }).not.toThrow();
        });

        test('should handle empty active effects', () => {
            expect(() => {
                customization.update(0.016);
            }).not.toThrow();
        });
    });

    describe('Public Interface', () => {
        test('should get available themes correctly', () => {
            customization.themes.shadowWalker.unlocked = true;
            
            const availableThemes = customization.getAvailableThemes();
            
            expect(availableThemes.length).toBe(2); // default + shadowWalker
            expect(availableThemes.some(theme => theme.name === 'default')).toBe(true);
            expect(availableThemes.some(theme => theme.name === 'shadowWalker')).toBe(true);
        });

        test('should get current theme correctly', () => {
            const currentTheme = customization.getCurrentTheme();
            
            expect(currentTheme.name).toBe('default');
            expect(currentTheme.colors).toBeDefined();
            expect(currentTheme.unlocked).toBe(true);
        });

        test('should get progress correctly', () => {
            customization.addInsight('test_insight');
            customization.unlockTheme('shadowWalker');
            
            const progress = customization.getProgress();
            
            expect(progress.insights).toContain('test_insight');
            expect(progress.contemplationLevel).toBe(1);
            expect(progress.unlockedThemes).toBe(2);
            expect(progress.totalThemes).toBe(6);
        });
    });

    describe('Edge Cases', () => {
        test('should handle very large delta time in update', () => {
            expect(() => {
                customization.update(10000);
            }).not.toThrow();
        });

        test('should handle zero delta time in update', () => {
            expect(() => {
                customization.update(0);
            }).not.toThrow();
        });

        test('should handle missing helicopter components', () => {
            const customizationWithMissingHelicopter = new HelicopterCustomization({
                helicopter: { children: [] },
                scene: new THREE.Scene()
            });
            
            expect(() => {
                customizationWithMissingHelicopter.updateHelicopterColors({
                    primary: 0xff0000,
                    secondary: 0x00ff00,
                    accent: 0x0000ff
                });
            }).not.toThrow();
        });
    });

    describe('Effect Update Functions', () => {
        test('should update shadow trail effect without errors', () => {
            const effect = customization.createShadowTrailEffect();
            
            expect(() => {
                effect.update(0.016);
            }).not.toThrow();
        });

        test('should update reality shimmer effect without errors', () => {
            const effect = customization.createRealityShimmerEffect();
            
            expect(() => {
                effect.update(0.016);
            }).not.toThrow();
        });

        test('should update possibility trails effect without errors', () => {
            const effect = customization.createPossibilityTrailsEffect();
            
            // Mock helicopter velocity
            customization.helicopter.velocity = { length: jest.fn(() => 0.5) };
            
            expect(() => {
                effect.update(0.016);
            }).not.toThrow();
        });
    });
});