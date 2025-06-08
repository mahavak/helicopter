import * as THREE from 'three';

export class WeatherSystem {
    constructor(scene, dayNightCycle) {
        this.scene = scene;
        this.dayNightCycle = dayNightCycle;
        
        // Weather state
        this.currentWeather = 'clear';
        this.weatherIntensity = 0;
        this.transitionTime = 0;
        this.weatherDuration = 0;
        this.nextWeatherChange = Math.random() * 300 + 120; // 2-7 minutes
        
        // Weather types with philosophical meanings
        this.weatherTypes = {
            clear: {
                name: 'Clear Matrix',
                meaning: 'Clarity of Mind',
                probability: 0.4,
                effects: []
            },
            digitalStorm: {
                name: 'Digital Storm',
                meaning: 'Chaos of Information',
                probability: 0.2,
                effects: ['lightning', 'codeRain', 'interference']
            },
            codeSnow: {
                name: 'Code Snow',
                meaning: 'Gentle Contemplation',
                probability: 0.15,
                effects: ['snowfall', 'silence', 'slowMotion']
            },
            dataMist: {
                name: 'Data Mist',
                meaning: 'Uncertainty and Mystery',
                probability: 0.15,
                effects: ['fog', 'whispers', 'distortion']
            },
            realityGlitch: {
                name: 'Reality Glitch',
                meaning: 'Questioning Existence',
                probability: 0.1,
                effects: ['glitches', 'temporal', 'paradox']
            }
        };
        
        // Weather effect objects
        this.weatherEffects = {
            digitalStorm: null,
            codeSnow: null,
            dataMist: null,
            realityGlitch: null
        };
        
        this.initializeWeatherSystem();
    }
    
    initializeWeatherSystem() {
        this.createDigitalStorm();
        this.createCodeSnow();
        this.createDataMist();
        this.createRealityGlitch();
    }
    
    createDigitalStorm() {
        const storm = {
            particles: null,
            lightning: [],
            interference: null,
            audio: null,
            active: false
        };
        
        // Heavy digital rain particles
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in large area
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = Math.random() * 800 + 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
            
            // Fast falling velocities
            velocities[i3] = (Math.random() - 0.5) * 10;
            velocities[i3 + 1] = -(Math.random() * 100 + 50);
            velocities[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Bright green colors with variation
            colors[i3] = 0;
            colors[i3 + 1] = Math.random() * 0.5 + 0.5;
            colors[i3 + 2] = 0;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        storm.particles = new THREE.Points(geometry, material);
        storm.velocities = velocities;
        
        // Create lightning system
        this.createLightningSystem(storm);
        
        this.weatherEffects.digitalStorm = storm;
    }
    
    createLightningSystem(storm) {
        // Digital lightning bolts
        for (let i = 0; i < 5; i++) {
            const lightningGeometry = new THREE.BufferGeometry();
            const points = [];
            
            // Create jagged lightning path
            const startY = 500;
            const endY = 0;
            const segments = 20;
            
            for (let j = 0; j <= segments; j++) {
                const progress = j / segments;
                const x = (Math.random() - 0.5) * 100 + Math.sin(progress * Math.PI) * 50;
                const y = startY - (progress * (startY - endY));
                const z = (Math.random() - 0.5) * 100;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            lightningGeometry.setFromPoints(points);
            
            const lightningMaterial = new THREE.LineBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0,
                linewidth: 3
            });
            
            const lightning = new THREE.Line(lightningGeometry, lightningMaterial);
            lightning.userData = {
                isLightning: true,
                flashTime: 0,
                nextFlash: Math.random() * 10 + 5
            };
            
            storm.lightning.push(lightning);
        }
    }
    
    createCodeSnow() {
        const snow = {
            particles: null,
            characters: '01アイウエオカキクケコサシスセソタチツテトナニヌネノ',
            sprites: [],
            active: false
        };
        
        // Create individual character sprites for snow
        const particleCount = 500;
        
        for (let i = 0; i < particleCount; i++) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 32;
            canvas.height = 32;
            
            context.fillStyle = 'rgba(0, 0, 0, 0)';
            context.fillRect(0, 0, 32, 32);
            
            const char = snow.characters[Math.floor(Math.random() * snow.characters.length)];
            context.fillStyle = '#00ff00';
            context.font = '20px Courier New';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(char, 16, 16);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.7
            });
            
            const sprite = new THREE.Sprite(material);
            sprite.position.set(
                (Math.random() - 0.5) * 1500,
                Math.random() * 600 + 200,
                (Math.random() - 0.5) * 1500
            );
            sprite.scale.set(5, 5, 1);
            
            sprite.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    -(Math.random() * 20 + 10),
                    (Math.random() - 0.5) * 2
                ),
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                originalY: sprite.position.y + Math.random() * 400
            };
            
            snow.sprites.push(sprite);
        }
        
        this.weatherEffects.codeSnow = snow;
    }
    
    createDataMist() {
        const mist = {
            fog: null,
            particles: null,
            whispers: [],
            active: false
        };
        
        // Volumetric fog effect
        const mistGeometry = new THREE.PlaneGeometry(2000, 1000);
        const mistMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                opacity: { value: 0.3 },
                density: { value: 0.5 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float opacity;
                uniform float density;
                varying vec2 vUv;
                
                float noise(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                void main() {
                    vec2 st = vUv * 5.0;
                    float n = noise(st + time * 0.1);
                    n = smoothstep(0.3, 0.7, n) * density;
                    
                    vec3 color = vec3(0.0, n * 0.3, 0.0);
                    gl_FragColor = vec4(color, n * opacity);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        mist.fog = new THREE.Mesh(mistGeometry, mistMaterial);
        mist.fog.position.y = 100;
        mist.fog.rotation.x = -Math.PI / 2;
        
        this.weatherEffects.dataMist = mist;
    }
    
    createRealityGlitch() {
        const glitch = {
            distortionField: null,
            glitchObjects: [],
            temporalEffects: [],
            active: false
        };
        
        // Reality distortion field
        const fieldGeometry = new THREE.SphereGeometry(800, 16, 8);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                glitchIntensity: { value: 0.5 }
            },
            vertexShader: `
                uniform float time;
                uniform float glitchIntensity;
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    
                    vec3 newPosition = position;
                    
                    // Random vertex displacement for glitch effect
                    float glitch = sin(position.x * 0.01 + time * 5.0) * 
                                  cos(position.y * 0.01 + time * 3.0) * 
                                  sin(position.z * 0.01 + time * 7.0);
                    
                    newPosition += normal * glitch * glitchIntensity * 20.0;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                
                void main() {
                    float intensity = sin(time * 10.0) * 0.5 + 0.5;
                    vec3 color = vec3(0.0, intensity * 0.2, 0.0);
                    gl_FragColor = vec4(color, 0.1);
                }
            `,
            transparent: true,
            wireframe: true
        });
        
        glitch.distortionField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        
        this.weatherEffects.realityGlitch = glitch;
    }
    
    changeWeather(newWeather, intensity = 1.0) {
        if (this.currentWeather === newWeather) return;
        
        console.log(`[WEATHER] Changing to ${this.weatherTypes[newWeather].name}: ${this.weatherTypes[newWeather].meaning}`);
        
        // Deactivate current weather
        this.deactivateWeather(this.currentWeather);
        
        // Activate new weather
        this.currentWeather = newWeather;
        this.weatherIntensity = intensity;
        this.weatherDuration = 0;
        this.transitionTime = 0;
        
        this.activateWeather(newWeather);
    }
    
    activateWeather(weatherType) {
        const weather = this.weatherEffects[weatherType];
        if (!weather) return;
        
        weather.active = true;
        
        switch (weatherType) {
            case 'digitalStorm':
                this.scene.add(weather.particles);
                weather.lightning.forEach(lightning => this.scene.add(lightning));
                break;
                
            case 'codeSnow':
                weather.sprites.forEach(sprite => this.scene.add(sprite));
                break;
                
            case 'dataMist':
                this.scene.add(weather.fog);
                // Increase scene fog
                this.scene.fog.density = 0.001;
                break;
                
            case 'realityGlitch':
                this.scene.add(weather.distortionField);
                break;
        }
    }
    
    deactivateWeather(weatherType) {
        const weather = this.weatherEffects[weatherType];
        if (!weather || !weather.active) return;
        
        weather.active = false;
        
        switch (weatherType) {
            case 'digitalStorm':
                if (weather.particles) this.scene.remove(weather.particles);
                weather.lightning.forEach(lightning => this.scene.remove(lightning));
                break;
                
            case 'codeSnow':
                weather.sprites.forEach(sprite => this.scene.remove(sprite));
                break;
                
            case 'dataMist':
                if (weather.fog) this.scene.remove(weather.fog);
                // Reset scene fog
                this.scene.fog.density = 0;
                break;
                
            case 'realityGlitch':
                if (weather.distortionField) this.scene.remove(weather.distortionField);
                break;
        }
    }
    
    updateDigitalStorm(deltaTime) {
        const storm = this.weatherEffects.digitalStorm;
        if (!storm.active) return;
        
        // Update storm particles
        const positions = storm.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Apply velocity
            positions[i] += storm.velocities[i] * deltaTime;
            positions[i + 1] += storm.velocities[i + 1] * deltaTime;
            positions[i + 2] += storm.velocities[i + 2] * deltaTime;
            
            // Reset particles that fall below ground
            if (positions[i + 1] < 0) {
                positions[i] = (Math.random() - 0.5) * 2000;
                positions[i + 1] = Math.random() * 200 + 600;
                positions[i + 2] = (Math.random() - 0.5) * 2000;
            }
        }
        
        storm.particles.geometry.attributes.position.needsUpdate = true;
        
        // Update lightning
        storm.lightning.forEach(lightning => {
            lightning.userData.flashTime += deltaTime;
            
            if (lightning.userData.flashTime >= lightning.userData.nextFlash) {
                // Flash lightning
                lightning.material.opacity = 1.0;
                setTimeout(() => {
                    lightning.material.opacity = 0;
                }, 100 + Math.random() * 200);
                
                lightning.userData.flashTime = 0;
                lightning.userData.nextFlash = Math.random() * 8 + 2;
            }
        });
    }
    
    updateCodeSnow(deltaTime) {
        const snow = this.weatherEffects.codeSnow;
        if (!snow.active) return;
        
        snow.sprites.forEach(sprite => {
            // Apply velocity
            sprite.position.add(sprite.userData.velocity.clone().multiplyScalar(deltaTime));
            
            // Gentle rotation
            sprite.material.rotation += sprite.userData.rotationSpeed;
            
            // Reset if fallen below ground
            if (sprite.position.y < 0) {
                sprite.position.y = sprite.userData.originalY;
                sprite.position.x = (Math.random() - 0.5) * 1500;
                sprite.position.z = (Math.random() - 0.5) * 1500;
            }
            
            // Gentle swaying motion
            sprite.position.x += Math.sin(Date.now() * 0.001 + sprite.position.z * 0.01) * 0.1;
        });
    }
    
    updateDataMist(deltaTime) {
        const mist = this.weatherEffects.dataMist;
        if (!mist.active) return;
        
        if (mist.fog && mist.fog.material.uniforms) {
            mist.fog.material.uniforms.time.value += deltaTime;
        }
    }
    
    updateRealityGlitch(deltaTime) {
        const glitch = this.weatherEffects.realityGlitch;
        if (!glitch.active) return;
        
        if (glitch.distortionField && glitch.distortionField.material.uniforms) {
            glitch.distortionField.material.uniforms.time.value += deltaTime;
        }
    }
    
    // Weather selection logic
    selectRandomWeather() {
        const atmosphericData = this.dayNightCycle.getAtmosphericData();
        const timeOfDay = atmosphericData.timeOfDay;
        
        // Adjust probabilities based on time of day
        let weights = {};
        
        for (const [type, data] of Object.entries(this.weatherTypes)) {
            weights[type] = data.probability;
            
            // Storms more likely at dusk/dawn
            if (type === 'digitalStorm') {
                if (timeOfDay > 0.8 || timeOfDay < 0.2) {
                    weights[type] *= 2;
                }
            }
            
            // Snow more likely at night
            if (type === 'codeSnow') {
                if (timeOfDay > 0.7 || timeOfDay < 0.3) {
                    weights[type] *= 1.5;
                }
            }
            
            // Mist more likely in early morning
            if (type === 'dataMist') {
                if (timeOfDay > 0.05 && timeOfDay < 0.25) {
                    weights[type] *= 2;
                }
            }
        }
        
        // Weighted random selection
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [type, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                return type;
            }
        }
        
        return 'clear';
    }
    
    update(deltaTime) {
        // Update weather change timer
        this.nextWeatherChange -= deltaTime;
        this.weatherDuration += deltaTime;
        this.transitionTime += deltaTime;
        
        // Check for weather change
        if (this.nextWeatherChange <= 0) {
            const newWeather = this.selectRandomWeather();
            this.changeWeather(newWeather);
            this.nextWeatherChange = Math.random() * 300 + 60; // 1-6 minutes
        }
        
        // Update active weather effects
        this.updateDigitalStorm(deltaTime);
        this.updateCodeSnow(deltaTime);
        this.updateDataMist(deltaTime);
        this.updateRealityGlitch(deltaTime);
    }
    
    // Public control methods
    forceWeather(weatherType, duration = null) {
        this.changeWeather(weatherType);
        if (duration) {
            setTimeout(() => {
                this.changeWeather('clear');
            }, duration * 1000);
        }
    }
    
    getCurrentWeatherInfo() {
        return {
            type: this.currentWeather,
            name: this.weatherTypes[this.currentWeather].name,
            meaning: this.weatherTypes[this.currentWeather].meaning,
            intensity: this.weatherIntensity,
            duration: this.weatherDuration
        };
    }
    
    // Meditation mode: clear, calm weather
    enableMeditationWeather() {
        this.forceWeather('clear');
        this.nextWeatherChange = 999999; // No weather changes during meditation
    }
    
    disableMeditationWeather() {
        this.nextWeatherChange = 30; // Resume normal weather patterns
    }
}