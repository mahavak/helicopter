import * as THREE from 'three';

export class DayNightCycle {
    constructor(scene) {
        this.scene = scene;
        
        // Time settings
        this.currentTime = 0; // 0-1 representing 24 hours
        this.daySpeed = 0.0001; // How fast days pass (adjustable for meditation)
        this.paused = false;
        
        // Lighting components
        this.directionalLight = null;
        this.ambientLight = null;
        this.matrixSun = null;
        this.skyGeometry = null;
        this.skyMaterial = null;
        this.skyMesh = null;
        
        // Matrix-specific elements
        this.codeIntensity = 0.7;
        this.digitalNoiseLevel = 0.3;
        this.realityStability = 1.0;
        
        // Time phases with philosophical meanings
        this.timePhases = {
            digitalDawn: { start: 0.0, end: 0.15, name: "Digital Dawn", meaning: "Awakening of Consciousness" },
            matrixMorning: { start: 0.15, end: 0.35, name: "Matrix Morning", meaning: "Clarity of Perception" },
            codeNoon: { start: 0.35, end: 0.65, name: "Code Noon", meaning: "Peak Understanding" },
            virtualEvening: { start: 0.65, end: 0.85, name: "Virtual Evening", meaning: "Reflection Period" },
            digitalNight: { start: 0.85, end: 1.0, name: "Digital Night", meaning: "Deep Contemplation" }
        };
        
        this.initializeDayNightSystem();
    }
    
    initializeDayNightSystem() {
        // Create matrix sky sphere
        this.createMatrixSky();
        
        // Initialize lighting
        this.setupMatrixLighting();
        
        // Create digital sun
        this.createDigitalSun();
        
        // Set initial time (start at dawn for philosophical awakening)
        this.setTime(0.1);
    }
    
    createMatrixSky() {
        // Large sphere for sky
        this.skyGeometry = new THREE.SphereGeometry(2000, 32, 16);
        
        // Matrix-style sky material
        this.skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                codeIntensity: { value: this.codeIntensity },
                digitalNoise: { value: this.digitalNoiseLevel },
                dayPhase: { value: 0.1 },
                matrixColor: { value: new THREE.Color(0x003300) },
                voidColor: { value: new THREE.Color(0x000000) },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float codeIntensity;
                uniform float digitalNoise;
                uniform float dayPhase;
                uniform vec3 matrixColor;
                uniform vec3 voidColor;
                uniform vec2 resolution;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                
                // Matrix digital noise function
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }
                
                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }
                
                void main() {
                    vec2 st = vUv * 20.0;
                    
                    // Base sky color based on time of day
                    vec3 skyColor = mix(voidColor, matrixColor, dayPhase);
                    
                    // Add digital noise patterns
                    float n = noise(st + time * 0.1);
                    float codePattern = step(0.95, n) * codeIntensity;
                    
                    // Matrix rain effect in sky
                    float rain = random(vec2(floor(st.x), floor(st.y + time * 5.0)));
                    rain = step(0.99, rain) * 0.3;
                    
                    // Combine effects
                    vec3 finalColor = skyColor + codePattern * matrixColor + rain * matrixColor;
                    
                    // Add subtle breathing effect
                    float breathe = sin(time * 0.5) * 0.1 + 0.9;
                    finalColor *= breathe;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        this.skyMesh = new THREE.Mesh(this.skyGeometry, this.skyMaterial);
        this.scene.add(this.skyMesh);
    }
    
    setupMatrixLighting() {
        // Find existing lights or create new ones
        this.directionalLight = this.scene.children.find(child => 
            child.type === 'DirectionalLight'
        );
        
        this.ambientLight = this.scene.children.find(child => 
            child.type === 'AmbientLight'
        );
        
        if (!this.directionalLight) {
            this.directionalLight = new THREE.DirectionalLight(0x00ff00, 0.5);
            this.directionalLight.position.set(100, 200, 100);
            this.directionalLight.castShadow = true;
            this.scene.add(this.directionalLight);
        }
        
        if (!this.ambientLight) {
            this.ambientLight = new THREE.AmbientLight(0x003300, 0.3);
            this.scene.add(this.ambientLight);
        }
    }
    
    createDigitalSun() {
        // Matrix-style digital sun
        const sunGeometry = new THREE.SphereGeometry(50, 16, 8);
        const sunMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                intensity: { value: 1.0 },
                codeFlow: { value: 0.5 }
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
                uniform float intensity;
                uniform float codeFlow;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(vUv, center);
                    
                    // Pulsing core
                    float core = 1.0 - smoothstep(0.0, 0.3, dist);
                    core *= (sin(time * 2.0) * 0.2 + 0.8);
                    
                    // Digital rays
                    float rays = sin(atan(vUv.y - 0.5, vUv.x - 0.5) * 8.0 + time) * 0.5 + 0.5;
                    rays *= (1.0 - smoothstep(0.3, 0.8, dist));
                    
                    vec3 color = vec3(0.0, core + rays * 0.5, 0.0) * intensity;
                    
                    gl_FragColor = vec4(color, core + rays * 0.3);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        this.matrixSun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.matrixSun);
    }
    
    setTime(newTime) {
        this.currentTime = Math.max(0, Math.min(1, newTime));
        this.updateTimeEffects();
    }
    
    updateTimeEffects() {
        const time = this.currentTime;
        
        // Update sun position (circular path)
        const sunAngle = time * Math.PI * 2 - Math.PI / 2; // Start from east
        const sunDistance = 800;
        const sunHeight = Math.sin(sunAngle) * 400 + 200;
        
        if (this.matrixSun) {
            this.matrixSun.position.set(
                Math.cos(sunAngle) * sunDistance,
                Math.max(sunHeight, -200), // Allow sun to go below horizon
                Math.sin(sunAngle) * sunDistance * 0.3
            );
            
            // Update sun material
            this.matrixSun.material.uniforms.time.value = time * 10;
            this.matrixSun.material.uniforms.intensity.value = this.getSunIntensity(time);
        }
        
        // Update directional light (follows sun)
        if (this.directionalLight) {
            this.directionalLight.position.copy(this.matrixSun.position);
            this.directionalLight.intensity = this.getSunIntensity(time) * 0.8;
            
            // Color temperature changes through day
            const lightColor = this.getLightColor(time);
            this.directionalLight.color.setHex(lightColor);
        }
        
        // Update ambient light
        if (this.ambientLight) {
            this.ambientLight.intensity = this.getAmbientIntensity(time);
            this.ambientLight.color.setHex(this.getAmbientColor(time));
        }
        
        // Update sky shader
        if (this.skyMaterial) {
            this.skyMaterial.uniforms.time.value = time * 5;
            this.skyMaterial.uniforms.dayPhase.value = this.getDayPhase(time);
            this.skyMaterial.uniforms.codeIntensity.value = this.getCodeIntensity(time);
        }
    }
    
    getSunIntensity(time) {
        // Sun intensity curve (0 at night, 1 at noon)
        const sunHeight = Math.sin(time * Math.PI * 2 - Math.PI / 2);
        return Math.max(0, sunHeight * 0.8 + 0.2);
    }
    
    getLightColor(time) {
        // Matrix green variations through the day
        const phase = this.getCurrentPhase(time);
        const colors = {
            digitalDawn: 0x004400,     // Deep green dawn
            matrixMorning: 0x006600,   // Bright morning green
            codeNoon: 0x00ff00,        // Pure matrix green
            virtualEvening: 0x008800,  // Warm evening green
            digitalNight: 0x002200     // Dark night green
        };
        return colors[phase] || 0x00ff00;
    }
    
    getAmbientIntensity(time) {
        // Ambient light intensity (never completely dark for Matrix feel)
        const baseIntensity = 0.1;
        const dayIntensity = 0.4;
        const dayPhase = this.getDayPhase(time);
        return baseIntensity + dayPhase * dayIntensity;
    }
    
    getAmbientColor(time) {
        // Ambient color shifts subtly
        const phase = this.getCurrentPhase(time);
        const colors = {
            digitalDawn: 0x001100,
            matrixMorning: 0x002200,
            codeNoon: 0x003300,
            virtualEvening: 0x002200,
            digitalNight: 0x001100
        };
        return colors[phase] || 0x002200;
    }
    
    getDayPhase(time) {
        // Smooth day/night curve (0 = night, 1 = day)
        return (Math.sin(time * Math.PI * 2 - Math.PI / 2) + 1) / 2;
    }
    
    getCodeIntensity(time) {
        // Code rain intensity varies with time
        const baseIntensity = 0.3;
        const nightBoost = 0.7;
        const dayPhase = this.getDayPhase(time);
        return baseIntensity + (1 - dayPhase) * nightBoost;
    }
    
    getCurrentPhase(time) {
        for (const [key, phase] of Object.entries(this.timePhases)) {
            if (time >= phase.start && time < phase.end) {
                return key;
            }
        }
        return 'digitalNight'; // Default to night
    }
    
    getCurrentPhaseInfo() {
        const phase = this.getCurrentPhase(this.currentTime);
        return {
            name: this.timePhases[phase].name,
            meaning: this.timePhases[phase].meaning,
            time: this.currentTime,
            timeString: this.getTimeString()
        };
    }
    
    getTimeString() {
        const totalMinutes = Math.round(this.currentTime * 24 * 60);
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Control methods
    pauseTime() {
        this.paused = true;
    }
    
    resumeTime() {
        this.paused = false;
    }
    
    setDaySpeed(speed) {
        this.daySpeed = speed;
    }
    
    skipToPhase(phaseName) {
        if (this.timePhases[phaseName]) {
            const phase = this.timePhases[phaseName];
            this.setTime(phase.start + (phase.end - phase.start) / 2);
        }
    }
    
    // Meditation-specific methods
    enableMeditationMode() {
        // Slow time significantly for contemplation
        this.setDaySpeed(0.00001);
        this.skipToPhase('digitalDawn'); // Best for meditation
    }
    
    update(deltaTime) {
        if (!this.paused) {
            this.currentTime += this.daySpeed * deltaTime;
            if (this.currentTime > 1) {
                this.currentTime = 0; // Loop back to start of day
            }
            this.updateTimeEffects();
        }
        
        // Continuously update time-based shader uniforms
        if (this.skyMaterial) {
            this.skyMaterial.uniforms.time.value += deltaTime * 0.1;
        }
        
        if (this.matrixSun && this.matrixSun.material.uniforms) {
            this.matrixSun.material.uniforms.time.value += deltaTime;
        }
    }
    
    // Get current atmospheric data for other systems
    getAtmosphericData() {
        return {
            timeOfDay: this.currentTime,
            phase: this.getCurrentPhaseInfo(),
            lightIntensity: this.getSunIntensity(this.currentTime),
            codeIntensity: this.getCodeIntensity(this.currentTime),
            realityStability: this.realityStability
        };
    }
}