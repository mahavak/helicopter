// jest is globally available
require('../setup.js');
const { AchievementSystem } = require('../../src/systems/AchievementSystem.js');

describe('AchievementSystem', () => {
    let achievementSystem;
    let mockHelicopter;
    let mockZoneManager;
    let mockAudioManager;
    let mockCustomization;

    beforeEach(() => {
        mockHelicopter = {
            velocity: { length: jest.fn(() => 5) },
            position: new THREE.Vector3()
        };
        
        mockZoneManager = {
            activeZone: null
        };
        
        mockAudioManager = {
            playNarration: jest.fn()
        };
        
        mockCustomization = {
            addInsight: jest.fn(),
            getProgress: jest.fn(() => ({
                contemplationLevel: 0,
                insights: [],
                unlockedThemes: 1,
                totalThemes: 6
            }))
        };
        
        achievementSystem = new AchievementSystem(
            mockHelicopter,
            mockZoneManager,
            mockAudioManager,
            mockCustomization
        );
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(achievementSystem.achievements.size).toBeGreaterThan(0);
            expect(achievementSystem.unlockedAchievements.size).toBe(1); // first_flight
            expect(achievementSystem.currentSession.flightTime).toBe(0);
            expect(achievementSystem.currentSession.zonesVisited.size).toBe(0);
            expect(achievementSystem.currentSession.contemplationTime).toBe(0);
        });

        test('should define zone progress tracking', () => {
            expect(achievementSystem.zoneProgress['cave_of_shadows']).toBeDefined();
            expect(achievementSystem.zoneProgress['garden_of_paths']).toBeDefined();
            expect(achievementSystem.zoneProgress['observers_paradox']).toBeDefined();
            expect(achievementSystem.zoneProgress['ship_theseus']).toBeDefined();
        });

        test('should define unlockable content', () => {
            expect(achievementSystem.unlockableContent.zenGarden).toBeDefined();
            expect(achievementSystem.unlockableContent.voidTemple).toBeDefined();
            expect(achievementSystem.unlockableContent.quantumMeditation).toBeDefined();
            expect(achievementSystem.unlockableContent.enlightenmentPeak).toBeDefined();
        });

        test('should unlock first flight achievement immediately', () => {
            expect(achievementSystem.unlockedAchievements.has('first_flight')).toBe(true);
        });
    });

    describe('Achievement Definitions', () => {
        test('should have all required exploration achievements', () => {
            expect(achievementSystem.achievements.has('first_flight')).toBe(true);
            expect(achievementSystem.achievements.has('zone_explorer')).toBe(true);
            expect(achievementSystem.achievements.has('high_flyer')).toBe(true);
        });

        test('should have all contemplation achievements', () => {
            expect(achievementSystem.achievements.has('contemplative_soul')).toBe(true);
            expect(achievementSystem.achievements.has('marathon_meditator')).toBe(true);
            expect(achievementSystem.achievements.has('deep_thinker')).toBe(true);
        });

        test('should have all zone mastery achievements', () => {
            expect(achievementSystem.achievements.has('shadow_dancer')).toBe(true);
            expect(achievementSystem.achievements.has('path_weaver')).toBe(true);
            expect(achievementSystem.achievements.has('quantum_mind')).toBe(true);
            expect(achievementSystem.achievements.has('identity_seeker')).toBe(true);
        });

        test('should have master achievements', () => {
            expect(achievementSystem.achievements.has('master_contemplator')).toBe(true);
            expect(achievementSystem.achievements.has('philosophical_master')).toBe(true);
        });

        test('should have philosophical meanings for all achievements', () => {
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.philosophical).toBeDefined();
                expect(typeof achievement.philosophical).toBe('string');
            });
        });
    });

    describe('Achievement Checking', () => {
        test('should check altitude achievement', () => {
            achievementSystem.currentSession.maxAltitude = 250;
            
            achievementSystem.checkAchievement('high_flyer');
            
            expect(achievementSystem.unlockedAchievements.has('high_flyer')).toBe(true);
        });

        test('should check contemplation time achievement', () => {
            achievementSystem.currentSession.contemplationTime = 350; // > 300 seconds
            
            achievementSystem.checkAchievement('contemplative_soul');
            
            expect(achievementSystem.unlockedAchievements.has('contemplative_soul')).toBe(true);
        });

        test('should check continuous flight achievement', () => {
            achievementSystem.currentSession.continuousFlightTime = 1000; // > 900 seconds
            
            achievementSystem.checkAchievement('marathon_meditator');
            
            expect(achievementSystem.unlockedAchievements.has('marathon_meditator')).toBe(true);
        });

        test('should check zone time achievement', () => {
            achievementSystem.zoneProgress['cave_of_shadows'].timeSpent = 200; // > 180 seconds
            
            achievementSystem.checkAchievement('shadow_dancer');
            
            expect(achievementSystem.unlockedAchievements.has('shadow_dancer')).toBe(true);
        });

        test('should check zone explorer achievement', () => {
            achievementSystem.currentSession.zonesVisited.add('cave_of_shadows');
            achievementSystem.currentSession.zonesVisited.add('garden_of_paths');
            achievementSystem.currentSession.zonesVisited.add('observers_paradox');
            achievementSystem.currentSession.zonesVisited.add('ship_theseus');
            
            achievementSystem.checkAchievement('zone_explorer');
            
            expect(achievementSystem.unlockedAchievements.has('zone_explorer')).toBe(true);
        });

        test('should not unlock already unlocked achievement', () => {
            const initialSize = achievementSystem.unlockedAchievements.size;
            
            achievementSystem.checkAchievement('first_flight'); // Already unlocked
            
            expect(achievementSystem.unlockedAchievements.size).toBe(initialSize);
        });
    });

    describe('Achievement Unlocking', () => {
        test('should unlock achievement correctly', () => {
            const achievement = achievementSystem.achievements.get('high_flyer');
            achievement.unlocked = false; // Reset for test
            
            achievementSystem.unlockAchievement('high_flyer');
            
            expect(achievement.unlocked).toBe(true);
            expect(achievement.unlockedAt).toBeDefined();
            expect(achievementSystem.unlockedAchievements.has('high_flyer')).toBe(true);
        });

        test('should not unlock non-existent achievement', () => {
            expect(() => {
                achievementSystem.unlockAchievement('nonExistentAchievement');
            }).not.toThrow();
        });

        test('should not unlock already unlocked achievement', () => {
            const achievement = achievementSystem.achievements.get('first_flight');
            const originalUnlockedAt = achievement.unlockedAt;
            
            achievementSystem.unlockAchievement('first_flight');
            
            expect(achievement.unlockedAt).toBe(originalUnlockedAt);
        });

        test('should grant insight when unlocking achievement with insight', () => {
            const achievement = achievementSystem.achievements.get('shadow_dancer');
            achievement.unlocked = false; // Reset for test
            
            achievementSystem.unlockAchievement('shadow_dancer');
            
            expect(mockCustomization.addInsight).toHaveBeenCalledWith('cave_shadows_depth');
        });

        test('should unlock content when specified', () => {
            const achievement = achievementSystem.achievements.get('zone_explorer');
            achievement.unlocked = false; // Reset for test
            
            achievementSystem.unlockAchievement('zone_explorer');
            
            expect(achievementSystem.unlockableContent.zenGarden.unlocked).toBe(true);
        });

        test('should play achievement sound', () => {
            achievementSystem.unlockAchievement('high_flyer');
            
            expect(mockAudioManager.playNarration).toHaveBeenCalledWith('achievement_unlock');
        });
    });

    describe('Progress Tracking', () => {
        test('should update flight time correctly', () => {
            const deltaTime = 10; // 10 seconds
            
            achievementSystem.updateFlightTime(deltaTime);
            
            expect(achievementSystem.currentSession.flightTime).toBe(deltaTime);
            expect(achievementSystem.currentSession.continuousFlightTime).toBe(deltaTime);
        });

        test('should update contemplation time for slow flight', () => {
            mockHelicopter.velocity.length.mockReturnValue(5); // Slow speed
            const deltaTime = 10;
            
            achievementSystem.updateFlightTime(deltaTime);
            
            expect(achievementSystem.currentSession.contemplationTime).toBe(deltaTime);
            expect(achievementSystem.currentSession.peacefulMoments).toBe(1);
        });

        test('should not update contemplation time for fast flight', () => {
            mockHelicopter.velocity.length.mockReturnValue(15); // Fast speed
            const deltaTime = 10;
            
            achievementSystem.updateFlightTime(deltaTime);
            
            expect(achievementSystem.currentSession.contemplationTime).toBe(0);
        });

        test('should update maximum altitude', () => {
            achievementSystem.updateAltitude(150);
            expect(achievementSystem.currentSession.maxAltitude).toBe(150);
            
            achievementSystem.updateAltitude(100); // Lower altitude
            expect(achievementSystem.currentSession.maxAltitude).toBe(150); // Should not decrease
            
            achievementSystem.updateAltitude(200); // Higher altitude
            expect(achievementSystem.currentSession.maxAltitude).toBe(200); // Should increase
        });

        test('should update zone visits', () => {
            achievementSystem.updateZoneVisit('Cave of Shadows');
            
            expect(achievementSystem.currentSession.zonesVisited.has('cave_of_shadows')).toBe(true);
            expect(achievementSystem.zoneProgress['cave_of_shadows'].visits).toBe(1);
        });

        test('should update zone time', () => {
            const deltaTime = 10;
            
            achievementSystem.updateZoneTime('Cave of Shadows', deltaTime);
            
            expect(achievementSystem.zoneProgress['cave_of_shadows'].timeSpent).toBe(deltaTime);
        });

        test('should mark deep contemplation after sufficient time', () => {
            achievementSystem.updateZoneTime('Cave of Shadows', 200); // > 180 seconds
            
            expect(achievementSystem.zoneProgress['cave_of_shadows'].deepContemplation).toBe(true);
        });
    });

    describe('Zone Key Mapping', () => {
        test('should map zone names correctly', () => {
            expect(achievementSystem.getZoneKey('Cave of Shadows')).toBe('cave_of_shadows');
            expect(achievementSystem.getZoneKey('Garden of Forking Paths')).toBe('garden_of_paths');
            expect(achievementSystem.getZoneKey("Observer's Paradox")).toBe('observers_paradox');
            expect(achievementSystem.getZoneKey('Ship of Theseus')).toBe('ship_theseus');
        });

        test('should handle unknown zone names', () => {
            expect(achievementSystem.getZoneKey('Unknown Zone')).toBeUndefined();
        });
    });

    describe('Event Handlers', () => {
        test('should handle landing event', () => {
            achievementSystem.currentSession.continuousFlightTime = 100;
            
            achievementSystem.onLanding();
            
            expect(achievementSystem.currentSession.continuousFlightTime).toBe(0);
        });

        test('should handle weather change event', () => {
            achievementSystem.onWeatherChange('digitalStorm');
            
            expect(achievementSystem.currentSession.weatherExperienced.has('digitalStorm')).toBe(true);
            expect(achievementSystem.currentSession.stormFlightTime).toBe(0);
        });

        test('should handle time of day change event', () => {
            achievementSystem.onTimeOfDayChange('dawn');
            
            expect(achievementSystem.currentSession.timesExperienced).toContain('dawn');
        });

        test('should not duplicate time experiences', () => {
            achievementSystem.onTimeOfDayChange('dawn');
            achievementSystem.onTimeOfDayChange('dawn');
            
            expect(achievementSystem.currentSession.timesExperienced.filter(t => t === 'dawn').length).toBe(1);
        });

        test('should handle reality toggle event', () => {
            achievementSystem.onRealityToggle();
            
            expect(achievementSystem.currentSession.realityToggles).toBe(1);
        });
    });

    describe('Main Update Cycle', () => {
        test('should update all tracking metrics', () => {
            const deltaTime = 10;
            const helicopterData = { altitude: 100 };
            const currentZone = 'Cave of Shadows';
            
            achievementSystem.update(deltaTime, helicopterData, currentZone);
            
            expect(achievementSystem.currentSession.flightTime).toBe(deltaTime);
            expect(achievementSystem.currentSession.maxAltitude).toBe(100);
            expect(achievementSystem.zoneProgress['cave_of_shadows'].timeSpent).toBe(deltaTime);
        });

        test('should update weather-specific timers', () => {
            achievementSystem.currentSession.stormFlightTime = 0;
            const deltaTime = 10;
            
            achievementSystem.update(deltaTime, { altitude: 100 }, null);
            
            expect(achievementSystem.currentSession.stormFlightTime).toBe(deltaTime);
        });

        test('should handle update without current zone', () => {
            expect(() => {
                achievementSystem.update(10, { altitude: 100 }, null);
            }).not.toThrow();
        });
    });

    describe('Progress Persistence', () => {
        test('should save progress to localStorage', () => {
            achievementSystem.unlockAchievement('high_flyer');
            achievementSystem.saveProgress();
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'matrixhelicopter_achievements',
                expect.any(String)
            );
        });

        test('should load progress from localStorage', () => {
            const mockProgress = {
                unlockedAchievements: ['first_flight', 'high_flyer'],
                achievementData: [],
                zoneProgress: {
                    'cave_of_shadows': { timeSpent: 100, visits: 1, deepContemplation: false }
                },
                unlockedContent: {},
                totalStats: { totalFlightTime: 1000 }
            };
            
            localStorage.getItem.mockReturnValue(JSON.stringify(mockProgress));
            
            achievementSystem.loadProgress();
            
            expect(achievementSystem.unlockedAchievements.has('high_flyer')).toBe(true);
            expect(achievementSystem.zoneProgress['cave_of_shadows'].timeSpent).toBe(100);
        });

        test('should handle missing localStorage data', () => {
            localStorage.getItem.mockReturnValue(null);
            
            expect(() => {
                achievementSystem.loadProgress();
            }).not.toThrow();
        });

        test('should handle corrupted localStorage data', () => {
            localStorage.getItem.mockReturnValue('invalid json');
            
            expect(() => {
                achievementSystem.loadProgress();
            }).not.toThrow();
        });
    });

    describe('Public Interface', () => {
        test('should get progress correctly', () => {
            achievementSystem.unlockAchievement('high_flyer');
            achievementSystem.unlockableContent.zenGarden.unlocked = true;
            
            const progress = achievementSystem.getProgress();
            
            expect(progress.totalAchievements).toBeGreaterThan(0);
            expect(progress.unlockedAchievements).toBeGreaterThan(1);
            expect(progress.currentSession).toBeDefined();
            expect(progress.unlockedContent).toContain('zenGarden');
        });

        test('should get achievements list correctly', () => {
            const achievements = achievementSystem.getAchievementsList();
            
            expect(Array.isArray(achievements)).toBe(true);
            expect(achievements.length).toBeGreaterThan(0);
            
            achievements.forEach(achievement => {
                expect(achievement.category).toBeDefined();
                expect(typeof achievement.unlocked).toBe('boolean');
            });
        });

        test('should get unlocked content correctly', () => {
            achievementSystem.unlockableContent.zenGarden.unlocked = true;
            achievementSystem.unlockableContent.voidTemple.unlocked = true;
            
            const unlockedContent = achievementSystem.getUnlockedContent();
            
            expect(unlockedContent.length).toBe(2);
            expect(unlockedContent.some(content => content.name === 'zenGarden')).toBe(true);
            expect(unlockedContent.some(content => content.name === 'voidTemple')).toBe(true);
        });
    });

    describe('Custom Achievement Requirements', () => {
        test('should check custom requirements correctly', () => {
            // Mock the requirements for testing
            achievementSystem.currentSession.stormFlightTime = 70;
            achievementSystem.currentSession.timesExperienced = ['dawn', 'dusk'];
            achievementSystem.currentSession.snowFlightTime = 130;
            
            expect(achievementSystem.checkStormRiding()).toBe(true);
            expect(achievementSystem.checkTimeExperience()).toBe(true);
            expect(achievementSystem.checkSnowExperience()).toBe(true);
        });

        test('should fail custom requirements when not met', () => {
            // No storm flight time
            expect(achievementSystem.checkStormRiding()).toBe(false);
            
            // Missing time experiences
            achievementSystem.currentSession.timesExperienced = ['dawn']; // Missing dusk
            expect(achievementSystem.checkTimeExperience()).toBe(false);
            
            // No snow flight time
            expect(achievementSystem.checkSnowExperience()).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('should handle very large delta times', () => {
            expect(() => {
                achievementSystem.update(10000, { altitude: 100 }, null);
            }).not.toThrow();
        });

        test('should handle zero delta time', () => {
            expect(() => {
                achievementSystem.update(0, { altitude: 100 }, null);
            }).not.toThrow();
        });

        test('should handle missing helicopter data', () => {
            expect(() => {
                achievementSystem.update(10, null, null);
            }).toThrow();
        });

        test('should handle missing audio manager', () => {
            const systemWithoutAudio = new AchievementSystem(
                mockHelicopter, mockZoneManager, null, mockCustomization
            );
            
            expect(() => {
                systemWithoutAudio.unlockAchievement('high_flyer');
            }).not.toThrow();
        });
    });
});