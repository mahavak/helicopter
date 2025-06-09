import * as THREE from 'three';

/**
 * Helicopter Type Definitions
 * Different helicopter models with unique flight characteristics
 * for varied meditation experiences
 */
export const HelicopterTypes = {
    // Light observation helicopter - nimble and responsive
    MATRIX_SCOUT: {
        id: 'matrix_scout',
        name: 'Matrix Scout',
        description: 'Nimble reconnaissance craft for exploring digital realms',
        specs: {
            mass: 800, // kg
            maxLift: 12000, // N
            rotorRadius: 3.5, // m
            maxSpeed: 180, // km/h
            cruiseSpeed: 140, // km/h
            serviceHeight: 4000, // m
            fuelCapacity: 200, // liters
            enginePower: 420, // hp
        },
        handling: {
            responsiveness: 2.5,
            stability: 0.7,
            agility: 0.9,
            efficiency: 0.8
        },
        visual: {
            fuselageColor: 0x003300,
            rotorColor: 0x004400,
            glowIntensity: 0.6,
            trailEffect: true
        },
        meditation: {
            focusType: 'exploration',
            zoneAffinity: ['Garden of Forking Paths', 'Observer\'s Paradox'],
            insightMultiplier: 1.2
        }
    },
    
    // Medium transport - stable and contemplative
    DIGITAL_TRANSPORT: {
        id: 'digital_transport',
        name: 'Digital Transport',
        description: 'Stable platform for deep contemplation and passenger meditation',
        specs: {
            mass: 2200, // kg
            maxLift: 28000, // N
            rotorRadius: 5.5, // m
            maxSpeed: 150, // km/h
            cruiseSpeed: 120, // km/h
            serviceHeight: 3000, // m
            fuelCapacity: 600, // liters
            enginePower: 1100, // hp
        },
        handling: {
            responsiveness: 1.5,
            stability: 0.95,
            agility: 0.5,
            efficiency: 0.9
        },
        visual: {
            fuselageColor: 0x002200,
            rotorColor: 0x003300,
            glowIntensity: 0.8,
            trailEffect: false
        },
        meditation: {
            focusType: 'contemplation',
            zoneAffinity: ['Cave of Shadows', 'Ship of Theseus'],
            insightMultiplier: 1.5
        }
    },
    
    // Heavy lifter - powerful and grounding
    CODE_LIFTER: {
        id: 'code_lifter',
        name: 'Code Lifter',
        description: 'Heavy-duty craft for lifting burdens and transcending limitations',
        specs: {
            mass: 4500, // kg
            maxLift: 55000, // N
            rotorRadius: 7.0, // m
            maxSpeed: 120, // km/h
            cruiseSpeed: 90, // km/h
            serviceHeight: 2500, // m
            fuelCapacity: 1200, // liters
            enginePower: 2400, // hp
        },
        handling: {
            responsiveness: 1.0,
            stability: 0.98,
            agility: 0.3,
            efficiency: 0.7
        },
        visual: {
            fuselageColor: 0x001100,
            rotorColor: 0x002200,
            glowIntensity: 1.0,
            trailEffect: true
        },
        meditation: {
            focusType: 'grounding',
            zoneAffinity: ['Cave of Shadows'],
            insightMultiplier: 2.0
        }
    },
    
    // Experimental - unstable but enlightening
    QUANTUM_PARADOX: {
        id: 'quantum_paradox',
        name: 'Quantum Paradox',
        description: 'Experimental craft existing in superposition of flight states',
        specs: {
            mass: 1000, // kg (variable)
            maxLift: 20000, // N (fluctuating)
            rotorRadius: 4.0, // m
            maxSpeed: 250, // km/h
            cruiseSpeed: 160, // km/h
            serviceHeight: 5000, // m
            fuelCapacity: 300, // liters
            enginePower: 800, // hp (quantum flux)
        },
        handling: {
            responsiveness: 3.0, // Highly responsive but unpredictable
            stability: 0.4, // Intentionally unstable
            agility: 0.95,
            efficiency: 0.6 // Efficiency varies with observation
        },
        visual: {
            fuselageColor: 0x00ff00,
            rotorColor: 0x00ff00,
            glowIntensity: 1.5,
            trailEffect: true,
            quantumEffects: true // Special visual effects
        },
        meditation: {
            focusType: 'transcendence',
            zoneAffinity: ['Observer\'s Paradox'],
            insightMultiplier: 3.0 // High risk, high reward
        }
    },
    
    // Autorotation specialist - for practicing emergency procedures
    ZEN_GLIDER: {
        id: 'zen_glider',
        name: 'Zen Glider',
        description: 'Optimized for autorotation and powerless flight meditation',
        specs: {
            mass: 600, // kg (lightweight)
            maxLift: 9000, // N
            rotorRadius: 4.5, // m (large for autorotation)
            maxSpeed: 140, // km/h
            cruiseSpeed: 100, // km/h
            serviceHeight: 3500, // m
            fuelCapacity: 150, // liters
            enginePower: 300, // hp (minimal)
        },
        handling: {
            responsiveness: 2.0,
            stability: 0.85,
            agility: 0.7,
            efficiency: 0.95,
            autorotationBonus: 1.5 // Enhanced autorotation capability
        },
        visual: {
            fuselageColor: 0x004400,
            rotorColor: 0x006600,
            glowIntensity: 0.4,
            trailEffect: false
        },
        meditation: {
            focusType: 'acceptance',
            zoneAffinity: ['All Zones'],
            insightMultiplier: 1.0,
            specialAbility: 'Enhanced autorotation and gliding'
        }
    }
};

/**
 * Helicopter Type Manager
 * Handles helicopter selection and configuration
 */
export class HelicopterTypeManager {
    constructor() {
        this.currentType = HelicopterTypes.MATRIX_SCOUT;
        this.unlockedTypes = ['matrix_scout']; // Start with scout unlocked
    }
    
    /**
     * Select a helicopter type
     */
    selectHelicopter(typeId) {
        if (!this.isUnlocked(typeId)) {
            console.warn(`Helicopter type ${typeId} is not unlocked yet`);
            return false;
        }
        
        const type = this.getTypeById(typeId);
        if (type) {
            this.currentType = type;
            return true;
        }
        return false;
    }
    
    /**
     * Get helicopter type by ID
     */
    getTypeById(typeId) {
        return Object.values(HelicopterTypes).find(type => type.id === typeId);
    }
    
    /**
     * Check if a helicopter type is unlocked
     */
    isUnlocked(typeId) {
        return this.unlockedTypes.includes(typeId);
    }
    
    /**
     * Unlock a new helicopter type
     */
    unlockType(typeId) {
        if (!typeId || this.unlockedTypes.includes(typeId)) {
            return false;
        }
        
        const type = this.getTypeById(typeId);
        if (!type) {
            return false;
        }
        
        this.unlockedTypes.push(typeId);
        console.log(`🚁 New helicopter unlocked: ${type.name}`);
        return true;
    }
    
    /**
     * Get current helicopter specifications
     */
    getCurrentSpecs() {
        return this.currentType.specs;
    }
    
    /**
     * Get current handling characteristics
     */
    getCurrentHandling() {
        return this.currentType.handling;
    }
    
    /**
     * Apply type-specific modifications to physics
     */
    applyTypeModifiers(physics) {
        const specs = this.currentType.specs;
        const handling = this.currentType.handling;
        
        // Update physics parameters based on helicopter type
        physics.controller.mass = specs.mass;
        physics.controller.maxLift = specs.maxLift;
        physics.rotorRadius = specs.rotorRadius;
        physics.controller.responsiveness = handling.responsiveness;
        
        // Special handling for autorotation specialist
        if (this.currentType.id === 'zen_glider') {
            physics.autorotationBonus = handling.autorotationBonus || 1.0;
        }
        
        // Quantum effects for experimental helicopter
        if (this.currentType.visual.quantumEffects) {
            physics.quantumFlux = Math.sin(Date.now() * 0.001) * 0.2;
        }
    }
    
    /**
     * Create visual representation based on type
     */
    createHelicopterMesh(scene) {
        const type = this.currentType;
        const helicopter = new THREE.Group();
        
        // Main body with type-specific dimensions
        const scale = type.specs.rotorRadius / 4.0; // Scale based on rotor size
        const fuselageGeometry = new THREE.CapsuleGeometry(
            0.8 * scale, 
            4 * scale, 
            8, 
            16
        );
        
        const fuselageMaterial = new THREE.MeshPhongMaterial({ 
            color: type.visual.fuselageColor,
            transparent: true,
            opacity: 0.9,
            emissive: type.visual.fuselageColor,
            emissiveIntensity: 0.2
        });
        
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.rotation.z = Math.PI / 2;
        helicopter.add(fuselage);
        
        // Rotor with appropriate size
        const rotorGroup = new THREE.Group();
        const bladeCount = type.id === 'code_lifter' ? 6 : 4; // More blades for heavy lifter
        
        for (let i = 0; i < bladeCount; i++) {
            const rotorBladeGeometry = new THREE.BoxGeometry(
                type.specs.rotorRadius * 2, 
                0.1 * scale, 
                0.3 * scale
            );
            const rotorMaterial = new THREE.MeshPhongMaterial({ 
                color: type.visual.rotorColor,
                transparent: true,
                opacity: 0.7,
                emissive: type.visual.rotorColor,
                emissiveIntensity: 0.1
            });
            
            const blade = new THREE.Mesh(rotorBladeGeometry, rotorMaterial);
            blade.rotation.z = (i * Math.PI * 2) / bladeCount;
            rotorGroup.add(blade);
        }
        
        rotorGroup.position.y = 1.5 * scale;
        helicopter.add(rotorGroup);
        
        // Quantum effects for experimental helicopter
        if (type.visual.quantumEffects) {
            const quantumField = new THREE.Mesh(
                new THREE.SphereGeometry(type.specs.rotorRadius * 1.5, 16, 8),
                new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    transparent: true,
                    opacity: 0.1,
                    wireframe: true
                })
            );
            helicopter.add(quantumField);
        }
        
        return {
            group: helicopter,
            fuselage: fuselage,
            rotor: rotorGroup
        };
    }
    
    /**
     * Get helicopter selection UI data
     */
    getSelectionData() {
        return Object.values(HelicopterTypes).map(type => ({
            id: type.id,
            name: type.name,
            description: type.description,
            unlocked: this.isUnlocked(type.id),
            specs: {
                speed: `${type.specs.maxSpeed} km/h`,
                weight: `${type.specs.mass} kg`,
                power: `${type.specs.enginePower} hp`,
                ceiling: `${type.specs.serviceHeight} m`
            },
            meditation: type.meditation
        }));
    }
}