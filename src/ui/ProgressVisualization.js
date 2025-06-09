import * as THREE from 'three';

/**
 * Progress Visualization System
 * Creates beautiful visual representations of meditation progress and insights
 */
export class ProgressVisualization {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Progress tracking
        this.totalInsights = 0;
        this.zonesVisited = new Set();
        this.meditationMinutes = 0;
        this.flightMastery = 0;
        
        // Visual elements
        this.progressSphere = null;
        this.insightParticles = [];
        this.achievementRings = [];
        this.progressTrail = [];
        
        // Animation state
        this.animationTime = 0;
        this.pulseIntensity = 0;
        
        this.createProgressVisualization();
    }
    
    createProgressVisualization() {
        this.createProgressSphere();
        this.createInsightParticleSystem();
        this.createAchievementRings();
        this.createProgressTrail();
    }
    
    createProgressSphere() {
        // Central sphere that grows and changes color with progress
        const geometry = new THREE.SphereGeometry(2, 32, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x004400,
            transparent: true,
            opacity: 0.7,
            emissive: 0x002200,
            emissiveIntensity: 0.3,
            wireframe: false
        });
        
        this.progressSphere = new THREE.Mesh(geometry, material);
        this.progressSphere.position.set(0, 100, 0); // High in the sky
        this.scene.add(this.progressSphere);
        
        // Add inner glow effect
        const glowGeometry = new THREE.SphereGeometry(2.5, 16, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.progressSphere.add(glow);
    }
    
    createInsightParticleSystem() {
        // Floating particles that represent individual insights
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position around progress sphere
            const radius = 5 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.cos(phi) + 100;
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            // Color based on insight type (will be updated dynamically)
            colors[i3] = 0.0;     // R
            colors[i3 + 1] = 1.0; // G
            colors[i3 + 2] = 0.0; // B
            
            sizes[i] = Math.random() * 2 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.insightParticles = new THREE.Points(geometry, material);
        this.scene.add(this.insightParticles);
    }
    
    createAchievementRings() {
        // Rings that appear when achievements are unlocked
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.RingGeometry(3 + i * 0.5, 3.5 + i * 0.5, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.set(0, 100, 0);
            ring.rotation.x = Math.PI / 2;
            
            this.achievementRings.push(ring);
            this.scene.add(ring);
        }
    }
    
    createProgressTrail() {
        // Trail that follows the helicopter and shows meditation path
        const trailLength = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(trailLength * 3);
        const colors = new Float32Array(trailLength * 3);
        
        // Initialize with zeros
        for (let i = 0; i < trailLength * 3; i++) {
            positions[i] = 0;
            colors[i] = i % 3 === 1 ? 1.0 : 0.0; // Green color
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            linewidth: 2
        });
        
        this.progressTrail = new THREE.Line(geometry, material);
        this.scene.add(this.progressTrail);
        
        this.trailPositions = [];
    }
    
    update(deltaTime, helicopterPosition, meditationData) {
        this.animationTime += deltaTime;
        
        // Update progress sphere
        this.updateProgressSphere(meditationData);
        
        // Update insight particles
        this.updateInsightParticles(deltaTime);
        
        // Update achievement rings
        this.updateAchievementRings(deltaTime);
        
        // Update progress trail
        this.updateProgressTrail(helicopterPosition, meditationData);
    }
    
    updateProgressSphere(meditationData) {
        if (!this.progressSphere) return;
        
        // Calculate overall progress (0-1)
        const totalProgress = this.calculateTotalProgress(meditationData);
        
        // Update sphere size based on progress
        const baseScale = 1 + totalProgress * 2;
        const pulseScale = 1 + Math.sin(this.animationTime * 2) * 0.1;
        this.progressSphere.scale.setScalar(baseScale * pulseScale);
        
        // Update color based on progress
        const hue = totalProgress * 0.3; // Green to cyan progression
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        this.progressSphere.material.color.copy(color);
        this.progressSphere.material.emissive.copy(color).multiplyScalar(0.3);
        
        // Rotate sphere
        this.progressSphere.rotation.y += 0.01;
        this.progressSphere.rotation.x += 0.005;
    }
    
    updateInsightParticles(deltaTime) {
        if (!this.insightParticles) return;
        
        const positions = this.insightParticles.geometry.attributes.position.array;
        const colors = this.insightParticles.geometry.attributes.color.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Orbit around progress sphere
            const time = this.animationTime + i * 0.01;
            const radius = 5 + Math.sin(time * 0.5) * 3;
            
            positions[i] = radius * Math.cos(time * 0.3);
            positions[i + 2] = radius * Math.sin(time * 0.3);
            
            // Vertical oscillation
            positions[i + 1] = 100 + Math.sin(time * 0.7) * 2;
            
            // Color cycling
            const colorPhase = (time * 0.5) % (Math.PI * 2);
            colors[i] = Math.max(0, Math.sin(colorPhase)); // R
            colors[i + 1] = 0.5 + Math.sin(colorPhase + Math.PI / 2) * 0.5; // G
            colors[i + 2] = Math.max(0, Math.sin(colorPhase + Math.PI)); // B
        }
        
        this.insightParticles.geometry.attributes.position.needsUpdate = true;
        this.insightParticles.geometry.attributes.color.needsUpdate = true;
    }
    
    updateAchievementRings(deltaTime) {
        this.achievementRings.forEach((ring, index) => {
            // Fade in/out based on recent achievements
            const targetOpacity = this.shouldShowRing(index) ? 0.5 : 0;
            ring.material.opacity = THREE.MathUtils.lerp(
                ring.material.opacity, 
                targetOpacity, 
                deltaTime * 2
            );
            
            // Rotate rings
            ring.rotation.z += (0.01 + index * 0.005);
            
            // Scale pulsing
            const pulseScale = 1 + Math.sin(this.animationTime * 3 + index) * 0.1;
            ring.scale.setScalar(pulseScale);
        });
    }
    
    updateProgressTrail(helicopterPosition, meditationData) {
        if (!helicopterPosition || !this.progressTrail) return;
        
        // Add current position to trail
        this.trailPositions.push({
            x: helicopterPosition.x,
            y: helicopterPosition.y,
            z: helicopterPosition.z,
            meditation: meditationData?.isActive || false
        });
        
        // Limit trail length
        const maxTrailLength = 100;
        if (this.trailPositions.length > maxTrailLength) {
            this.trailPositions.shift();
        }
        
        // Update trail geometry
        const positions = this.progressTrail.geometry.attributes.position.array;
        const colors = this.progressTrail.geometry.attributes.color.array;
        
        for (let i = 0; i < this.trailPositions.length; i++) {
            const pos = this.trailPositions[i];
            const i3 = i * 3;
            
            if (i3 < positions.length) {
                positions[i3] = pos.x;
                positions[i3 + 1] = pos.y;
                positions[i3 + 2] = pos.z;
                
                // Color based on meditation state
                const alpha = i / this.trailPositions.length; // Fade out older positions
                colors[i3] = pos.meditation ? 1.0 * alpha : 0.3 * alpha; // R
                colors[i3 + 1] = 1.0 * alpha; // G
                colors[i3 + 2] = pos.meditation ? 1.0 * alpha : 0.3 * alpha; // B
            }
        }
        
        this.progressTrail.geometry.attributes.position.needsUpdate = true;
        this.progressTrail.geometry.attributes.color.needsUpdate = true;
    }
    
    calculateTotalProgress(meditationData) {
        // Combine various progress metrics
        const insightProgress = Math.min(this.totalInsights / 20, 1); // Max 20 insights
        const zoneProgress = this.zonesVisited.size / 4; // 4 main zones
        const timeProgress = Math.min(this.meditationMinutes / 60, 1); // 1 hour
        const masteryProgress = this.flightMastery;
        
        return (insightProgress + zoneProgress + timeProgress + masteryProgress) / 4;
    }
    
    shouldShowRing(ringIndex) {
        const totalProgress = this.calculateTotalProgress();
        return totalProgress > (ringIndex + 1) * 0.2; // Show ring every 20% progress
    }
    
    addInsight(insightType, zone) {
        this.totalInsights++;
        if (zone) {
            this.zonesVisited.add(zone);
        }
        
        // Create visual effect for new insight
        this.createInsightEffect(insightType);
        
        console.log(`💡 New insight gained: ${insightType} (Total: ${this.totalInsights})`);
    }
    
    createInsightEffect(insightType) {
        // Create a burst of particles for new insight
        const burstGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const burstMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 1
        });
        
        for (let i = 0; i < 10; i++) {
            const particle = new THREE.Mesh(burstGeometry, burstMaterial.clone());
            particle.position.copy(this.progressSphere.position);
            
            // Random velocity
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            this.scene.add(particle);
            
            // Animate particle
            const startTime = this.animationTime;
            const animate = () => {
                const elapsed = this.animationTime - startTime;
                if (elapsed > 2) {
                    this.scene.remove(particle);
                    return;
                }
                
                particle.position.add(velocity.clone().multiplyScalar(0.01));
                particle.material.opacity = 1 - (elapsed / 2);
                particle.scale.setScalar(1 + elapsed);
                
                requestAnimationFrame(animate);
            };
            animate();
        }
    }
    
    updateMeditationTime(minutes) {
        this.meditationMinutes = minutes;
    }
    
    updateFlightMastery(mastery) {
        this.flightMastery = Math.max(0, Math.min(1, mastery));
    }
    
    getProgressSummary() {
        return {
            totalInsights: this.totalInsights,
            zonesVisited: Array.from(this.zonesVisited),
            meditationMinutes: this.meditationMinutes,
            flightMastery: this.flightMastery,
            overallProgress: this.calculateTotalProgress()
        };
    }
    
    // Special effects for achievements
    triggerAchievementEffect(achievementName) {
        console.log(`🏆 Achievement unlocked: ${achievementName}`);
        
        // Create golden ring effect
        const ringGeometry = new THREE.RingGeometry(1, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const achievementRing = new THREE.Mesh(ringGeometry, ringMaterial);
        achievementRing.position.copy(this.progressSphere.position);
        achievementRing.rotation.x = Math.PI / 2;
        
        this.scene.add(achievementRing);
        
        // Animate achievement ring
        const startTime = this.animationTime;
        const animate = () => {
            const elapsed = this.animationTime - startTime;
            if (elapsed > 3) {
                this.scene.remove(achievementRing);
                return;
            }
            
            achievementRing.scale.setScalar(1 + elapsed * 2);
            achievementRing.material.opacity = 0.8 * (1 - elapsed / 3);
            achievementRing.rotation.z += 0.05;
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    setVisible(visible) {
        if (this.progressSphere) this.progressSphere.visible = visible;
        if (this.insightParticles) this.insightParticles.visible = visible;
        if (this.progressTrail) this.progressTrail.visible = visible;
        
        this.achievementRings.forEach(ring => {
            ring.visible = visible;
        });
    }
}