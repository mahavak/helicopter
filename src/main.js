import * as THREE from 'three';
import { HelicopterController } from './helicopter/HelicopterController.js';
import { MatrixEnvironment } from './environment/MatrixEnvironment.js';
import { DigitalRainEffect } from './effects/DigitalRainEffect.js';
import { UIManager } from './ui/UIManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { ZoneInteractionManager } from './zones/ZoneInteractionManager.js';
import { DayNightCycle } from './environment/DayNightCycle.js';
import { WeatherSystem } from './environment/WeatherSystem.js';
import { HelicopterCustomization } from './helicopter/HelicopterCustomization.js';
import { AchievementSystem } from './systems/AchievementSystem.js';

class MatrixHelicopterGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.helicopter = null;
        this.environment = null;
        this.digitalRain = null;
        this.ui = null;
        this.audioManager = null;
        this.zoneManager = null;
        this.dayNightCycle = null;
        this.weatherSystem = null;
        this.customization = null;
        this.achievementSystem = null;
        
        this.clock = new THREE.Clock();
        this.isLoaded = false;
        
        this.init();
    }
    
    async init() {
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        
        // Initialize game components
        this.helicopter = new HelicopterController(this.scene, this.camera);
        this.environment = new MatrixEnvironment(this.scene);
        this.digitalRain = new DigitalRainEffect(this.scene);
        this.ui = new UIManager();
        
        // Initialize audio system
        this.audioManager = new AudioManager();
        this.camera.add(this.audioManager.listener);
        
        // Initialize day/night cycle
        this.dayNightCycle = new DayNightCycle(this.scene);
        
        // Initialize weather system
        this.weatherSystem = new WeatherSystem(this.scene, this.dayNightCycle);
        
        // Initialize helicopter customization
        this.customization = new HelicopterCustomization(this.helicopter);
        
        // Initialize zone interaction system
        this.zoneManager = new ZoneInteractionManager(this.scene, this.helicopter, this.audioManager);
        
        // Initialize achievement system
        this.achievementSystem = new AchievementSystem(
            this.helicopter, 
            this.zoneManager, 
            this.audioManager, 
            this.customization
        );
        
        // Setup controls
        this.setupControls();
        
        // Start loading
        await this.loadAssets();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        document.getElementById('flight-info').style.display = 'block';
        
        this.isLoaded = true;
        
        // Start render loop
        this.animate();
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 500, 2000);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            10000
        );
        this.camera.position.set(0, 10, 20);
    }
    
    setupControls() {
        const keys = {
            w: false, s: false,
            a: false, d: false,
            q: false, e: false,
            shift: false, space: false
        };
        
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'KeyW': keys.w = true; break;
                case 'KeyS': keys.s = true; break;
                case 'KeyA': keys.a = true; break;
                case 'KeyD': keys.d = true; break;
                case 'KeyQ': keys.q = true; break;
                case 'KeyE': keys.e = true; break;
                case 'ShiftLeft': keys.shift = true; break;
                case 'Space': keys.space = true; event.preventDefault(); break;
                case 'KeyR': 
                    // Toggle reality layer
                    if (this.ui) this.ui.toggleRealityLayer();
                    if (this.achievementSystem) this.achievementSystem.onRealityToggle();
                    break;
                case 'KeyM':
                    // Toggle audio mute
                    if (this.audioManager) {
                        this.audioManager.setMasterVolume(
                            this.audioManager.masterVolume > 0 ? 0 : 0.7
                        );
                    }
                    break;
            }
            
            // Resume audio context on first user interaction
            if (this.audioManager) {
                this.audioManager.resumeAudioContext();
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch(event.code) {
                case 'KeyW': keys.w = false; break;
                case 'KeyS': keys.s = false; break;
                case 'KeyA': keys.a = false; break;
                case 'KeyD': keys.d = false; break;
                case 'KeyQ': keys.q = false; break;
                case 'KeyE': keys.e = false; break;
                case 'ShiftLeft': keys.shift = false; break;
                case 'Space': keys.space = false; break;
            }
        });
        
        this.controls = keys;
    }
    
    async loadAssets() {
        // Simulate loading time for now
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                document.getElementById('loading-progress').textContent = 
                    Math.min(Math.floor(progress), 100) + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
    
    animate() {
        if (!this.isLoaded) return;
        
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // Update game components
        if (this.helicopter) {
            this.helicopter.update(deltaTime, this.controls);
        }
        
        if (this.environment) {
            this.environment.update(deltaTime);
        }
        
        if (this.digitalRain) {
            this.digitalRain.update(deltaTime);
        }
        
        // Update audio based on helicopter state
        if (this.audioManager && this.helicopter) {
            this.audioManager.updateHelicopterAudio(this.helicopter.getFlightData());
            this.audioManager.update(deltaTime);
        }
        
        // Update day/night cycle
        if (this.dayNightCycle) {
            this.dayNightCycle.update(deltaTime);
        }
        
        // Update weather system
        if (this.weatherSystem) {
            this.weatherSystem.update(deltaTime);
        }
        
        // Update helicopter customization
        if (this.customization) {
            this.customization.update(deltaTime);
        }
        
        // Update zone interactions
        if (this.zoneManager && this.helicopter) {
            this.zoneManager.update(deltaTime, this.helicopter.position);
        }
        
        // Update achievement system
        if (this.achievementSystem && this.helicopter) {
            const flightData = this.helicopter.getFlightData();
            const currentZone = this.zoneManager ? this.zoneManager.activeZone : null;
            this.achievementSystem.update(deltaTime, flightData, currentZone);
        }
        
        if (this.ui && this.helicopter) {
            this.ui.update(this.helicopter.getFlightData());
            this.ui.updateTimeInfo(this.dayNightCycle);
            this.ui.updateWeatherInfo(this.weatherSystem);
            this.ui.updateThemeInfo(this.customization);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game
new MatrixHelicopterGame();