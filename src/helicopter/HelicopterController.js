import * as THREE from 'three';
import { AdvancedHelicopterPhysics } from './AdvancedHelicopterPhysics.js';
import { HelicopterTypeManager } from './HelicopterTypes.js';

export class HelicopterController {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Flight dynamics
        this.position = new THREE.Vector3(0, 50, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.angularVelocity = new THREE.Vector3(0, 0, 0);
        
        // Flight parameters
        this.collective = 0; // Main rotor lift (0-1)
        this.cyclicPitch = 0; // Forward/backward tilt (-1 to 1)
        this.cyclicRoll = 0; // Left/right tilt (-1 to 1)
        this.pedal = 0; // Tail rotor yaw (-1 to 1)
        
        // Helicopter type management
        this.typeManager = new HelicopterTypeManager();
        this.advancedPhysics = new AdvancedHelicopterPhysics(this);
        
        // Physics constants (will be overridden by helicopter type)
        this.gravity = -9.81;
        this.mass = 800; // kg (Matrix Scout default)
        this.maxLift = 12000; // N (Matrix Scout default)
        this.drag = 0.98;
        this.responsiveness = 2.5; // Matrix Scout default
        
        // Apply initial helicopter type
        this.applyHelicopterType();
        
        this.createHelicopter();
        this.setupCamera();
    }
    
    createHelicopter() {
        // Use type manager to create helicopter mesh
        const helicopterMesh = this.typeManager.createHelicopterMesh(this.scene);
        this.helicopter = helicopterMesh.group;
        this.fuselage = helicopterMesh.fuselage;
        this.mainRotor = helicopterMesh.rotor;
        
        // Add tail rotor (not type-specific yet)
        const rotorMaterial = new THREE.MeshPhongMaterial({ 
            color: this.typeManager.currentType.visual.rotorColor,
            transparent: true,
            opacity: 0.7 
        });
        
        const tailRotorGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.2);
        this.tailRotor = new THREE.Group();
        this.tailRotor.position.set(-3, 0.5, 0);
        
        for (let i = 0; i < 3; i++) {
            const tailBlade = new THREE.Mesh(tailRotorGeometry, rotorMaterial);
            tailBlade.rotation.x = (i * Math.PI * 2) / 3;
            this.tailRotor.add(tailBlade);
        }
        
        this.helicopter.add(this.tailRotor);
        
        // Landing skids
        const skidGeometry = new THREE.BoxGeometry(1, 0.1, 4);
        const skidMaterial = new THREE.MeshPhongMaterial({ 
            color: this.typeManager.currentType.visual.fuselageColor 
        });
        
        const scale = this.typeManager.currentType.specs.rotorRadius / 4.0;
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.position.set(0.8 * scale, -0.8 * scale, 0);
        this.helicopter.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.position.set(-0.8 * scale, -0.8 * scale, 0);
        this.helicopter.add(rightSkid);
        
        // Matrix-style glow effect with type-specific intensity
        const glowGeometry = new THREE.SphereGeometry(
            this.typeManager.currentType.specs.rotorRadius * 1.2, 
            16, 
            8
        );
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.typeManager.currentType.visual.fuselageColor,
            transparent: true,
            opacity: this.typeManager.currentType.visual.glowIntensity * 0.1,
            side: THREE.BackSide
        });
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.helicopter.add(this.glow);
        
        this.scene.add(this.helicopter);
        
        // Add lighting with type-specific color
        const helicopterLight = new THREE.PointLight(
            this.typeManager.currentType.visual.fuselageColor, 
            this.typeManager.currentType.visual.glowIntensity, 
            100
        );
        helicopterLight.position.set(0, 2 * scale, 0);
        this.helicopter.add(helicopterLight);
        
        this.rotorSpeed = 0;
        this.tailRotorSpeed = 0;
    }
    
    setupCamera() {
        this.cameraOffset = new THREE.Vector3(0, 5, 15);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
    }
    
    applyHelicopterType() {
        this.typeManager.applyTypeModifiers(this.advancedPhysics);
        const specs = this.typeManager.getCurrentSpecs();
        const handling = this.typeManager.getCurrentHandling();
        
        // Update physics parameters
        this.mass = specs.mass;
        this.maxLift = specs.maxLift;
        this.responsiveness = handling.responsiveness;
    }
    
    changeHelicopterType(typeId) {
        if (this.typeManager.selectHelicopter(typeId)) {
            // Remove old helicopter
            this.scene.remove(this.helicopter);
            
            // Apply new type settings
            this.applyHelicopterType();
            
            // Create new helicopter visual
            this.createHelicopter();
            
            console.log(`🚁 Switched to ${this.typeManager.currentType.name}`);
            return true;
        }
        return false;
    }
    
    update(deltaTime, controls) {
        this.processControls(controls, deltaTime);
        this.updatePhysics(deltaTime);
        this.updateVisuals(deltaTime);
        this.updateCamera();
    }
    
    processControls(controls, deltaTime) {
        const sensitivity = this.responsiveness * deltaTime;
        
        // Collective (altitude control)
        if (controls.space) {
            this.collective = Math.min(this.collective + sensitivity, 1);
        } else if (controls.shift) {
            this.collective = Math.max(this.collective - sensitivity, 0);
        } else {
            // Auto-hover tendency
            this.collective = THREE.MathUtils.lerp(this.collective, 0.5, deltaTime);
        }
        
        // Cyclic controls (pitch and roll)
        if (controls.w) {
            this.cyclicPitch = Math.min(this.cyclicPitch + sensitivity, 1);
        } else if (controls.s) {
            this.cyclicPitch = Math.max(this.cyclicPitch - sensitivity, -1);
        } else {
            this.cyclicPitch = THREE.MathUtils.lerp(this.cyclicPitch, 0, deltaTime * 2);
        }
        
        if (controls.a) {
            this.cyclicRoll = Math.min(this.cyclicRoll + sensitivity, 1);
        } else if (controls.d) {
            this.cyclicRoll = Math.max(this.cyclicRoll - sensitivity, -1);
        } else {
            this.cyclicRoll = THREE.MathUtils.lerp(this.cyclicRoll, 0, deltaTime * 2);
        }
        
        // Pedal (yaw control)
        if (controls.q) {
            this.pedal = Math.min(this.pedal + sensitivity, 1);
        } else if (controls.e) {
            this.pedal = Math.max(this.pedal - sensitivity, -1);
        } else {
            this.pedal = THREE.MathUtils.lerp(this.pedal, 0, deltaTime * 2);
        }
    }
    
    updatePhysics(deltaTime) {
        // Use advanced physics for realistic flight dynamics
        this.advancedPhysics.update(deltaTime);
        
        // Gravity is now handled by advanced physics, remove duplicate
        
        // Cyclic forces (enhanced by helicopter type)
        const handling = this.typeManager.getCurrentHandling();
        const forwardForce = -this.cyclicPitch * 5 * handling.agility;
        const sidewardForce = this.cyclicRoll * 5 * handling.agility;
        
        // Apply forces in helicopter's local coordinate system
        const helicopterForward = new THREE.Vector3(0, 0, 1);
        helicopterForward.applyEuler(this.rotation);
        
        const helicopterRight = new THREE.Vector3(1, 0, 0);
        helicopterRight.applyEuler(this.rotation);
        
        this.velocity.add(helicopterForward.multiplyScalar(forwardForce * deltaTime));
        this.velocity.add(helicopterRight.multiplyScalar(sidewardForce * deltaTime));
        
        // Apply drag with type-specific efficiency
        this.velocity.multiplyScalar(this.drag * handling.efficiency);
        
        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        // Enhanced angular velocity with stability
        this.angularVelocity.y = this.pedal * 2;
        
        // Type-specific stabilization
        const stabilizationRate = deltaTime * handling.stability * 2;
        this.angularVelocity.x = THREE.MathUtils.lerp(
            this.angularVelocity.x, 
            -this.cyclicPitch * 0.3, 
            stabilizationRate
        );
        this.angularVelocity.z = THREE.MathUtils.lerp(
            this.angularVelocity.z, 
            this.cyclicRoll * 0.3, 
            stabilizationRate
        );
        
        // Update rotation
        this.rotation.x += this.angularVelocity.x * deltaTime;
        this.rotation.y += this.angularVelocity.y * deltaTime;
        this.rotation.z += this.angularVelocity.z * deltaTime;
        
        // Advanced ground interaction is handled by AdvancedHelicopterPhysics
        
        // Update helicopter position and rotation
        this.helicopter.position.copy(this.position);
        this.helicopter.rotation.copy(this.rotation);
    }
    
    updateVisuals(deltaTime) {
        // Rotor spinning
        this.rotorSpeed = THREE.MathUtils.lerp(this.rotorSpeed, this.collective * 20, deltaTime * 5);
        this.tailRotorSpeed = THREE.MathUtils.lerp(this.tailRotorSpeed, Math.abs(this.pedal) * 30 + 10, deltaTime * 5);
        
        if (this.mainRotor) {
            this.mainRotor.rotation.y += this.rotorSpeed * deltaTime;
        }
        
        if (this.tailRotor) {
            this.tailRotor.rotation.x += this.tailRotorSpeed * deltaTime;
        }
        
        // Glow effect intensity based on movement
        const speed = this.velocity.length();
        if (this.glow) {
            this.glow.material.opacity = 0.05 + (speed * 0.01);
        }
    }
    
    updateCamera() {
        // Third-person camera following helicopter
        const desiredPosition = this.position.clone().add(this.cameraOffset);
        this.camera.position.lerp(desiredPosition, 0.05);
        
        // Look at helicopter
        this.camera.lookAt(this.position);
    }
    
    getFlightData() {
        const advancedStatus = this.advancedPhysics.getFlightStatus();
        return {
            altitude: Math.round(this.position.y),
            speed: Math.round(this.velocity.length() * 3.6), // m/s to km/h
            collective: this.collective,
            position: this.position.clone(),
            helicopter: {
                type: this.typeManager.currentType.name,
                id: this.typeManager.currentType.id
            },
            advancedStatus: advancedStatus,
            controls: {
                collective: this.collective.toFixed(2),
                cyclicPitch: this.cyclicPitch.toFixed(2),
                cyclicRoll: this.cyclicRoll.toFixed(2),
                pedal: this.pedal.toFixed(2)
            }
        };
    }
    
    // Weather control methods
    setWind(direction, speed, turbulence = 0) {
        this.advancedPhysics.setWind(direction, speed, turbulence);
    }
    
    engageAutorotation() {
        this.advancedPhysics.engageAutorotation();
    }
    
    // Type management methods
    getAvailableHelicopterTypes() {
        return this.typeManager.getSelectionData();
    }
    
    unlockHelicopterType(typeId) {
        return this.typeManager.unlockType(typeId);
    }
    
    getCurrentHelicopterType() {
        return {
            ...this.typeManager.currentType,
            unlockedTypes: this.typeManager.unlockedTypes
        };
    }
}