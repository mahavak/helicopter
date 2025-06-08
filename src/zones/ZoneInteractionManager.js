import * as THREE from 'three';

export class ZoneInteractionManager {
    constructor(scene, helicopter, audioManager) {
        this.scene = scene;
        this.helicopter = helicopter;
        this.audioManager = audioManager;
        
        this.zones = new Map();
        this.activeZone = null;
        this.previousZone = null;
        this.zoneTransitionTime = 0;
        this.interactionCooldown = 0;
        
        this.createInteractiveZones();
    }
    
    createInteractiveZones() {
        // Cave of Shadows - Reality perception zone
        this.zones.set('cave_of_shadows', {
            name: 'Cave of Shadows',
            position: new THREE.Vector3(-200, 50, 200),
            radius: 80,
            innerRadius: 40,
            entryBehavior: this.createCaveEntryBehavior(),
            activeBehavior: this.createCaveActiveBehavior(),
            exitBehavior: this.createCaveExitBehavior(),
            isActive: false,
            entryTime: 0,
            totalTimeInZone: 0
        });
        
        // Garden of Forking Paths - Choice and possibility zone
        this.zones.set('garden_of_paths', {
            name: 'Garden of Forking Paths',
            position: new THREE.Vector3(200, 30, -200),
            radius: 100,
            innerRadius: 50,
            entryBehavior: this.createGardenEntryBehavior(),
            activeBehavior: this.createGardenActiveBehavior(),
            exitBehavior: this.createGardenExitBehavior(),
            isActive: false,
            entryTime: 0,
            totalTimeInZone: 0
        });
        
        // Observer's Paradox - Consciousness zone
        this.zones.set('observers_paradox', {
            name: "Observer's Paradox",
            position: new THREE.Vector3(0, 80, 0),
            radius: 70,
            innerRadius: 35,
            entryBehavior: this.createObserverEntryBehavior(),
            activeBehavior: this.createObserverActiveBehavior(),
            exitBehavior: this.createObserverExitBehavior(),
            isActive: false,
            entryTime: 0,
            totalTimeInZone: 0
        });
        
        // Ship of Theseus - Identity zone
        this.zones.set('ship_theseus', {
            name: 'Ship of Theseus',
            position: new THREE.Vector3(-100, 60, -100),
            radius: 75,
            innerRadius: 40,
            entryBehavior: this.createTheseusEntryBehavior(),
            activeBehavior: this.createTheseusActiveBehavior(),
            exitBehavior: this.createTheseusExitBehavior(),
            isActive: false,
            entryTime: 0,
            totalTimeInZone: 0
        });
    }
    
    // Cave of Shadows Behaviors
    createCaveEntryBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Entering Cave of Shadows - Reality becomes uncertain...');
            
            // Gradually dim lighting
            this.dimWorldLighting(0.3, 2000);
            
            // Add shadow effects to helicopter
            this.addShadowEffect(helicopter);
            
            // Start reality questioning narration
            if (this.audioManager) {
                this.audioManager.enterZone('Cave of Shadows');
            }
            
            // Create dancing shadows around helicopter
            this.createDancingShadows(zone.position);
        };
    }
    
    createCaveActiveBehavior() {
        return (zone, helicopter, deltaTime) => {
            zone.totalTimeInZone += deltaTime;
            
            // Progressive reality distortion the longer you stay
            const timeInZone = zone.totalTimeInZone;
            
            if (timeInZone > 5) {
                this.createRealityGlitches(helicopter.position);
            }
            
            if (timeInZone > 10) {
                this.showPhilosophicalPrompt(
                    "The shadows you see... are they real?\nPress ENTER to question reality"
                );
            }
            
            // Helicopter feels heavier in the cave (philosophical weight)
            helicopter.mass *= 1.02;
            
            // Visual distortions
            this.updateShadowDistortions(timeInZone);
        };
    }
    
    createCaveExitBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Leaving Cave of Shadows - Reality solidifies...');
            
            // Restore normal lighting
            this.restoreWorldLighting(2000);
            
            // Remove shadow effects
            this.removeShadowEffect(helicopter);
            
            // Reset helicopter properties
            helicopter.mass = 1000; // Original mass
            
            // Clean up shadow objects
            this.cleanupDancingShadows();
            
            if (this.audioManager) {
                this.audioManager.exitZone();
            }
        };
    }
    
    // Garden of Forking Paths Behaviors
    createGardenEntryBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Entering Garden of Forking Paths - Infinite possibilities unfold...');
            
            // Show branching flight paths
            this.showBranchingPaths(zone.position);
            
            // Multiple helicopter ghosts showing possible paths
            this.createPossibilityGhosts(helicopter);
            
            if (this.audioManager) {
                this.audioManager.enterZone('Garden of Forking Paths');
            }
        };
    }
    
    createGardenActiveBehavior() {
        return (zone, helicopter, deltaTime) => {
            zone.totalTimeInZone += deltaTime;
            
            // Show choice indicators based on movement
            this.updateChoiceIndicators(helicopter.velocity);
            
            // Every movement creates new possibility trails
            this.createPossibilityTrails(helicopter.position, helicopter.velocity);
            
            // Offer philosophical choices
            if (zone.totalTimeInZone > 8 && zone.totalTimeInZone < 8.1) {
                this.showPhilosophicalChoice([
                    "A) Free will is an illusion",
                    "B) Choice creates reality", 
                    "C) All possibilities exist simultaneously"
                ]);
            }
        };
    }
    
    createGardenExitBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Leaving Garden - Choices made, paths taken...');
            
            // Collapse possibility ghosts
            this.collapsePossibilityGhosts();
            
            // Clear choice indicators
            this.clearChoiceIndicators();
            
            if (this.audioManager) {
                this.audioManager.exitZone();
            }
        };
    }
    
    // Observer's Paradox Behaviors
    createObserverEntryBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Entering Observer\'s Paradox - Consciousness shapes reality...');
            
            // Quantum effects around helicopter
            this.enableQuantumEffects(helicopter);
            
            // Reality phases in and out based on observation
            this.startQuantumObservation();
            
            if (this.audioManager) {
                this.audioManager.enterZone("Observer's Paradox");
            }
        };
    }
    
    createObserverActiveBehavior() {
        return (zone, helicopter, deltaTime) => {
            zone.totalTimeInZone += deltaTime;
            
            // Objects only exist when observed
            this.updateQuantumObjects(helicopter);
            
            // Helicopter itself becomes uncertain
            if (zone.totalTimeInZone > 3) {
                this.makeHelicopterQuantum(helicopter, deltaTime);
            }
            
            // Show consciousness measurement tools
            if (zone.totalTimeInZone > 6) {
                this.showConsciousnessIndicator(helicopter);
            }
        };
    }
    
    createObserverExitBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Leaving Observer\'s Paradox - Wave function collapsed...');
            
            // Solidify reality
            this.disableQuantumEffects(helicopter);
            this.stopQuantumObservation();
            this.hideConsciousnessIndicator();
            
            if (this.audioManager) {
                this.audioManager.exitZone();
            }
        };
    }
    
    // Ship of Theseus Behaviors
    createTheseusEntryBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Entering Ship of Theseus Memorial - Identity questioned...');
            
            // Start gradual helicopter transformation
            this.startIdentityTransformation(helicopter);
            
            // Show identity markers
            this.showIdentityMarkers(helicopter);
            
            if (this.audioManager) {
                this.audioManager.enterZone('Ship of Theseus');
            }
        };
    }
    
    createTheseusActiveBehavior() {
        return (zone, helicopter, deltaTime) => {
            zone.totalTimeInZone += deltaTime;
            
            // Progressive transformation of helicopter parts
            this.updateIdentityTransformation(helicopter, zone.totalTimeInZone);
            
            // Question continuity of identity
            if (zone.totalTimeInZone > 7) {
                this.showIdentityQuestion(
                    "Your helicopter changes, but are you still you?\nPress SPACE to assert identity"
                );
            }
            
            // Visual representation of change
            this.updateIdentityVisualization(helicopter, deltaTime);
        };
    }
    
    createTheseusExitBehavior() {
        return (zone, helicopter) => {
            console.log('[ZONE] Leaving Ship of Theseus - Identity chosen...');
            
            // Complete or revert transformation
            this.completeIdentityTransformation(helicopter);
            
            // Remove identity markers
            this.hideIdentityMarkers();
            
            if (this.audioManager) {
                this.audioManager.exitZone();
            }
        };
    }
    
    // Utility methods for zone effects
    dimWorldLighting(targetIntensity, duration) {
        // Gradually dim ambient lighting
        const lights = this.scene.children.filter(child => child.isLight);
        lights.forEach(light => {
            if (light.intensity > targetIntensity) {
                // Animate to target intensity
                const startIntensity = light.intensity;
                const startTime = Date.now();
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    light.intensity = startIntensity + (targetIntensity - startIntensity) * progress;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                animate();
            }
        });
    }
    
    restoreWorldLighting(duration) {
        this.dimWorldLighting(0.5, duration); // Back to normal
    }
    
    addShadowEffect(helicopter) {
        // Add shadow trails behind helicopter
        const shadowGeometry = new THREE.SphereGeometry(3, 8, 6);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = 0; i < 5; i++) {
            const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
            shadow.userData.isShadowEffect = true;
            shadow.userData.delay = i * 0.2;
            helicopter.helicopter.add(shadow);
        }
    }
    
    removeShadowEffect(helicopter) {
        const shadowObjects = helicopter.helicopter.children.filter(
            child => child.userData.isShadowEffect
        );
        shadowObjects.forEach(shadow => helicopter.helicopter.remove(shadow));
    }
    
    createDancingShadows(position) {
        // Create animated shadow figures around the zone
        for (let i = 0; i < 8; i++) {
            const shadowGeometry = new THREE.PlaneGeometry(5, 10);
            const shadowMaterial = new THREE.MeshBasicMaterial({
                color: 0x001100,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            
            const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
            shadow.position.set(
                position.x + Math.cos(i / 8 * Math.PI * 2) * 50,
                position.y - 10,
                position.z + Math.sin(i / 8 * Math.PI * 2) * 50
            );
            
            shadow.userData.isDancingShadow = true;
            shadow.userData.animationPhase = i / 8 * Math.PI * 2;
            
            this.scene.add(shadow);
        }
    }
    
    cleanupDancingShadows() {
        const shadows = this.scene.children.filter(
            child => child.userData.isDancingShadow
        );
        shadows.forEach(shadow => this.scene.remove(shadow));
    }
    
    updateShadowDistortions(timeInZone) {
        const shadows = this.scene.children.filter(
            child => child.userData.isDancingShadow
        );
        
        shadows.forEach(shadow => {
            const time = Date.now() * 0.001;
            shadow.rotation.y = Math.sin(time + shadow.userData.animationPhase) * 0.5;
            shadow.scale.y = 1 + Math.sin(time * 2 + shadow.userData.animationPhase) * 0.3;
        });
    }
    
    createRealityGlitches(position) {
        // Temporary visual glitches around helicopter
        if (Math.random() > 0.95) { // 5% chance per frame
            const glitchGeometry = new THREE.BoxGeometry(2, 2, 2);
            const glitchMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            
            const glitch = new THREE.Mesh(glitchGeometry, glitchMaterial);
            glitch.position.copy(position);
            glitch.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 20
            ));
            
            this.scene.add(glitch);
            
            // Remove after short time
            setTimeout(() => {
                this.scene.remove(glitch);
            }, 200);
        }
    }
    
    showPhilosophicalPrompt(text) {
        // Display philosophical prompt (would integrate with UI system)
        console.log(`[PHILOSOPHICAL PROMPT] ${text}`);
    }
    
    showPhilosophicalChoice(choices) {
        console.log('[PHILOSOPHICAL CHOICE]');
        choices.forEach(choice => console.log(`  ${choice}`));
    }
    
    // Additional utility methods would continue here...
    // For brevity, I'm including key structure but not every implementation detail
    
    update(deltaTime, helicopterPosition) {
        // Update interaction cooldown
        if (this.interactionCooldown > 0) {
            this.interactionCooldown -= deltaTime;
        }
        
        // Check zone proximity and handle transitions
        let currentZone = null;
        let nearestDistance = Infinity;
        
        this.zones.forEach((zone, key) => {
            const distance = helicopterPosition.distanceTo(zone.position);
            
            if (distance < zone.radius && distance < nearestDistance) {
                nearestDistance = distance;
                currentZone = key;
            }
        });
        
        // Handle zone transitions
        if (currentZone !== this.activeZone) {
            if (this.activeZone) {
                // Exit current zone
                const exitingZone = this.zones.get(this.activeZone);
                exitingZone.isActive = false;
                exitingZone.exitBehavior(exitingZone, this.helicopter);
            }
            
            if (currentZone) {
                // Enter new zone
                const enteringZone = this.zones.get(currentZone);
                enteringZone.isActive = true;
                enteringZone.entryTime = Date.now();
                enteringZone.totalTimeInZone = 0;
                enteringZone.entryBehavior(enteringZone, this.helicopter);
            }
            
            this.previousZone = this.activeZone;
            this.activeZone = currentZone;
            this.zoneTransitionTime = 0;
        }
        
        // Update active zone behavior
        if (this.activeZone) {
            const zone = this.zones.get(this.activeZone);
            zone.activeBehavior(zone, this.helicopter, deltaTime);
        }
        
        // Update zone transition time
        this.zoneTransitionTime += deltaTime;
    }
    
    // Placeholder implementations for complex behaviors
    showBranchingPaths() { /* Implementation */ }
    createPossibilityGhosts() { /* Implementation */ }
    updateChoiceIndicators() { /* Implementation */ }
    createPossibilityTrails() { /* Implementation */ }
    collapsePossibilityGhosts() { /* Implementation */ }
    clearChoiceIndicators() { /* Implementation */ }
    enableQuantumEffects() { /* Implementation */ }
    startQuantumObservation() { /* Implementation */ }
    updateQuantumObjects() { /* Implementation */ }
    makeHelicopterQuantum() { /* Implementation */ }
    showConsciousnessIndicator() { /* Implementation */ }
    disableQuantumEffects() { /* Implementation */ }
    stopQuantumObservation() { /* Implementation */ }
    hideConsciousnessIndicator() { /* Implementation */ }
    startIdentityTransformation() { /* Implementation */ }
    showIdentityMarkers() { /* Implementation */ }
    updateIdentityTransformation() { /* Implementation */ }
    showIdentityQuestion() { /* Implementation */ }
    updateIdentityVisualization() { /* Implementation */ }
    completeIdentityTransformation() { /* Implementation */ }
    hideIdentityMarkers() { /* Implementation */ }
}