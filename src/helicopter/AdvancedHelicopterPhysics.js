import * as THREE from 'three';

/**
 * Advanced Helicopter Physics System
 * Implements realistic aerodynamics including ground effect, vortex ring state,
 * autorotation, and weather interactions for a more immersive flight experience
 */
export class AdvancedHelicopterPhysics {
    constructor(helicopterController) {
        this.controller = helicopterController;
        
        // Aerodynamic constants
        this.airDensity = 1.225; // kg/m³ at sea level
        this.rotorRadius = 4.0; // meters
        this.rotorArea = Math.PI * this.rotorRadius * this.rotorRadius;
        this.bladeTwist = -10; // degrees
        this.solidity = 0.07; // rotor solidity ratio
        
        // Advanced physics parameters
        this.groundEffectHeight = this.rotorRadius * 1.5;
        this.vortexRingBoundary = 800; // fpm descent rate
        this.retreatingBladeStallLimit = 0.92; // percentage of speed of sound
        
        // Torque and gyroscopic effects
        this.mainRotorTorque = 0;
        this.gyroscopicPrecession = new THREE.Vector3();
        
        // Environmental factors
        this.windVector = new THREE.Vector3();
        this.turbulenceIntensity = 0;
        this.densityAltitude = 0;
        
        // Autorotation parameters
        this.autorotationRPM = 0;
        this.autorotationEngaged = false;
        
        // Ground interaction
        this.groundContact = false;
        this.skidFriction = 0.7;
        this.groundNormal = new THREE.Vector3(0, 1, 0);
    }
    
    /**
     * Calculate lift force with advanced aerodynamics
     */
    calculateLiftForce(collective, rpm, velocity) {
        const baseRPM = 400;
        const actualRPM = rpm || baseRPM;
        
        // Blade tip velocity
        const tipVelocity = (2 * Math.PI * this.rotorRadius * actualRPM) / 60;
        
        // Angle of attack from collective
        const angleOfAttack = collective * 15; // degrees
        
        // Calculate thrust coefficient
        const thrustCoefficient = this.solidity * 0.5 * this.getLiftCoefficient(angleOfAttack);
        
        // Basic lift calculation
        let lift = thrustCoefficient * this.airDensity * this.rotorArea * tipVelocity * tipVelocity;
        
        // Apply ground effect
        lift *= this.calculateGroundEffect();
        
        // Apply density altitude correction
        lift *= this.getDensityCorrection();
        
        // Reduce lift in vortex ring state
        if (this.isInVortexRingState(velocity)) {
            lift *= 0.4; // Significant lift loss
        }
        
        return new THREE.Vector3(0, lift / this.controller.mass, 0);
    }
    
    /**
     * Calculate ground effect multiplier
     */
    calculateGroundEffect() {
        const altitude = this.controller.position.y;
        if (altitude > this.groundEffectHeight) return 1.0;
        
        // Ground effect increases lift when close to ground
        const effectRatio = altitude / this.groundEffectHeight;
        return 1.0 + (0.25 * (1.0 - effectRatio) * (1.0 - effectRatio));
    }
    
    /**
     * Check if helicopter is in vortex ring state
     */
    isInVortexRingState(velocity) {
        const descentRate = -velocity.y * 196.85; // Convert to fpm
        const forwardSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z) * 1.94; // knots
        
        // Vortex ring state occurs during rapid descent with low forward speed
        return descentRate > this.vortexRingBoundary && forwardSpeed < 30;
    }
    
    /**
     * Calculate torque effects from main rotor
     */
    calculateTorqueEffects(rpm, collective) {
        // Main rotor torque opposes rotation direction
        const torqueMagnitude = collective * rpm * 0.001;
        this.mainRotorTorque = -torqueMagnitude;
        
        // Apply anti-torque from tail rotor (controlled by pedals)
        const antiTorque = this.controller.pedal * torqueMagnitude * 1.2;
        
        return this.mainRotorTorque + antiTorque;
    }
    
    /**
     * Calculate gyroscopic precession effects
     */
    calculateGyroscopicEffects(angularVelocity, rpm) {
        const rotorAngularMomentum = rpm * 0.1;
        
        // Gyroscopic precession: applied torque creates perpendicular rotation
        this.gyroscopicPrecession.x = -angularVelocity.z * rotorAngularMomentum * 0.01;
        this.gyroscopicPrecession.z = angularVelocity.x * rotorAngularMomentum * 0.01;
        
        return this.gyroscopicPrecession;
    }
    
    /**
     * Advanced drag calculation including induced and profile drag
     */
    calculateAdvancedDrag(velocity, rpm) {
        const speed = velocity.length();
        const speedSquared = speed * speed;
        
        // Profile drag (form drag)
        const profileDrag = 0.02 * speedSquared;
        
        // Induced drag (increases at low speed/high angle of attack)
        const inducedDrag = this.controller.collective * 5 / (speed + 1);
        
        // Retreating blade stall drag
        const muRatio = speed / (rpm * this.rotorRadius * 0.1);
        const stallDrag = muRatio > this.retreatingBladeStallLimit ? 
            (muRatio - this.retreatingBladeStallLimit) * 100 : 0;
        
        const totalDrag = profileDrag + inducedDrag + stallDrag;
        
        // Apply drag opposite to velocity direction
        if (speed > 0) {
            return velocity.clone().normalize().multiplyScalar(-totalDrag);
        }
        return new THREE.Vector3();
    }
    
    /**
     * Wind and turbulence effects
     */
    applyWindEffects(deltaTime) {
        // Base wind with gusts
        const gustCycle = Date.now() * 0.001;
        const gustX = Math.sin(gustCycle * 0.7) * this.turbulenceIntensity;
        const gustZ = Math.cos(gustCycle * 0.5) * this.turbulenceIntensity;
        
        // Apply wind to velocity
        const windEffect = new THREE.Vector3(
            this.windVector.x + gustX,
            this.windVector.y,
            this.windVector.z + gustZ
        );
        
        return windEffect.multiplyScalar(deltaTime);
    }
    
    /**
     * Enhanced ground collision and interaction
     */
    handleGroundInteraction(position, velocity, rotation) {
        const groundHeight = this.getGroundHeight(position);
        const skidHeight = 1.0; // Height of skids below center
        
        if (position.y - skidHeight <= groundHeight) {
            this.groundContact = true;
            
            // Prevent penetration
            position.y = groundHeight + skidHeight;
            
            // Ground friction
            velocity.x *= (1 - this.skidFriction * 0.016);
            velocity.z *= (1 - this.skidFriction * 0.016);
            
            // Bounce on hard landing
            if (velocity.y < -2) {
                velocity.y *= -0.3; // Some energy lost
            } else {
                velocity.y = Math.max(velocity.y, 0);
            }
            
            // Level out on ground (gradually)
            rotation.x *= 0.95;
            rotation.z *= 0.95;
        } else {
            this.groundContact = false;
        }
    }
    
    /**
     * Get ground height at position (can be enhanced with terrain)
     */
    getGroundHeight(position) {
        // For now, flat ground at y=0
        // Can be enhanced with terrain sampling
        return 0;
    }
    
    /**
     * Autorotation simulation for engine failure
     */
    simulateAutorotation(collective, velocity) {
        if (!this.autorotationEngaged) return 0;
        
        // In autorotation, rotor is driven by upward airflow
        const verticalSpeed = -velocity.y;
        const forwardSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
        
        // Optimal autorotation at specific descent rate and forward speed
        const optimalDescentRate = 15; // m/s
        const optimalForwardSpeed = 30; // m/s
        
        const descentEfficiency = 1 - Math.abs(verticalSpeed - optimalDescentRate) / optimalDescentRate;
        const speedEfficiency = Math.min(forwardSpeed / optimalForwardSpeed, 1);
        
        // Calculate rotor RPM from airflow
        this.autorotationRPM = 300 + (descentEfficiency * speedEfficiency * 200);
        
        // Reduced collective authority in autorotation
        return this.autorotationRPM * (0.3 + collective * 0.7);
    }
    
    /**
     * Get lift coefficient based on angle of attack
     */
    getLiftCoefficient(angleOfAttack) {
        // Simplified lift curve
        const alpha = angleOfAttack * Math.PI / 180;
        const cl = 2 * Math.PI * alpha;
        
        // Stall at high angles
        if (angleOfAttack > 15) {
            return cl * (1 - (angleOfAttack - 15) / 10);
        }
        
        return cl;
    }
    
    /**
     * Density altitude correction for lift
     */
    getDensityCorrection() {
        // Density decreases with altitude
        const altitudeFactor = Math.exp(-this.controller.position.y / 8000);
        return altitudeFactor;
    }
    
    /**
     * Set wind conditions
     */
    setWind(direction, speed, turbulence = 0) {
        this.windVector.set(
            Math.sin(direction) * speed,
            0,
            Math.cos(direction) * speed
        );
        this.turbulenceIntensity = turbulence;
    }
    
    /**
     * Enable autorotation mode
     */
    engageAutorotation() {
        this.autorotationEngaged = true;
        console.log("⚠️ Autorotation engaged - find a safe landing spot!");
    }
    
    /**
     * Main physics update incorporating all advanced effects
     */
    update(deltaTime) {
        const controller = this.controller;
        
        // Calculate advanced lift
        const lift = this.calculateLiftForce(
            controller.collective,
            controller.rotorSpeed * 60,
            controller.velocity
        );
        
        // Calculate torque and gyroscopic effects
        const torque = this.calculateTorqueEffects(
            controller.rotorSpeed * 60,
            controller.collective
        );
        
        const gyro = this.calculateGyroscopicEffects(
            controller.angularVelocity,
            controller.rotorSpeed * 60
        );
        
        // Calculate advanced drag
        const drag = this.calculateAdvancedDrag(
            controller.velocity,
            controller.rotorSpeed * 60
        );
        
        // Apply wind effects
        const wind = this.applyWindEffects(deltaTime);
        
        // Update angular velocity with torque and gyroscopic effects
        if (isFinite(torque)) {
            controller.angularVelocity.y += torque * deltaTime;
        }
        if (isFinite(gyro.x) && isFinite(gyro.y) && isFinite(gyro.z)) {
            controller.angularVelocity.add(gyro.multiplyScalar(deltaTime));
        }
        
        // Apply gravity
        const gravity = new THREE.Vector3(0, -9.81, 0);
        controller.velocity.add(gravity.multiplyScalar(deltaTime));
        
        // Apply all forces with safety checks
        if (isFinite(lift.x) && isFinite(lift.y) && isFinite(lift.z)) {
            controller.velocity.add(lift.multiplyScalar(deltaTime));
        }
        if (isFinite(drag.x) && isFinite(drag.y) && isFinite(drag.z)) {
            controller.velocity.add(drag.multiplyScalar(deltaTime));
        }
        if (isFinite(wind.x) && isFinite(wind.y) && isFinite(wind.z)) {
            controller.velocity.add(wind);
        }
        
        // Safety check for velocity
        if (!isFinite(controller.velocity.x)) controller.velocity.x = 0;
        if (!isFinite(controller.velocity.y)) controller.velocity.y = 0;
        if (!isFinite(controller.velocity.z)) controller.velocity.z = 0;
        
        // Handle ground interaction
        this.handleGroundInteraction(
            controller.position,
            controller.velocity,
            controller.rotation
        );
        
        // Autorotation if engaged
        if (this.autorotationEngaged) {
            controller.rotorSpeed = this.simulateAutorotation(
                controller.collective,
                controller.velocity
            ) / 60;
        }
    }
    
    /**
     * Get flight status for UI
     */
    getFlightStatus() {
        return {
            groundEffect: this.calculateGroundEffect() > 1.0,
            vortexRingState: this.isInVortexRingState(this.controller.velocity),
            autorotation: this.autorotationEngaged,
            groundContact: this.groundContact,
            torque: this.mainRotorTorque.toFixed(2),
            windSpeed: this.windVector.length().toFixed(1),
            densityAltitude: this.densityAltitude.toFixed(0)
        };
    }
}