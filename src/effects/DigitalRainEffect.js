import * as THREE from 'three';

export class DigitalRainEffect {
    constructor(scene) {
        this.scene = scene;
        this.rainDrops = [];
        this.numDrops = 200;
        
        this.createDigitalRain();
    }
    
    createDigitalRain() {
        // Create material for rain drops
        this.rainMaterial = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true
        });
        
        // Create geometry for rain drops
        this.rainGeometry = new THREE.BufferGeometry();
        
        const positions = [];
        const colors = [];
        const velocities = [];
        
        for (let i = 0; i < this.numDrops; i++) {
            // Random position in a large area around the scene
            positions.push(
                (Math.random() - 0.5) * 1000, // x
                Math.random() * 500 + 100,    // y (start high)
                (Math.random() - 0.5) * 1000  // z
            );
            
            // Green color with random intensity
            const intensity = Math.random() * 0.5 + 0.5;
            colors.push(0, intensity, 0);
            
            // Random fall velocity
            velocities.push(Math.random() * 50 + 20);
        }
        
        this.rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.rainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        // Store velocities for animation
        this.velocities = velocities;
        
        // Create points mesh
        this.rainPoints = new THREE.Points(this.rainGeometry, this.rainMaterial);
        this.scene.add(this.rainPoints);
        
        // Create additional matrix code trails
        this.createCodeTrails();
    }
    
    createCodeTrails() {
        this.codeTrails = [];
        const numTrails = 50;
        
        for (let i = 0; i < numTrails; i++) {
            const trail = this.createSingleCodeTrail();
            this.codeTrails.push(trail);
            this.scene.add(trail);
        }
    }
    
    createSingleCodeTrail() {
        // Create a vertical line of matrix characters
        const trailLength = 20;
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 512;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#00ff00';
        context.font = '16px Courier New';
        context.textAlign = 'center';
        
        for (let i = 0; i < trailLength; i++) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            const opacity = (trailLength - i) / trailLength;
            context.globalAlpha = opacity;
            context.fillText(char, canvas.width / 2, i * 25 + 20);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // Random position
        sprite.position.set(
            (Math.random() - 0.5) * 800,
            Math.random() * 300 + 200,
            (Math.random() - 0.5) * 800
        );
        
        sprite.scale.set(10, 40, 1);
        
        // Animation data
        sprite.userData = {
            fallSpeed: Math.random() * 30 + 20,
            originalY: sprite.position.y,
            resetHeight: Math.random() * 200 + 400
        };
        
        return sprite;
    }
    
    update(deltaTime) {
        // Update rain drops
        const positions = this.rainGeometry.attributes.position.array;
        
        for (let i = 0; i < this.numDrops; i++) {
            const index = i * 3;
            
            // Update Y position (falling)
            positions[index + 1] -= this.velocities[i] * deltaTime;
            
            // Reset if fallen below ground
            if (positions[index + 1] < 0) {
                positions[index + 1] = Math.random() * 200 + 400;
                positions[index] = (Math.random() - 0.5) * 1000;
                positions[index + 2] = (Math.random() - 0.5) * 1000;
            }
        }
        
        this.rainGeometry.attributes.position.needsUpdate = true;
        
        // Update code trails
        this.codeTrails.forEach(trail => {
            trail.position.y -= trail.userData.fallSpeed * deltaTime;
            
            if (trail.position.y < -50) {
                trail.position.y = trail.userData.resetHeight;
                trail.position.x = (Math.random() - 0.5) * 800;
                trail.position.z = (Math.random() - 0.5) * 800;
                
                // Regenerate trail texture with new characters
                this.regenerateTrailTexture(trail);
            }
        });
    }
    
    regenerateTrailTexture(trail) {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const trailLength = 20;
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 512;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#00ff00';
        context.font = '16px Courier New';
        context.textAlign = 'center';
        
        for (let i = 0; i < trailLength; i++) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            const opacity = (trailLength - i) / trailLength;
            context.globalAlpha = opacity;
            context.fillText(char, canvas.width / 2, i * 25 + 20);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        trail.material.map = texture;
        trail.material.needsUpdate = true;
    }
}