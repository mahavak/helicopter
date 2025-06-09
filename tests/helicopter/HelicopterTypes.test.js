import { HelicopterTypes, HelicopterTypeManager } from '../../src/helicopter/HelicopterTypes.js';
import * as THREE from 'three';

// Mock scene for mesh creation
const mockScene = {
    add: jest.fn(),
    remove: jest.fn()
};

describe('HelicopterTypes', () => {
    describe('Type Definitions', () => {
        test('should define all required helicopter types', () => {
            expect(HelicopterTypes.MATRIX_SCOUT).toBeDefined();
            expect(HelicopterTypes.DIGITAL_TRANSPORT).toBeDefined();
            expect(HelicopterTypes.CODE_LIFTER).toBeDefined();
            expect(HelicopterTypes.QUANTUM_PARADOX).toBeDefined();
            expect(HelicopterTypes.ZEN_GLIDER).toBeDefined();
        });

        test('should have unique IDs for each type', () => {
            const types = Object.values(HelicopterTypes);
            const ids = types.map(type => type.id);
            const uniqueIds = [...new Set(ids)];
            
            expect(uniqueIds.length).toBe(ids.length);
        });

        test('should have required properties for each type', () => {
            Object.values(HelicopterTypes).forEach(type => {
                expect(type).toHaveProperty('id');
                expect(type).toHaveProperty('name');
                expect(type).toHaveProperty('description');
                expect(type).toHaveProperty('specs');
                expect(type).toHaveProperty('handling');
                expect(type).toHaveProperty('visual');
                expect(type).toHaveProperty('meditation');
            });
        });

        test('should have valid specs for each type', () => {
            Object.values(HelicopterTypes).forEach(type => {
                expect(type.specs.mass).toBeGreaterThan(0);
                expect(type.specs.maxLift).toBeGreaterThan(0);
                expect(type.specs.rotorRadius).toBeGreaterThan(0);
                expect(type.specs.maxSpeed).toBeGreaterThan(0);
                expect(type.specs.cruiseSpeed).toBeGreaterThan(0);
                expect(type.specs.serviceHeight).toBeGreaterThan(0);
                expect(type.specs.fuelCapacity).toBeGreaterThan(0);
                expect(type.specs.enginePower).toBeGreaterThan(0);
            });
        });

        test('should have valid handling characteristics', () => {
            Object.values(HelicopterTypes).forEach(type => {
                expect(type.handling.responsiveness).toBeGreaterThan(0);
                expect(type.handling.stability).toBeGreaterThan(0);
                expect(type.handling.stability).toBeLessThanOrEqual(1);
                expect(type.handling.agility).toBeGreaterThan(0);
                expect(type.handling.agility).toBeLessThanOrEqual(1);
                expect(type.handling.efficiency).toBeGreaterThan(0);
                expect(type.handling.efficiency).toBeLessThanOrEqual(1);
            });
        });

        test('should have valid visual properties', () => {
            Object.values(HelicopterTypes).forEach(type => {
                expect(typeof type.visual.fuselageColor).toBe('number');
                expect(typeof type.visual.rotorColor).toBe('number');
                expect(type.visual.glowIntensity).toBeGreaterThan(0);
                expect(typeof type.visual.trailEffect).toBe('boolean');
            });
        });

        test('should have meditation properties', () => {
            Object.values(HelicopterTypes).forEach(type => {
                expect(type.meditation.focusType).toBeDefined();
                expect(Array.isArray(type.meditation.zoneAffinity)).toBe(true);
                expect(type.meditation.insightMultiplier).toBeGreaterThan(0);
            });
        });
    });

    describe('Type Specific Validations', () => {
        test('Matrix Scout should be light and agile', () => {
            const scout = HelicopterTypes.MATRIX_SCOUT;
            
            expect(scout.specs.mass).toBe(800);
            expect(scout.handling.agility).toBe(0.9);
            expect(scout.handling.responsiveness).toBe(2.5);
            expect(scout.meditation.focusType).toBe('exploration');
        });

        test('Digital Transport should be stable and heavy', () => {
            const transport = HelicopterTypes.DIGITAL_TRANSPORT;
            
            expect(transport.specs.mass).toBe(2200);
            expect(transport.handling.stability).toBe(0.95);
            expect(transport.handling.agility).toBe(0.5);
            expect(transport.meditation.focusType).toBe('contemplation');
        });

        test('Code Lifter should be the heaviest', () => {
            const lifter = HelicopterTypes.CODE_LIFTER;
            
            expect(lifter.specs.mass).toBe(4500);
            expect(lifter.specs.maxLift).toBe(55000);
            expect(lifter.handling.stability).toBe(0.98);
            expect(lifter.meditation.focusType).toBe('grounding');
        });

        test('Quantum Paradox should be experimental', () => {
            const quantum = HelicopterTypes.QUANTUM_PARADOX;
            
            expect(quantum.specs.mass).toBe(1000);
            expect(quantum.handling.stability).toBe(0.4);
            expect(quantum.handling.responsiveness).toBe(3.0);
            expect(quantum.visual.quantumEffects).toBe(true);
            expect(quantum.meditation.focusType).toBe('transcendence');
        });

        test('Zen Glider should be optimized for autorotation', () => {
            const zen = HelicopterTypes.ZEN_GLIDER;
            
            expect(zen.specs.mass).toBe(600);
            expect(zen.handling.autorotationBonus).toBe(1.5);
            expect(zen.handling.efficiency).toBe(0.95);
            expect(zen.meditation.focusType).toBe('acceptance');
        });
    });
});

describe('HelicopterTypeManager', () => {
    let manager;

    beforeEach(() => {
        manager = new HelicopterTypeManager();
    });

    describe('Initialization', () => {
        test('should initialize with Matrix Scout as default', () => {
            expect(manager.currentType).toBe(HelicopterTypes.MATRIX_SCOUT);
            expect(manager.unlockedTypes).toContain('matrix_scout');
            expect(manager.unlockedTypes.length).toBe(1);
        });

        test('should have correct initial state', () => {
            expect(manager.currentType.id).toBe('matrix_scout');
            expect(manager.isUnlocked('matrix_scout')).toBe(true);
            expect(manager.isUnlocked('digital_transport')).toBe(false);
        });
    });

    describe('Helicopter Selection', () => {
        test('should select unlocked helicopter', () => {
            const success = manager.selectHelicopter('matrix_scout');
            
            expect(success).toBe(true);
            expect(manager.currentType.id).toBe('matrix_scout');
        });

        test('should not select locked helicopter', () => {
            const success = manager.selectHelicopter('digital_transport');
            
            expect(success).toBe(false);
            expect(manager.currentType.id).toBe('matrix_scout');
        });

        test('should not select non-existent helicopter', () => {
            const success = manager.selectHelicopter('non_existent');
            
            expect(success).toBe(false);
            expect(manager.currentType.id).toBe('matrix_scout');
        });

        test('should select after unlocking', () => {
            manager.unlockType('digital_transport');
            const success = manager.selectHelicopter('digital_transport');
            
            expect(success).toBe(true);
            expect(manager.currentType.id).toBe('digital_transport');
        });
    });

    describe('Type Unlocking', () => {
        test('should unlock new helicopter type', () => {
            const success = manager.unlockType('digital_transport');
            
            expect(success).toBe(true);
            expect(manager.isUnlocked('digital_transport')).toBe(true);
            expect(manager.unlockedTypes).toContain('digital_transport');
        });

        test('should not unlock already unlocked type', () => {
            const success = manager.unlockType('matrix_scout');
            
            expect(success).toBe(false);
            expect(manager.unlockedTypes.filter(id => id === 'matrix_scout').length).toBe(1);
        });

        test('should handle invalid type ID', () => {
            const success = manager.unlockType('invalid_type');
            
            expect(success).toBe(false);
            expect(manager.unlockedTypes).not.toContain('invalid_type');
        });

        test('should unlock all types', () => {
            const typeIds = Object.values(HelicopterTypes).map(type => type.id);
            
            typeIds.forEach(id => {
                if (id !== 'matrix_scout') {
                    manager.unlockType(id);
                }
            });
            
            expect(manager.unlockedTypes.length).toBe(typeIds.length);
            typeIds.forEach(id => {
                expect(manager.isUnlocked(id)).toBe(true);
            });
        });
    });

    describe('Type Retrieval', () => {
        test('should get type by ID', () => {
            const type = manager.getTypeById('quantum_paradox');
            
            expect(type).toBe(HelicopterTypes.QUANTUM_PARADOX);
            expect(type.id).toBe('quantum_paradox');
        });

        test('should return undefined for invalid ID', () => {
            const type = manager.getTypeById('invalid_id');
            
            expect(type).toBeUndefined();
        });

        test('should get current specs', () => {
            const specs = manager.getCurrentSpecs();
            
            expect(specs).toBe(HelicopterTypes.MATRIX_SCOUT.specs);
            expect(specs.mass).toBe(800);
        });

        test('should get current handling', () => {
            const handling = manager.getCurrentHandling();
            
            expect(handling).toBe(HelicopterTypes.MATRIX_SCOUT.handling);
            expect(handling.responsiveness).toBe(2.5);
        });

        test('should update specs when switching types', () => {
            manager.unlockType('code_lifter');
            manager.selectHelicopter('code_lifter');
            
            const specs = manager.getCurrentSpecs();
            
            expect(specs.mass).toBe(4500);
            expect(specs.maxLift).toBe(55000);
        });
    });

    describe('Physics Modifications', () => {
        test('should apply type modifiers to physics', () => {
            const mockPhysics = {
                controller: {
                    mass: 1000,
                    maxLift: 15000,
                    responsiveness: 2.0
                },
                rotorRadius: 4.0,
                autorotationBonus: 1.0,
                quantumFlux: 0
            };
            
            manager.applyTypeModifiers(mockPhysics);
            
            expect(mockPhysics.controller.mass).toBe(800); // Matrix Scout mass
            expect(mockPhysics.controller.maxLift).toBe(12000); // Matrix Scout lift
            expect(mockPhysics.rotorRadius).toBe(3.5); // Matrix Scout rotor
        });

        test('should apply autorotation bonus for Zen Glider', () => {
            const mockPhysics = {
                controller: { mass: 1000, maxLift: 15000, responsiveness: 2.0 },
                rotorRadius: 4.0,
                autorotationBonus: 1.0
            };
            
            manager.unlockType('zen_glider');
            manager.selectHelicopter('zen_glider');
            manager.applyTypeModifiers(mockPhysics);
            
            expect(mockPhysics.autorotationBonus).toBe(1.5);
        });

        test('should apply quantum effects for Quantum Paradox', () => {
            const mockPhysics = {
                controller: { mass: 1000, maxLift: 15000, responsiveness: 2.0 },
                rotorRadius: 4.0,
                quantumFlux: 0
            };
            
            manager.unlockType('quantum_paradox');
            manager.selectHelicopter('quantum_paradox');
            manager.applyTypeModifiers(mockPhysics);
            
            expect(mockPhysics.quantumFlux).toBeDefined();
            expect(typeof mockPhysics.quantumFlux).toBe('number');
        });
    });

    describe('Mesh Creation', () => {
        test('should create helicopter mesh', () => {
            const mesh = manager.createHelicopterMesh(mockScene);
            
            expect(mesh).toHaveProperty('group');
            expect(mesh).toHaveProperty('fuselage');
            expect(mesh).toHaveProperty('rotor');
            expect(mesh.group).toBeInstanceOf(THREE.Group);
        });

        test('should create different sized helicopters', () => {
            const scoutMesh = manager.createHelicopterMesh(mockScene);
            const scoutScale = HelicopterTypes.MATRIX_SCOUT.specs.rotorRadius / 4.0;
            
            manager.unlockType('code_lifter');
            manager.selectHelicopter('code_lifter');
            const lifterMesh = manager.createHelicopterMesh(mockScene);
            const lifterScale = HelicopterTypes.CODE_LIFTER.specs.rotorRadius / 4.0;
            
            expect(lifterScale).toBeGreaterThan(scoutScale);
        });

        test('should apply correct colors for each type', () => {
            const mesh = manager.createHelicopterMesh(mockScene);
            const fuselageMaterial = mesh.fuselage.material;
            
            expect(fuselageMaterial.color.getHex()).toBe(HelicopterTypes.MATRIX_SCOUT.visual.fuselageColor);
        });

        test('should create different blade counts for different types', () => {
            // Matrix Scout should have 4 blades
            const scoutMesh = manager.createHelicopterMesh(mockScene);
            const scoutBladeCount = scoutMesh.rotor.children.length;
            
            // Code Lifter should have 6 blades
            manager.unlockType('code_lifter');
            manager.selectHelicopter('code_lifter');
            const lifterMesh = manager.createHelicopterMesh(mockScene);
            const lifterBladeCount = lifterMesh.rotor.children.length;
            
            expect(scoutBladeCount).toBe(4);
            expect(lifterBladeCount).toBe(6);
        });

        test('should add quantum effects for Quantum Paradox', () => {
            manager.unlockType('quantum_paradox');
            manager.selectHelicopter('quantum_paradox');
            
            const mesh = manager.createHelicopterMesh(mockScene);
            
            // Should have extra quantum field mesh
            const quantumField = mesh.group.children.find(child => 
                child.material && child.material.wireframe
            );
            
            expect(quantumField).toBeDefined();
        });
    });

    describe('Selection Data', () => {
        test('should return selection data for UI', () => {
            manager.unlockType('digital_transport');
            const selectionData = manager.getSelectionData();
            
            expect(Array.isArray(selectionData)).toBe(true);
            expect(selectionData.length).toBe(5); // All 5 helicopter types
            
            selectionData.forEach(data => {
                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('description');
                expect(data).toHaveProperty('unlocked');
                expect(data).toHaveProperty('specs');
                expect(data).toHaveProperty('meditation');
            });
        });

        test('should show correct unlock status', () => {
            manager.unlockType('digital_transport');
            const selectionData = manager.getSelectionData();
            
            const scout = selectionData.find(data => data.id === 'matrix_scout');
            const transport = selectionData.find(data => data.id === 'digital_transport');
            const lifter = selectionData.find(data => data.id === 'code_lifter');
            
            expect(scout.unlocked).toBe(true);
            expect(transport.unlocked).toBe(true);
            expect(lifter.unlocked).toBe(false);
        });

        test('should format specs for display', () => {
            const selectionData = manager.getSelectionData();
            const scoutData = selectionData.find(data => data.id === 'matrix_scout');
            
            expect(scoutData.specs.speed).toBe('180 km/h');
            expect(scoutData.specs.weight).toBe('800 kg');
            expect(scoutData.specs.power).toBe('420 hp');
            expect(scoutData.specs.ceiling).toBe('4000 m');
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle null/undefined input gracefully', () => {
            expect(() => {
                manager.selectHelicopter(null);
                manager.selectHelicopter(undefined);
                manager.unlockType(null);
                manager.unlockType(undefined);
                manager.getTypeById(null);
                manager.getTypeById(undefined);
            }).not.toThrow();
        });

        test('should handle empty string input', () => {
            expect(() => {
                manager.selectHelicopter('');
                manager.unlockType('');
                manager.getTypeById('');
            }).not.toThrow();
        });

        test('should maintain state consistency', () => {
            const originalType = manager.currentType;
            
            // Try various invalid operations
            manager.selectHelicopter('invalid');
            manager.selectHelicopter('locked_type');
            manager.selectHelicopter('');
            manager.selectHelicopter(null);
            
            // Current type should remain unchanged
            expect(manager.currentType).toBe(originalType);
        });

        test('should handle physics object without all properties', () => {
            const incompletePhysics = {
                controller: {}
            };
            
            expect(() => {
                manager.applyTypeModifiers(incompletePhysics);
            }).not.toThrow();
        });

        test('should handle scene object for mesh creation', () => {
            const minimalScene = {};
            
            expect(() => {
                manager.createHelicopterMesh(minimalScene);
            }).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        test('should work through complete workflow', () => {
            // Start with Matrix Scout
            expect(manager.currentType.id).toBe('matrix_scout');
            
            // Unlock Digital Transport
            expect(manager.unlockType('digital_transport')).toBe(true);
            
            // Switch to Digital Transport
            expect(manager.selectHelicopter('digital_transport')).toBe(true);
            expect(manager.currentType.id).toBe('digital_transport');
            
            // Get selection data
            const data = manager.getSelectionData();
            const transportData = data.find(d => d.id === 'digital_transport');
            expect(transportData.unlocked).toBe(true);
            
            // Create mesh
            const mesh = manager.createHelicopterMesh(mockScene);
            expect(mesh.group).toBeDefined();
            
            // Apply physics
            const physics = { controller: {}, rotorRadius: 0 };
            manager.applyTypeModifiers(physics);
            expect(physics.controller.mass).toBe(2200);
        });

        test('should maintain correct state after multiple operations', () => {
            // Unlock several types
            manager.unlockType('digital_transport');
            manager.unlockType('quantum_paradox');
            
            // Switch between types
            manager.selectHelicopter('digital_transport');
            expect(manager.currentType.id).toBe('digital_transport');
            
            manager.selectHelicopter('quantum_paradox');
            expect(manager.currentType.id).toBe('quantum_paradox');
            
            manager.selectHelicopter('matrix_scout');
            expect(manager.currentType.id).toBe('matrix_scout');
            
            // Verify all remain unlocked
            expect(manager.isUnlocked('digital_transport')).toBe(true);
            expect(manager.isUnlocked('quantum_paradox')).toBe(true);
            expect(manager.isUnlocked('matrix_scout')).toBe(true);
        });
    });
});