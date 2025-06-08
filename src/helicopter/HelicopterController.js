import * as THREE from 'three';

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
        
        // Physics constants
        this.gravity = -9.81;
        this.mass = 1000; // kg
        this.maxLift = 15000; // N
        this.drag = 0.98;
        this.responsiveness = 2.0;
        
        this.createHelicopter();
        this.setupCamera();
    }
    
    createHelicopter() {
        this.helicopter = new THREE.Group();
        
        // Main body (fuselage)
        const fuselageGeometry = new THREE.CapsuleGeometry(0.8, 4, 8, 16);
        const fuselageMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x003300,
            transparent: true,
            opacity: 0.9,
            emissive: 0x001100
        });
        this.fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        this.fuselage.rotation.z = Math.PI / 2;
        this.helicopter.add(this.fuselage);
        
        // Main rotor
        const rotorBladeGeometry = new THREE.BoxGeometry(8, 0.1, 0.3);
        const rotorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x004400,
            transparent: true,
            opacity: 0.7 
        });
        
        this.mainRotor = new THREE.Group();
        this.mainRotor.position.y = 1.5;
        
        // Create 4 rotor blades
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(rotorBladeGeometry, rotorMaterial);
            blade.rotation.z = (i * Math.PI) / 2;
            this.mainRotor.add(blade);
        }
        
        this.helicopter.add(this.mainRotor);
        
        // Tail rotor
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
        const skidMaterial = new THREE.MeshPhongMaterial({ color: 0x002200 });
        
        const leftSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        leftSkid.position.set(0.8, -0.8, 0);
        this.helicopter.add(leftSkid);
        
        const rightSkid = new THREE.Mesh(skidGeometry, skidMaterial);
        rightSkid.position.set(-0.8, -0.8, 0);
        this.helicopter.add(rightSkid);
        
        // Matrix-style glow effect
        const glowGeometry = new THREE.SphereGeometry(5, 16, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.helicopter.add(this.glow);
        
        this.scene.add(this.helicopter);
        
        // Add lighting
        const helicopterLight = new THREE.PointLight(0x00ff00, 1, 100);
        helicopterLight.position.set(0, 2, 0);
        this.helicopter.add(helicopterLight);
        
        this.rotorSpeed = 0;
        this.tailRotorSpeed = 0;
    }
    
    setupCamera() {
        this.cameraOffset = new THREE.Vector3(0, 5, 15);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
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
        // Main rotor forces
        const lift = this.collective * this.maxLift;
        const liftForce = new THREE.Vector3(0, lift / this.mass, 0);
        
        // Gravity
        const gravityForce = new THREE.Vector3(0, this.gravity, 0);
        
        // Cyclic forces (simplified)
        const forwardForce = -this.cyclicPitch * 5;
        const sidewardForce = this.cyclicRoll * 5;
        
        // Apply forces in helicopter's local coordinate system
        const helicopterForward = new THREE.Vector3(0, 0, 1);
        helicopterForward.applyEuler(this.rotation);
        
        const helicopterRight = new THREE.Vector3(1, 0, 0);
        helicopterRight.applyEuler(this.rotation);
        
        // Update velocity
        this.velocity.add(liftForce.multiplyScalar(deltaTime));
        this.velocity.add(gravityForce.multiplyScalar(deltaTime));
        this.velocity.add(helicopterForward.multiplyScalar(forwardForce * deltaTime));
        this.velocity.add(helicopterRight.multiplyScalar(sidewardForce * deltaTime));
        
        // Apply drag
        this.velocity.multiplyScalar(this.drag);
        
        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        // Angular velocity from pedal input
        this.angularVelocity.y = this.pedal * 2;
        
        // Auto-stabilization
        this.angularVelocity.x = THREE.MathUtils.lerp(this.angularVelocity.x, -this.cyclicPitch * 0.3, deltaTime * 2);
        this.angularVelocity.z = THREE.MathUtils.lerp(this.angularVelocity.z, this.cyclicRoll * 0.3, deltaTime * 2);
        
        // Update rotation
        this.rotation.x += this.angularVelocity.x * deltaTime;
        this.rotation.y += this.angularVelocity.y * deltaTime;
        this.rotation.z += this.angularVelocity.z * deltaTime;
        
        // Ground collision (simplified)
        if (this.position.y < 2) {
            this.position.y = 2;
            this.velocity.y = Math.max(this.velocity.y, 0);
        }
        
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
        return {
            altitude: Math.round(this.position.y),
            speed: Math.round(this.velocity.length() * 3.6), // m/s to km/h
            collective: this.collective,
            position: this.position.clone()
        };
    }
}