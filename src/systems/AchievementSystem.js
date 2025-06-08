import * as THREE from 'three';

export class AchievementSystem {
    constructor(helicopter, zoneManager, audioManager, customization) {
        this.helicopter = helicopter;
        this.zoneManager = zoneManager;
        this.audioManager = audioManager;
        this.customization = customization;
        
        // Achievement tracking
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.currentSession = {
            flightTime: 0,
            zonesVisited: new Set(),
            contemplationTime: 0,
            insights: 0,
            continuousFlightTime: 0,
            maxAltitude: 0,
            totalDistance: 0,
            peacefulMoments: 0
        };
        
        // Zone-specific tracking
        this.zoneProgress = {
            'cave_of_shadows': { timeSpent: 0, visits: 0, deepContemplation: false },
            'garden_of_paths': { timeSpent: 0, visits: 0, deepContemplation: false },
            'observers_paradox': { timeSpent: 0, visits: 0, deepContemplation: false },
            'ship_theseus': { timeSpent: 0, visits: 0, deepContemplation: false }
        };
        
        // Unlockable areas and features
        this.unlockableContent = {
            zenGarden: { unlocked: false, requirement: 'master_contemplator' },
            voidTemple: { unlocked: false, requirement: 'reality_questioner' },
            quantumMeditation: { unlocked: false, requirement: 'consciousness_explorer' },
            enlightenmentPeak: { unlocked: false, requirement: 'philosophical_master' },
            nightMode: { unlocked: false, requirement: 'twilight_wanderer' },
            stormRiding: { unlocked: false, requirement: 'chaos_navigator' }
        };
        
        this.initializeAchievements();
        this.loadProgress();
    }
    
    initializeAchievements() {
        // Exploration Achievements
        this.addAchievement('first_flight', {
            name: 'Digital Awakening',
            description: 'Take your first flight in the Matrix',
            category: 'exploration',
            icon: '🚁',
            philosophical: 'Every journey begins with a single step... or rotor blade.',
            trigger: 'immediate',
            unlocks: []
        });
        
        this.addAchievement('zone_explorer', {
            name: 'Philosophical Wanderer',
            description: 'Visit all four philosophical zones',
            category: 'exploration',
            icon: '🌀',
            philosophical: 'To understand the whole, one must explore each part.',
            trigger: 'custom',
            requirement: () => this.currentSession.zonesVisited.size >= 4,
            unlocks: ['zenGarden']
        });
        
        this.addAchievement('high_flyer', {
            name: 'Reaching for Truth',
            description: 'Reach an altitude of 200 meters',
            category: 'exploration',
            icon: '⬆️',
            philosophical: 'Sometimes we must rise above to see clearly.',
            trigger: 'altitude',
            threshold: 200,
            unlocks: []
        });
        
        // Time and Contemplation Achievements
        this.addAchievement('contemplative_soul', {
            name: 'Contemplative Soul',
            description: 'Spend 5 minutes in peaceful flight',
            category: 'contemplation',
            icon: '🧘',
            philosophical: 'In stillness, we find movement. In silence, we hear truth.',
            trigger: 'contemplation_time',
            threshold: 300, // 5 minutes
            unlocks: []
        });
        
        this.addAchievement('marathon_meditator', {
            name: 'Marathon Meditator',
            description: 'Maintain continuous flight for 15 minutes',
            category: 'contemplation',
            icon: '⏰',
            philosophical: 'Persistence reveals what haste obscures.',
            trigger: 'continuous_flight',
            threshold: 900, // 15 minutes
            unlocks: ['quantumMeditation']
        });
        
        this.addAchievement('deep_thinker', {
            name: 'Deep Thinker',
            description: 'Achieve deep contemplation in each zone',
            category: 'contemplation',
            icon: '🤔',
            philosophical: 'Depth of thought surpasses breadth of knowledge.',
            trigger: 'custom',
            requirement: () => Object.values(this.zoneProgress).every(zone => zone.deepContemplation),
            unlocks: ['voidTemple']
        });
        
        // Zone-Specific Achievements
        this.addAchievement('shadow_dancer', {
            name: 'Shadow Dancer',
            description: 'Spend 3 minutes contemplating in the Cave of Shadows',
            category: 'zone_mastery',
            icon: '👤',
            philosophical: 'In facing our shadows, we discover our light.',
            trigger: 'zone_time',
            zone: 'cave_of_shadows',
            threshold: 180,
            unlocks: [],
            insight: 'cave_shadows_depth'
        });
        
        this.addAchievement('path_weaver', {
            name: 'Path Weaver',
            description: 'Understand the nature of choice in the Garden',
            category: 'zone_mastery',
            icon: '🌿',
            philosophical: 'Every choice creates and destroys infinite possibilities.',
            trigger: 'zone_time',
            zone: 'garden_of_paths',
            threshold: 180,
            unlocks: [],
            insight: 'garden_choice_master'
        });
        
        this.addAchievement('quantum_mind', {
            name: 'Quantum Mind',
            description: 'Grasp consciousness in the Observer\'s Paradox',
            category: 'zone_mastery',
            icon: '👁️',
            philosophical: 'The observer changes the observed, and is changed in return.',
            trigger: 'zone_time',
            zone: 'observers_paradox',
            threshold: 180,
            unlocks: [],
            insight: 'observer_consciousness'
        });
        
        this.addAchievement('identity_seeker', {
            name: 'Identity Seeker',
            description: 'Question continuity at the Ship of Theseus',
            category: 'zone_mastery',
            icon: '🚢',
            philosophical: 'If all parts change, what remains? If nothing changes, what grows?',
            trigger: 'zone_time',
            zone: 'ship_theseus',
            threshold: 180,
            unlocks: [],
            insight: 'theseus_identity'
        });
        
        // Weather and Time Achievements
        this.addAchievement('storm_rider', {
            name: 'Storm Rider',
            description: 'Fly peacefully through a digital storm',
            category: 'mastery',
            icon: '⛈️',
            philosophical: 'In chaos, the wise find calm.',
            trigger: 'custom',
            requirement: () => this.checkStormRiding(),
            unlocks: ['stormRiding']
        });
        
        this.addAchievement('twilight_wanderer', {
            name: 'Twilight Wanderer',
            description: 'Experience dawn and dusk in the Matrix',
            category: 'temporal',
            icon: '🌅',
            philosophical: 'Transitions reveal truths that stability conceals.',
            trigger: 'custom',
            requirement: () => this.checkTimeExperience(),
            unlocks: ['nightMode']
        });
        
        this.addAchievement('snow_walker', {
            name: 'Code Snow Walker',
            description: 'Find peace in the digital snowfall',
            category: 'weather',
            icon: '❄️',
            philosophical: 'Each flake unique, yet all return to the same source.',
            trigger: 'custom',
            requirement: () => this.checkSnowExperience(),
            unlocks: []
        });
        
        // Master Achievements
        this.addAchievement('master_contemplator', {
            name: 'Master Contemplator',
            description: 'Unlock the deepest insights across all zones',
            category: 'mastery',
            icon: '🎯',
            philosophical: 'Mastery is not knowing everything, but understanding one thing completely.',
            trigger: 'custom',
            requirement: () => this.customization.getProgress().contemplationLevel >= 10,
            unlocks: ['zenGarden']
        });
        
        this.addAchievement('reality_questioner', {
            name: 'Reality Questioner',
            description: 'Question the nature of reality itself',
            category: 'philosophy',
            icon: '❓',
            philosophical: 'The question is not "What is real?" but "What is reality worth?"',
            trigger: 'custom',
            requirement: () => this.checkRealityQuestioning(),
            unlocks: ['voidTemple']
        });
        
        this.addAchievement('consciousness_explorer', {
            name: 'Consciousness Explorer',
            description: 'Explore the depths of awareness',
            category: 'philosophy',
            icon: '🧠',
            philosophical: 'Consciousness is the only reality we can be certain of.',
            trigger: 'custom',
            requirement: () => this.checkConsciousnessExploration(),
            unlocks: ['quantumMeditation']
        });
        
        this.addAchievement('philosophical_master', {
            name: 'Philosophical Master',
            description: 'Achieve enlightenment through contemplation',
            category: 'mastery',
            icon: '🌟',
            philosophical: 'Enlightenment is not a destination, but a way of traveling.',
            trigger: 'custom',
            requirement: () => this.unlockedAchievements.size >= 15,
            unlocks: ['enlightenmentPeak'],
            insight: 'full_enlightenment'
        });
        
        // Trigger immediate achievement
        this.checkAchievement('first_flight');
    }
    
    addAchievement(id, config) {
        this.achievements.set(id, {
            id,
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            ...config
        });
    }
    
    checkAchievement(achievementId, value = null) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.unlocked) return;
        
        let shouldUnlock = false;
        
        switch (achievement.trigger) {
            case 'immediate':
                shouldUnlock = true;
                break;
                
            case 'altitude':
                shouldUnlock = this.currentSession.maxAltitude >= achievement.threshold;
                break;
                
            case 'contemplation_time':
                shouldUnlock = this.currentSession.contemplationTime >= achievement.threshold;
                break;
                
            case 'continuous_flight':
                shouldUnlock = this.currentSession.continuousFlightTime >= achievement.threshold;
                break;
                
            case 'zone_time':
                const zoneProgress = this.zoneProgress[achievement.zone];
                shouldUnlock = zoneProgress && zoneProgress.timeSpent >= achievement.threshold;
                break;
                
            case 'custom':
                shouldUnlock = achievement.requirement && achievement.requirement();
                break;
        }
        
        if (shouldUnlock) {
            this.unlockAchievement(achievementId);
        }
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.unlocked) return;
        
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        this.unlockedAchievements.add(achievementId);
        
        console.log(`🏆 [ACHIEVEMENT] ${achievement.name}: ${achievement.description}`);
        console.log(`📖 ${achievement.philosophical}`);
        
        // Grant insight if specified
        if (achievement.insight) {
            this.customization.addInsight(achievement.insight);
        }
        
        // Unlock content
        achievement.unlocks.forEach(contentId => {
            this.unlockContent(contentId);
        });
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        // Play achievement sound
        if (this.audioManager) {
            this.audioManager.playNarration('achievement_unlock');
        }
        
        this.saveProgress();
    }
    
    unlockContent(contentId) {
        const content = this.unlockableContent[contentId];
        if (content && !content.unlocked) {
            content.unlocked = true;
            console.log(`🔓 [UNLOCK] New area available: ${contentId}`);
            
            // This would create new zones or features in the actual game
            this.showContentUnlockNotification(contentId);
        }
    }
    
    showAchievementNotification(achievement) {
        // This would show a UI notification
        console.log(`
╔══════════════════════════════════════╗
║           ACHIEVEMENT UNLOCKED        ║
║                                      ║
║ ${achievement.icon} ${achievement.name.padEnd(30)} ║
║                                      ║
║ ${achievement.description.padEnd(36)} ║
║                                      ║
║ "${achievement.philosophical}"
║                                      ║
╚══════════════════════════════════════╝
        `);
    }
    
    showContentUnlockNotification(contentId) {
        console.log(`🗝️ [NEW AREA] ${contentId} is now accessible!`);
    }
    
    // Progress tracking methods
    updateFlightTime(deltaTime) {
        this.currentSession.flightTime += deltaTime;
        this.currentSession.continuousFlightTime += deltaTime;
        
        // Check if currently in peaceful flight
        const velocity = this.helicopter.velocity.length();
        if (velocity < 10) { // Slow, contemplative flight
            this.currentSession.contemplationTime += deltaTime;
            this.currentSession.peacefulMoments++;
            
            this.checkAchievement('contemplative_soul');
        }
        
        this.checkAchievement('marathon_meditator');
    }
    
    updateAltitude(altitude) {
        if (altitude > this.currentSession.maxAltitude) {
            this.currentSession.maxAltitude = altitude;
            this.checkAchievement('high_flyer');
        }
    }
    
    updateZoneVisit(zoneName) {
        const zoneKey = this.getZoneKey(zoneName);
        if (zoneKey) {
            this.currentSession.zonesVisited.add(zoneKey);
            
            if (!this.zoneProgress[zoneKey]) {
                this.zoneProgress[zoneKey] = { timeSpent: 0, visits: 0, deepContemplation: false };
            }
            
            this.zoneProgress[zoneKey].visits++;
            
            this.checkAchievement('zone_explorer');
        }
    }
    
    updateZoneTime(zoneName, deltaTime) {
        const zoneKey = this.getZoneKey(zoneName);
        if (zoneKey && this.zoneProgress[zoneKey]) {
            this.zoneProgress[zoneKey].timeSpent += deltaTime;
            
            // Check for deep contemplation (3+ minutes)
            if (this.zoneProgress[zoneKey].timeSpent >= 180) {
                this.zoneProgress[zoneKey].deepContemplation = true;
            }
            
            // Check zone-specific achievements
            this.checkZoneAchievements(zoneKey);
            this.checkAchievement('deep_thinker');
        }
    }
    
    checkZoneAchievements(zoneKey) {
        const zoneAchievements = {
            'cave_of_shadows': 'shadow_dancer',
            'garden_of_paths': 'path_weaver',
            'observers_paradox': 'quantum_mind',
            'ship_theseus': 'identity_seeker'
        };
        
        const achievementId = zoneAchievements[zoneKey];
        if (achievementId) {
            this.checkAchievement(achievementId);
        }
    }
    
    getZoneKey(zoneName) {
        const zoneMap = {
            'Cave of Shadows': 'cave_of_shadows',
            'Garden of Forking Paths': 'garden_of_paths',
            "Observer's Paradox": 'observers_paradox',
            'Ship of Theseus': 'ship_theseus'
        };
        return zoneMap[zoneName];
    }
    
    // Custom requirement checkers
    checkStormRiding() {
        // Check if player has flown calmly through a storm
        // This would be tracked during weather system updates
        return this.currentSession.stormFlightTime > 60; // 1 minute in storm
    }
    
    checkTimeExperience() {
        // Check if player has experienced different times of day
        return this.currentSession.timesExperienced && 
               this.currentSession.timesExperienced.includes('dawn') &&
               this.currentSession.timesExperienced.includes('dusk');
    }
    
    checkSnowExperience() {
        // Check if player has flown peacefully in code snow
        return this.currentSession.snowFlightTime > 120; // 2 minutes in snow
    }
    
    checkRealityQuestioning() {
        // Check if player has engaged with reality-questioning mechanics
        return this.currentSession.realityToggles > 10 || 
               this.zoneProgress['cave_of_shadows']?.deepContemplation;
    }
    
    checkConsciousnessExploration() {
        // Check if player has deeply explored consciousness themes
        return this.zoneProgress['observers_paradox']?.deepContemplation &&
               this.currentSession.contemplationTime > 600; // 10 minutes total
    }
    
    // Event handlers
    onLanding() {
        // Reset continuous flight time on landing
        this.currentSession.continuousFlightTime = 0;
    }
    
    onWeatherChange(weatherType) {
        // Track weather-related progress
        if (!this.currentSession.weatherExperienced) {
            this.currentSession.weatherExperienced = new Set();
        }
        this.currentSession.weatherExperienced.add(weatherType);
        
        if (weatherType === 'digitalStorm') {
            this.currentSession.stormFlightTime = 0; // Start tracking
        } else if (weatherType === 'codeSnow') {
            this.currentSession.snowFlightTime = 0; // Start tracking
        }
    }
    
    onTimeOfDayChange(timePhase) {
        if (!this.currentSession.timesExperienced) {
            this.currentSession.timesExperienced = [];
        }
        
        if (!this.currentSession.timesExperienced.includes(timePhase)) {
            this.currentSession.timesExperienced.push(timePhase);
            this.checkAchievement('twilight_wanderer');
        }
    }
    
    onRealityToggle() {
        if (!this.currentSession.realityToggles) {
            this.currentSession.realityToggles = 0;
        }
        this.currentSession.realityToggles++;
    }
    
    // Progress persistence
    saveProgress() {
        const progressData = {
            unlockedAchievements: Array.from(this.unlockedAchievements),
            achievementData: Array.from(this.achievements.entries()),
            zoneProgress: this.zoneProgress,
            unlockedContent: this.unlockableContent,
            totalStats: {
                totalFlightTime: (this.totalStats?.totalFlightTime || 0) + this.currentSession.flightTime,
                totalContemplationTime: (this.totalStats?.totalContemplationTime || 0) + this.currentSession.contemplationTime,
                maxAltitudeEver: Math.max(this.totalStats?.maxAltitudeEver || 0, this.currentSession.maxAltitude)
            }
        };
        
        localStorage.setItem('matrixhelicopter_achievements', JSON.stringify(progressData));
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('matrixhelicopter_achievements');
            if (saved) {
                const progressData = JSON.parse(saved);
                
                this.unlockedAchievements = new Set(progressData.unlockedAchievements || []);
                this.zoneProgress = { ...this.zoneProgress, ...progressData.zoneProgress };
                this.unlockableContent = { ...this.unlockableContent, ...progressData.unlockedContent };
                this.totalStats = progressData.totalStats || {};
                
                // Restore achievement states
                if (progressData.achievementData) {
                    progressData.achievementData.forEach(([id, data]) => {
                        if (this.achievements.has(id)) {
                            this.achievements.set(id, { ...this.achievements.get(id), ...data });
                        }
                    });
                }
            }
        } catch (error) {
            console.warn('[ACHIEVEMENTS] Could not load progress:', error);
        }
    }
    
    // Main update method
    update(deltaTime, helicopterData, currentZone) {
        this.updateFlightTime(deltaTime);
        this.updateAltitude(helicopterData.altitude);
        
        if (currentZone) {
            this.updateZoneTime(currentZone, deltaTime);
        }
        
        // Update weather-specific timers
        if (this.currentSession.stormFlightTime !== undefined) {
            this.currentSession.stormFlightTime += deltaTime;
            this.checkAchievement('storm_rider');
        }
        
        if (this.currentSession.snowFlightTime !== undefined) {
            this.currentSession.snowFlightTime += deltaTime;
            this.checkAchievement('snow_walker');
        }
        
        // Check custom achievements periodically
        if (Math.random() > 0.995) { // Every ~2 seconds on average
            this.checkCustomAchievements();
        }
    }
    
    checkCustomAchievements() {
        const customAchievements = [
            'master_contemplator',
            'reality_questioner', 
            'consciousness_explorer',
            'philosophical_master'
        ];
        
        customAchievements.forEach(id => this.checkAchievement(id));
    }
    
    // Public interface
    getProgress() {
        return {
            totalAchievements: this.achievements.size,
            unlockedAchievements: this.unlockedAchievements.size,
            currentSession: { ...this.currentSession },
            unlockedContent: Object.entries(this.unlockableContent)
                .filter(([_, content]) => content.unlocked)
                .map(([name, _]) => name)
        };
    }
    
    getAchievementsList() {
        return Array.from(this.achievements.values()).map(achievement => ({
            ...achievement,
            category: achievement.category,
            unlocked: achievement.unlocked
        }));
    }
    
    getUnlockedContent() {
        return Object.entries(this.unlockableContent)
            .filter(([_, content]) => content.unlocked)
            .map(([name, content]) => ({ name, ...content }));
    }
}