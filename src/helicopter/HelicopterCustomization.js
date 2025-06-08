import * as THREE from 'three';

export class HelicopterCustomization {
    constructor(helicopter) {
        this.helicopter = helicopter;
        
        // Customization state
        this.currentTheme = 'default';
        this.insights = new Set();
        this.contemplationLevel = 0;
        this.enlightenmentProgress = 0;
        
        // Available themes unlocked through philosophical insights
        this.themes = {
            default: {
                name: 'Digital Wanderer',
                colors: { primary: 0x003300, secondary: 0x001100, accent: 0x00ff00 },
                effects: [],
                unlocked: true,
                description: 'The beginning of the journey'
            },
            shadowWalker: {
                name: 'Shadow Walker',
                colors: { primary: 0x220000, secondary: 0x110000, accent: 0x440000 },
                effects: ['shadowTrail', 'realityShimmer'],
                unlocked: false,
                description: 'Unlocked by understanding the Cave of Shadows',
                requiredInsight: 'cave_shadows_depth'
            },
            pathWeaver: {
                name: 'Path Weaver',
                colors: { primary: 0x000033, secondary: 0x000011, accent: 0x0000ff },
                effects: ['possibilityTrails', 'choiceAura'],
                unlocked: false,
                description: 'Unlocked by embracing the Garden of Forking Paths',
                requiredInsight: 'garden_choice_master'
            },
            quantumObserver: {
                name: 'Quantum Observer',
                colors: { primary: 0x330033, secondary: 0x110011, accent: 0xff00ff },
                effects: ['quantumFlicker', 'consciousnessField'],
                unlocked: false,
                description: 'Unlocked by grasping the Observer\'s Paradox',
                requiredInsight: 'observer_consciousness'
            },
            identitySeeker: {
                name: 'Identity Seeker',
                colors: { primary: 0x333300, secondary: 0x111100, accent: 0xffff00 },
                effects: ['morphingParts', 'continuityField'],
                unlocked: false,
                description: 'Unlocked by questioning the Ship of Theseus',
                requiredInsight: 'theseus_identity'
            },
            enlightenedOne: {
                name: 'The Enlightened',
                colors: { primary: 0xffffff, secondary: 0xcccccc, accent: 0xffffff },
                effects: ['pureLight', 'wisdomAura', 'tranquility'],
                unlocked: false,
                description: 'Unlocked through deep contemplation across all zones',
                requiredInsight: 'full_enlightenment'
            }
        };
        
        // Visual effect definitions
        this.effectDefinitions = {
            shadowTrail: this.createShadowTrailEffect.bind(this),
            realityShimmer: this.createRealityShimmerEffect.bind(this),
            possibilityTrails: this.createPossibilityTrailsEffect.bind(this),
            choiceAura: this.createChoiceAuraEffect.bind(this),
            quantumFlicker: this.createQuantumFlickerEffect.bind(this),
            consciousnessField: this.createConsciousnessFieldEffect.bind(this),
            morphingParts: this.createMorphingPartsEffect.bind(this),
            continuityField: this.createContinuityFieldEffect.bind(this),
            pureLight: this.createPureLightEffect.bind(this),
            wisdomAura: this.createWisdomAuraEffect.bind(this),
            tranquility: this.createTranquilityEffect.bind(this)
        };
        
        // Active effects
        this.activeEffects = new Map();
        
        this.initializeCustomization();
    }
    
    initializeCustomization() {
        // Set up initial theme
        this.applyTheme('default');
        
        // Load saved progress if available
        this.loadProgress();
    }
    
    // Theme application
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme || !theme.unlocked) {
            console.log(`[CUSTOMIZATION] Theme '${themeName}' not available`);
            return false;
        }
        
        console.log(`[CUSTOMIZATION] Applying theme: ${theme.name}`);
        this.currentTheme = themeName;
        
        // Update helicopter colors
        this.updateHelicopterColors(theme.colors);
        
        // Remove old effects
        this.clearActiveEffects();
        
        // Apply new effects
        theme.effects.forEach(effectName => {
            this.applyEffect(effectName);
        });
        
        return true;
    }
    
    updateHelicopterColors(colors) {
        const helicopterGroup = this.helicopter.helicopter;
        
        helicopterGroup.children.forEach(child => {
            if (child.material) {
                if (child === this.helicopter.fuselage) {
                    child.material.color.setHex(colors.primary);
                    child.material.emissive.setHex(colors.primary * 0.1);
                } else if (child.userData.isRotor) {
                    child.material.color.setHex(colors.secondary);
                } else if (child.userData.isSkid) {
                    child.material.color.setHex(colors.secondary);
                } else if (child === this.helicopter.glow) {
                    child.material.color.setHex(colors.accent);
                }
                
                // Update point light color if it exists
                if (child.type === 'PointLight') {
                    child.color.setHex(colors.accent);
                }
            }
        });
    }
    
    // Visual effects implementation
    createShadowTrailEffect() {
        const effect = {
            name: 'shadowTrail',
            objects: [],
            update: (deltaTime) => {
                // Create shadow copies behind helicopter
                if (Math.random() > 0.95) {
                    const shadowGeometry = this.helicopter.fuselage.geometry.clone();
                    const shadowMaterial = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
                    shadow.position.copy(this.helicopter.helicopter.position);
                    shadow.rotation.copy(this.helicopter.helicopter.rotation);
                    shadow.scale.copy(this.helicopter.helicopter.scale);
                    
                    this.helicopter.scene.add(shadow);
                    effect.objects.push(shadow);
                    
                    // Fade and remove shadow
                    const fadeOut = () => {
                        shadow.material.opacity -= 0.01;
                        if (shadow.material.opacity <= 0) {
                            this.helicopter.scene.remove(shadow);
                            const index = effect.objects.indexOf(shadow);
                            if (index > -1) effect.objects.splice(index, 1);
                        } else {
                            requestAnimationFrame(fadeOut);
                        }
                    };
                    fadeOut();
                }
            }
        };
        
        return effect;
    }
    
    createRealityShimmerEffect() {
        const effect = {
            name: 'realityShimmer',
            objects: [],
            update: (deltaTime) => {
                // Make helicopter slightly transparent and shimmery
                const helicopterGroup = this.helicopter.helicopter;
                helicopterGroup.children.forEach(child => {
                    if (child.material && child.material.opacity !== undefined) {
                        const shimmer = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
                        child.material.opacity = shimmer;
                    }
                });
            }
        };
        
        return effect;
    }
    
    createPossibilityTrailsEffect() {
        const effect = {
            name: 'possibilityTrails',
            objects: [],
            trails: [],
            update: (deltaTime) => {
                // Create branching possibility trails
                const currentPos = this.helicopter.helicopter.position.clone();
                
                if (this.helicopter.velocity.length() > 0.1) {
                    effect.trails.push({
                        position: currentPos,
                        time: 0,
                        maxTime: 2.0
                    });
                }
                
                // Update and render trails
                effect.trails = effect.trails.filter(trail => {
                    trail.time += deltaTime;
                    
                    if (trail.time < trail.maxTime) {
                        // Create trail particle
                        const particleGeometry = new THREE.SphereGeometry(0.5, 4, 4);
                        const particleMaterial = new THREE.MeshBasicMaterial({
                            color: 0x0000ff,
                            transparent: true,
                            opacity: 1 - (trail.time / trail.maxTime)
                        });
                        
                        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                        particle.position.copy(trail.position);
                        
                        this.helicopter.scene.add(particle);
                        
                        // Remove after short time
                        setTimeout(() => {
                            this.helicopter.scene.remove(particle);
                        }, 100);
                        
                        return true;
                    }
                    return false;
                });
            }
        };
        
        return effect;
    }
    
    createChoiceAuraEffect() {
        const effect = {
            name: 'choiceAura',
            objects: [],
            update: (deltaTime) => {
                // Pulsing aura around helicopter
                if (!effect.aura) {
                    const auraGeometry = new THREE.SphereGeometry(15, 16, 8);
                    const auraMaterial = new THREE.MeshBasicMaterial({
                        color: 0x0000ff,
                        transparent: true,
                        opacity: 0.2,
                        side: THREE.BackSide
                    });
                    
                    effect.aura = new THREE.Mesh(auraGeometry, auraMaterial);
                    this.helicopter.helicopter.add(effect.aura);
                    effect.objects.push(effect.aura);
                }
                
                // Pulse effect
                const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.2;
                effect.aura.material.opacity = pulse;
                effect.aura.scale.setScalar(1 + pulse * 0.2);
            }
        };
        
        return effect;
    }
    
    createQuantumFlickerEffect() {
        const effect = {
            name: 'quantumFlicker',
            objects: [],
            update: (deltaTime) => {
                // Random quantum flicker
                if (Math.random() > 0.98) {
                    const helicopterGroup = this.helicopter.helicopter;
                    helicopterGroup.visible = false;
                    
                    setTimeout(() => {
                        helicopterGroup.visible = true;
                    }, 50 + Math.random() * 100);
                }
            }
        };
        
        return effect;
    }
    
    createConsciousnessFieldEffect() {
        const effect = {
            name: 'consciousnessField',
            objects: [],
            update: (deltaTime) => {
                // Expanding consciousness waves
                if (Math.random() > 0.99) {
                    const waveGeometry = new THREE.RingGeometry(1, 2, 16);
                    const waveMaterial = new THREE.MeshBasicMaterial({
                        color: 0xff00ff,
                        transparent: true,
                        opacity: 0.8,
                        side: THREE.DoubleSide
                    });
                    
                    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
                    wave.position.copy(this.helicopter.helicopter.position);
                    wave.rotation.x = -Math.PI / 2;
                    
                    this.helicopter.scene.add(wave);
                    effect.objects.push(wave);
                    
                    // Expand and fade wave
                    const expandWave = () => {
                        wave.scale.multiplyScalar(1.05);
                        wave.material.opacity *= 0.95;
                        
                        if (wave.material.opacity > 0.01) {
                            requestAnimationFrame(expandWave);
                        } else {
                            this.helicopter.scene.remove(wave);
                            const index = effect.objects.indexOf(wave);
                            if (index > -1) effect.objects.splice(index, 1);
                        }
                    };
                    expandWave();
                }
            }
        };
        
        return effect;
    }
    
    createMorphingPartsEffect() {
        const effect = {
            name: 'morphingParts',
            objects: [],
            morphTargets: [],
            update: (deltaTime) => {
                // Gradually morph helicopter parts
                const helicopterGroup = this.helicopter.helicopter;
                helicopterGroup.children.forEach(child => {
                    if (child.geometry && child.geometry.attributes.position) {
                        const positions = child.geometry.attributes.position.array;
                        
                        // Subtle morphing
                        for (let i = 0; i < positions.length; i += 3) {
                            const morphAmount = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.02;
                            positions[i] += morphAmount;
                            positions[i + 1] += morphAmount * 0.5;
                            positions[i + 2] += morphAmount;
                        }
                        
                        child.geometry.attributes.position.needsUpdate = true;
                    }
                });
            }
        };
        
        return effect;
    }
    
    createContinuityFieldEffect() {
        const effect = {
            name: 'continuityField',
            objects: [],
            update: (deltaTime) => {
                // Timeline visualization
                if (!effect.timeline) {
                    const timelineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 50, 8);
                    const timelineMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffff00,
                        transparent: true,
                        opacity: 0.6
                    });
                    
                    effect.timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
                    effect.timeline.position.set(0, 0, -30);
                    this.helicopter.helicopter.add(effect.timeline);
                    effect.objects.push(effect.timeline);
                }
                
                // Rotate timeline
                effect.timeline.rotation.z += deltaTime * 0.5;
            }
        };
        
        return effect;
    }
    
    createPureLightEffect() {
        const effect = {
            name: 'pureLight',
            objects: [],
            update: (deltaTime) => {
                // Radiant light emanating from helicopter
                if (!effect.light) {
                    effect.light = new THREE.PointLight(0xffffff, 2, 200);
                    this.helicopter.helicopter.add(effect.light);
                    effect.objects.push(effect.light);
                }
                
                // Gentle pulsing
                const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 1.7;
                effect.light.intensity = pulse;
            }
        };
        
        return effect;
    }
    
    createWisdomAuraEffect() {
        const effect = {
            name: 'wisdomAura',
            objects: [],
            update: (deltaTime) => {
                // Floating wisdom symbols around helicopter
                if (Math.random() > 0.995) {
                    const symbols = ['∞', '☯', '◉', '⚮', '◎'];
                    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                    
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = 64;
                    canvas.height = 64;
                    
                    context.fillStyle = '#ffffff';
                    context.font = '32px Arial';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(symbol, 32, 32);
                    
                    const texture = new THREE.CanvasTexture(canvas);
                    const spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                        transparent: true
                    });
                    
                    const sprite = new THREE.Sprite(spriteMaterial);
                    sprite.position.copy(this.helicopter.helicopter.position);
                    sprite.position.add(new THREE.Vector3(
                        (Math.random() - 0.5) * 40,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 40
                    ));
                    sprite.scale.set(5, 5, 1);
                    
                    this.helicopter.scene.add(sprite);
                    effect.objects.push(sprite);
                    
                    // Float upward and fade
                    const float = () => {
                        sprite.position.y += 0.5;
                        sprite.material.opacity -= 0.01;
                        
                        if (sprite.material.opacity > 0) {
                            requestAnimationFrame(float);
                        } else {
                            this.helicopter.scene.remove(sprite);
                            const index = effect.objects.indexOf(sprite);
                            if (index > -1) effect.objects.splice(index, 1);
                        }
                    };
                    float();
                }
            }
        };
        
        return effect;
    }
    
    createTranquilityEffect() {
        const effect = {
            name: 'tranquility',
            objects: [],
            update: (deltaTime) => {
                // Smooth, calming movements
                const helicopterGroup = this.helicopter.helicopter;
                
                // Gentle hovering motion
                const tranquilMotion = Math.sin(Date.now() * 0.001) * 0.5;
                helicopterGroup.position.y += tranquilMotion * 0.01;
                
                // Soft rotation
                helicopterGroup.rotation.y += Math.sin(Date.now() * 0.0005) * 0.001;
            }
        };
        
        return effect;
    }
    
    // Effect management
    applyEffect(effectName) {
        if (this.effectDefinitions[effectName] && !this.activeEffects.has(effectName)) {
            const effect = this.effectDefinitions[effectName]();
            this.activeEffects.set(effectName, effect);
            console.log(`[CUSTOMIZATION] Applied effect: ${effectName}`);
        }
    }
    
    removeEffect(effectName) {
        const effect = this.activeEffects.get(effectName);
        if (effect) {
            // Clean up effect objects
            effect.objects.forEach(obj => {
                if (obj.parent) {
                    obj.parent.remove(obj);
                } else {
                    this.helicopter.scene.remove(obj);
                }
            });
            
            this.activeEffects.delete(effectName);
            console.log(`[CUSTOMIZATION] Removed effect: ${effectName}`);
        }
    }
    
    clearActiveEffects() {
        for (const effectName of this.activeEffects.keys()) {
            this.removeEffect(effectName);
        }
    }
    
    // Insight and unlock system
    addInsight(insightKey) {
        if (!this.insights.has(insightKey)) {
            this.insights.add(insightKey);
            this.contemplationLevel++;
            
            console.log(`[INSIGHT] Gained: ${insightKey}`);
            
            // Check for theme unlocks
            this.checkThemeUnlocks();
            
            this.saveProgress();
        }
    }
    
    checkThemeUnlocks() {
        for (const [themeName, theme] of Object.entries(this.themes)) {
            if (!theme.unlocked && theme.requiredInsight) {
                if (this.insights.has(theme.requiredInsight)) {
                    this.unlockTheme(themeName);
                }
            }
        }
        
        // Check for enlightenment
        if (this.insights.size >= 10) {
            this.unlockTheme('enlightenedOne');
        }
    }
    
    unlockTheme(themeName) {
        const theme = this.themes[themeName];
        if (theme && !theme.unlocked) {
            theme.unlocked = true;
            console.log(`[UNLOCK] New theme available: ${theme.name}`);
            
            // Show unlock notification (would integrate with UI)
            this.showUnlockNotification(theme);
        }
    }
    
    showUnlockNotification(theme) {
        console.log(`🎉 [THEME UNLOCKED] ${theme.name}: ${theme.description}`);
        // This would trigger a UI notification in the actual game
    }
    
    // Progress persistence
    saveProgress() {
        const progressData = {
            currentTheme: this.currentTheme,
            insights: Array.from(this.insights),
            contemplationLevel: this.contemplationLevel,
            unlockedThemes: Object.keys(this.themes).filter(name => this.themes[name].unlocked)
        };
        
        localStorage.setItem('matrixhelicopter_customization', JSON.stringify(progressData));
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('matrixhelicopter_customization');
            if (saved) {
                const progressData = JSON.parse(saved);
                
                this.insights = new Set(progressData.insights || []);
                this.contemplationLevel = progressData.contemplationLevel || 0;
                
                // Unlock saved themes
                if (progressData.unlockedThemes) {
                    progressData.unlockedThemes.forEach(themeName => {
                        if (this.themes[themeName]) {
                            this.themes[themeName].unlocked = true;
                        }
                    });
                }
                
                // Apply saved theme
                if (progressData.currentTheme) {
                    this.applyTheme(progressData.currentTheme);
                }
            }
        } catch (error) {
            console.warn('[CUSTOMIZATION] Could not load progress:', error);
        }
    }
    
    // Update method called from main game loop
    update(deltaTime) {
        // Update all active effects
        for (const effect of this.activeEffects.values()) {
            if (effect.update) {
                effect.update(deltaTime);
            }
        }
    }
    
    // Public interface methods
    getAvailableThemes() {
        return Object.entries(this.themes)
            .filter(([_, theme]) => theme.unlocked)
            .map(([name, theme]) => ({ name, ...theme }));
    }
    
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            ...this.themes[this.currentTheme]
        };
    }
    
    getProgress() {
        return {
            insights: Array.from(this.insights),
            contemplationLevel: this.contemplationLevel,
            unlockedThemes: this.getAvailableThemes().length,
            totalThemes: Object.keys(this.themes).length
        };
    }
}