/**
 * Matrix Helicopter Test Flight System
 * Comprehensive guided tour showcasing all simulation features
 */

import * as THREE from 'three';

export class TestFlight {
    constructor(game, helicopter, controller, ui, weather, dayNight, meditation, achievements) {
        this.game = game;
        this.helicopter = helicopter;
        this.controller = controller;
        this.ui = ui;
        this.weather = weather;
        this.dayNight = dayNight;
        this.meditation = meditation;
        this.achievements = achievements;
        
        this.isActive = false;
        this.currentStep = 0;
        this.stepStartTime = 0;
        this.originalCameraPosition = new THREE.Vector3();
        this.originalHelicopterPosition = new THREE.Vector3();
        this.flightPath = [];
        this.flightPathIndex = 0;
        this.autoFlightSpeed = 0.5;
        
        this.steps = [
            {
                name: "Welcome to Matrix Helicopter",
                duration: 5000,
                description: "Experience the most advanced helicopter meditation simulator",
                action: () => this.setupInitialConditions(),
                helperText: "Welcome! This test flight will showcase all simulation features."
            },
            {
                name: "Basic Flight Controls",
                duration: 8000,
                description: "Learn the helicopter controls and physics",
                action: () => this.demonstrateBasicControls(),
                helperText: "W/S: Up/Down | A/D: Roll | Q/E: Pitch | Shift/Space: Yaw"
            },
            {
                name: "Advanced Physics - Ground Effect",
                duration: 6000,
                description: "Experience ground effect physics",
                action: () => this.demonstrateGroundEffect(),
                helperText: "Notice increased lift efficiency near the ground"
            },
            {
                name: "Weather System - Digital Storm",
                duration: 10000,
                description: "Fly through a digital storm with rain and lightning",
                action: () => this.demonstrateWeatherStorm(),
                helperText: "Experience challenging weather conditions and visual effects"
            },
            {
                name: "Helicopter Types - Quantum Paradox",
                duration: 8000,
                description: "Switch to the experimental Quantum Paradox helicopter",
                action: () => this.demonstrateQuantumHelicopter(),
                helperText: "Press '4' - Notice the quantum uncertainty effects"
            },
            {
                name: "Philosophical Zone - Cave of Shadows",
                duration: 12000,
                description: "Visit the Cave of Shadows for reality distortion",
                action: () => this.visitCaveOfShadows(),
                helperText: "Explore how perception shapes reality"
            },
            {
                name: "Meditation Mode",
                duration: 15000,
                description: "Enter meditation mode with breathing guide",
                action: () => this.demonstrateMeditation(),
                helperText: "Press 'Enter' to meditate | Use breathing guide for focus"
            },
            {
                name: "Autorotation Emergency",
                duration: 10000,
                description: "Experience emergency autorotation landing",
                action: () => this.demonstrateAutorotation(),
                helperText: "Press 'F' for autorotation - Emergency powerless flight"
            },
            {
                name: "Observer's Paradox Zone",
                duration: 12000,
                description: "Visit the quantum consciousness zone",
                action: () => this.visitObserversParadox(),
                helperText: "Objects exist only when you observe them"
            },
            {
                name: "Day/Night Cycle",
                duration: 8000,
                description: "Experience the philosophical time progression",
                action: () => this.demonstrateDayNight(),
                helperText: "Watch the digital sun's journey and changing meanings"
            },
            {
                name: "Code Snow Weather",
                duration: 8000,
                description: "Peaceful flight through falling code characters",
                action: () => this.demonstrateCodeSnow(),
                helperText: "Experience the tranquil beauty of digital snow"
            },
            {
                name: "Garden of Forking Paths",
                duration: 12000,
                description: "Explore choice and possibility",
                action: () => this.visitGardenOfPaths(),
                helperText: "See ghost images of possible alternative paths"
            },
            {
                name: "Heavy Lifter Experience",
                duration: 8000,
                description: "Switch to the Code Lifter for maximum stability",
                action: () => this.demonstrateHeavyLifter(),
                helperText: "Press '3' - Feel the stability and grounding power"
            },
            {
                name: "Ship of Theseus Identity",
                duration: 10000,
                description: "Question identity and continuity",
                action: () => this.visitShipOfTheseus(),
                helperText: "Watch your helicopter transform - are you still you?"
            },
            {
                name: "Zen Glider Autorotation",
                duration: 10000,
                description: "Master the art of powerless flight",
                action: () => this.demonstrateZenGlider(),
                helperText: "Press '5' then 'F' - The ultimate in mindful flying"
            },
            {
                name: "Achievement Unlocks",
                duration: 8000,
                description: "Unlock themes and special content",
                action: () => this.demonstrateAchievements(),
                helperText: "Your journey unlocks new helicopter themes and abilities"
            },
            {
                name: "Full Feature Showcase",
                duration: 15000,
                description: "Experience all features simultaneously",
                action: () => this.grandFinale(),
                helperText: "The complete Matrix Helicopter experience"
            },
            {
                name: "Test Flight Complete",
                duration: 5000,
                description: "Thank you for flying with Matrix Helicopter",
                action: () => this.completeFlight(),
                helperText: "Press 'Escape' anytime to take manual control. Enjoy exploring!"
            }
        ];
        
        this.setupUI();
    }
    
    setupUI() {
        try {
            // Create test flight UI panel
            this.panel = document.createElement('div');
        this.panel.id = 'test-flight-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: rgba(0, 20, 0, 0.9);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 20px;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            display: none;
        `;
        
        this.panel.innerHTML = `
            <div id="test-flight-header">
                <h3 style="margin: 0 0 10px 0; text-align: center; color: #ffffff;">
                    🚁 Matrix Helicopter Test Flight
                </h3>
                <div id="test-flight-progress" style="background: #001100; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
                    <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #00ff00, #88ff88); width: 0%; transition: width 0.5s;"></div>
                </div>
            </div>
            <div id="test-flight-content">
                <h4 id="step-name" style="margin: 0 0 8px 0; color: #88ff88;"></h4>
                <p id="step-description" style="margin: 0 0 12px 0; font-size: 14px;"></p>
                <div id="helper-text" style="background: rgba(0, 40, 0, 0.7); padding: 10px; border-radius: 5px; font-size: 12px; border-left: 3px solid #00ff00;"></div>
                <div id="step-timer" style="text-align: center; margin-top: 10px; font-size: 12px; color: #88ff88;"></div>
            </div>
            <div id="test-flight-controls" style="text-align: center; margin-top: 15px;">
                <button id="pause-test-flight" style="background: #004400; color: #00ff00; border: 1px solid #00ff00; padding: 8px 16px; border-radius: 5px; margin: 0 5px; cursor: pointer;">Pause</button>
                <button id="skip-step" style="background: #004400; color: #00ff00; border: 1px solid #00ff00; padding: 8px 16px; border-radius: 5px; margin: 0 5px; cursor: pointer;">Skip</button>
                <button id="end-test-flight" style="background: #440000; color: #ff4444; border: 1px solid #ff4444; padding: 8px 16px; border-radius: 5px; margin: 0 5px; cursor: pointer;">End</button>
            </div>
        `;
        
        document.body.appendChild(this.panel);
        
        // Add control listeners
        document.getElementById('pause-test-flight').addEventListener('click', () => this.togglePause());
        document.getElementById('skip-step').addEventListener('click', () => this.skipStep());
        document.getElementById('end-test-flight').addEventListener('click', () => this.endFlight());
        
        // Add start button to main UI
        this.startButton = document.createElement('button');
        this.startButton.textContent = '🚁 Start Test Flight';
        this.startButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 40, 0, 0.9);
            color: #00ff00;
            border: 2px solid #00ff00;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            cursor: pointer;
            z-index: 999;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
            transition: all 0.3s;
        `;
        
        this.startButton.addEventListener('mouseover', () => {
            this.startButton.style.background = 'rgba(0, 60, 0, 0.95)';
            this.startButton.style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.5)';
        });
        
        this.startButton.addEventListener('mouseout', () => {
            this.startButton.style.background = 'rgba(0, 40, 0, 0.9)';
            this.startButton.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
        });
        
        this.startButton.addEventListener('click', () => this.startTestFlight());
        document.body.appendChild(this.startButton);
        } catch (error) {
            console.warn('TestFlight: UI setup failed:', error.message);
            // Create minimal fallback
            this.panel = { style: { display: 'none' } };
            this.startButton = { style: { display: 'block' }, addEventListener: () => {} };
        }
    }
    
    startTestFlight() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        this.stepStartTime = Date.now();
        
        // Hide start button and show panel
        this.startButton.style.display = 'none';
        this.panel.style.display = 'block';
        
        // Store original states
        this.originalCameraPosition.copy(this.game.camera.position);
        this.originalHelicopterPosition.copy(this.helicopter.position);
        
        // Start first step
        this.executeCurrentStep();
        this.updateUI();
        
        console.log('🚁 Matrix Helicopter Test Flight Started');
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        const currentTime = Date.now();
        const stepElapsed = currentTime - this.stepStartTime;
        const currentStepData = this.steps[this.currentStep];
        
        // Update timer display
        const remaining = Math.max(0, currentStepData.duration - stepElapsed);
        document.getElementById('step-timer').textContent = 
            `Time remaining: ${(remaining / 1000).toFixed(1)}s`;
        
        // Update progress bar
        const progress = Math.min(100, (stepElapsed / currentStepData.duration) * 100);
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        // Check if step is complete
        if (stepElapsed >= currentStepData.duration) {
            this.nextStep();
        }
        
        // Update any active flight path following
        this.updateAutoFlight(deltaTime);
    }
    
    executeCurrentStep() {
        const step = this.steps[this.currentStep];
        console.log(`🎯 Executing step: ${step.name}`);
        
        try {
            step.action();
        } catch (error) {
            console.error('Error executing test flight step:', error);
        }
        
        this.stepStartTime = Date.now();
    }
    
    updateUI() {
        const step = this.steps[this.currentStep];
        const overallProgress = ((this.currentStep + 1) / this.steps.length) * 100;
        
        try {
            const stepNameEl = document.getElementById('step-name');
            const stepDescEl = document.getElementById('step-description');
            const helperTextEl = document.getElementById('helper-text');
            
            if (stepNameEl) stepNameEl.textContent = step.name;
            if (stepDescEl) stepDescEl.textContent = step.description;
            if (helperTextEl) helperTextEl.textContent = step.helperText;
        } catch (error) {
            console.warn('TestFlight: UI update failed:', error.message);
        }
        
        // Update overall progress in header
        try {
            const progressText = `Step ${this.currentStep + 1} of ${this.steps.length} (${overallProgress.toFixed(0)}%)`;
            const progressEl = document.getElementById('test-flight-progress');
            if (progressEl) progressEl.title = progressText;
        } catch (error) {
            console.warn('TestFlight: Progress update failed:', error.message);
        }
    }
    
    nextStep() {
        this.currentStep++;
        
        if (this.currentStep >= this.steps.length) {
            this.endFlight();
            return;
        }
        
        this.executeCurrentStep();
        this.updateUI();
    }
    
    skipStep() {
        this.nextStep();
    }
    
    togglePause() {
        // Implementation for pause functionality
        const button = document.getElementById('pause-test-flight');
        if (button.textContent === 'Pause') {
            button.textContent = 'Resume';
            this.stepStartTime = Date.now() - (Date.now() - this.stepStartTime); // Pause timer
        } else {
            button.textContent = 'Pause';
            this.stepStartTime = Date.now(); // Reset timer
        }
    }
    
    endFlight() {
        this.isActive = false;
        this.panel.style.display = 'none';
        this.startButton.style.display = 'block';
        
        console.log('🎌 Test Flight Completed');
    }
    
    // Flight path automation
    createFlightPath(waypoints) {
        this.flightPath = waypoints;
        this.flightPathIndex = 0;
    }
    
    updateAutoFlight(deltaTime) {
        if (this.flightPath.length === 0) return;
        
        const target = this.flightPath[this.flightPathIndex];
        if (!target) return;
        
        const distance = this.helicopter.position.distanceTo(target);
        
        if (distance < 10) {
            this.flightPathIndex++;
            if (this.flightPathIndex >= this.flightPath.length) {
                this.flightPath = [];
                return;
            }
        }
        
        // Smooth movement towards target
        const direction = target.clone().sub(this.helicopter.position).normalize();
        const moveDistance = this.autoFlightSpeed * deltaTime * 60;
        this.helicopter.position.add(direction.multiplyScalar(moveDistance));
    }
    
    // Step implementations
    setupInitialConditions() {
        // Reset to optimal starting conditions
        this.helicopter.position.set(0, 20, 0);
        this.helicopter.velocity.set(0, 0, 0);
        this.helicopter.angularVelocity.set(0, 0, 0);
        this.weather.setWeather('clear');
        this.dayNight.setTimeOfDay(0.3); // Morning
        
        // Ensure Matrix Scout is selected
        try {
            if (this.helicopter.typeManager) {
                this.helicopter.changeHelicopterType('matrix_scout');
            }
        } catch (error) {
            console.warn('TestFlight: Failed to set helicopter type:', error.message);
        }
    }
    
    demonstrateBasicControls() {
        // Gentle automated demonstration of controls
        this.createFlightPath([
            new THREE.Vector3(0, 25, 0),   // Up
            new THREE.Vector3(20, 25, 0),  // Right
            new THREE.Vector3(20, 25, 20), // Forward
            new THREE.Vector3(0, 20, 20),  // Left
            new THREE.Vector3(0, 20, 0)    // Back to center
        ]);
        
        // Add helpful UI indicators
        this.showControlHints();
    }
    
    demonstrateGroundEffect() {
        // Fly close to ground to show increased lift
        this.createFlightPath([
            new THREE.Vector3(0, 8, 0),   // Low altitude
            new THREE.Vector3(30, 8, 0),  // Forward at low altitude
            new THREE.Vector3(30, 25, 0), // Climb to show difference
            new THREE.Vector3(0, 25, 0)   // Return
        ]);
        
        // Trigger ground effect visualization
        if (this.helicopter.physics) {
            this.helicopter.physics.showGroundEffectIndicator = true;
        }
    }
    
    demonstrateWeatherStorm() {
        this.weather.setWeather('storm');
        this.createFlightPath([
            new THREE.Vector3(-50, 30, -50),
            new THREE.Vector3(50, 35, 50),
            new THREE.Vector3(0, 25, 0)
        ]);
        
        // Increase turbulence for demonstration
        if (this.weather.windIntensity !== undefined) {
            this.weather.windIntensity = 0.8;
        }
    }
    
    demonstrateQuantumHelicopter() {
        // Switch to Quantum Paradox helicopter
        if (this.helicopter.typeManager) {
            this.helicopter.changeHelicopterType('quantum_paradox');
        }
        
        // Fly erratically to show quantum uncertainty
        this.createFlightPath([
            new THREE.Vector3(25, 30, 25),
            new THREE.Vector3(-25, 20, 25),
            new THREE.Vector3(25, 40, -25),
            new THREE.Vector3(0, 25, 0)
        ]);
    }
    
    visitCaveOfShadows() {
        // Navigate to Cave of Shadows zone
        this.createFlightPath([
            new THREE.Vector3(-100, 30, 100),
            new THREE.Vector3(-200, 50, 200) // Cave of Shadows location
        ]);
        
        // Enhance reality distortion effects
        if (this.game.zones && this.game.zones.caveOfShadows) {
            this.game.zones.caveOfShadows.intensifyEffects();
        }
    }
    
    demonstrateMeditation() {
        // Position for stable meditation
        this.helicopter.position.set(0, 30, 0);
        this.helicopter.velocity.set(0, 0, 0);
        
        // Auto-enter meditation mode
        setTimeout(() => {
            if (this.meditation) {
                this.meditation.enterMeditation();
                this.meditation.startBreathingGuide();
            }
        }, 1000);
        
        // Exit meditation after demonstration
        setTimeout(() => {
            if (this.meditation && this.meditation.isActive) {
                this.meditation.exitMeditation();
            }
        }, 12000);
    }
    
    demonstrateAutorotation() {
        // Switch to Zen Glider for best autorotation
        if (this.helicopter.typeManager) {
            this.helicopter.changeHelicopterType('zen_glider');
        }
        
        // Start at altitude for autorotation demo
        this.helicopter.position.set(0, 100, 0);
        
        // Trigger autorotation
        setTimeout(() => {
            if (this.helicopter.engageAutorotation) {
                this.helicopter.engageAutorotation();
            }
        }, 2000);
    }
    
    visitObserversParadox() {
        this.createFlightPath([
            new THREE.Vector3(0, 60, 0),   // Observer's Paradox location
            new THREE.Vector3(0, 80, 0)    // Higher for better view
        ]);
        
        // Activate quantum observation effects
        if (this.game.zones && this.game.zones.observersParadox) {
            this.game.zones.observersParadox.activateQuantumEffects();
        }
    }
    
    demonstrateDayNight() {
        // Accelerate day/night cycle for demonstration
        if (this.dayNight.accelerateTime) {
            this.dayNight.accelerateTime(10); // 10x speed
        }
        
        // Stable hover to watch time pass
        this.helicopter.position.set(0, 50, 0);
        this.helicopter.velocity.set(0, 0, 0);
    }
    
    demonstrateCodeSnow() {
        this.weather.setWeather('snow');
        this.createFlightPath([
            new THREE.Vector3(-30, 40, -30),
            new THREE.Vector3(30, 40, 30),
            new THREE.Vector3(0, 30, 0)
        ]);
    }
    
    visitGardenOfPaths() {
        this.createFlightPath([
            new THREE.Vector3(100, 20, -100),
            new THREE.Vector3(200, 30, -200) // Garden of Forking Paths
        ]);
        
        // Activate choice visualization
        if (this.game.zones && this.game.zones.gardenOfPaths) {
            this.game.zones.gardenOfPaths.showChoiceGhosts();
        }
    }
    
    demonstrateHeavyLifter() {
        // Switch to Code Lifter
        if (this.helicopter.typeManager) {
            this.helicopter.changeHelicopterType('code_lifter');
        }
        
        // Demonstrate stability with steady flight
        this.createFlightPath([
            new THREE.Vector3(0, 25, 0),
            new THREE.Vector3(50, 25, 0),
            new THREE.Vector3(50, 25, 50),
            new THREE.Vector3(0, 25, 50),
            new THREE.Vector3(0, 25, 0)
        ]);
    }
    
    visitShipOfTheseus() {
        this.createFlightPath([
            new THREE.Vector3(-100, 60, -100) // Ship of Theseus location
        ]);
        
        // Trigger identity transformation
        if (this.game.zones && this.game.zones.shipOfTheseus) {
            this.game.zones.shipOfTheseus.startTransformation();
        }
    }
    
    demonstrateZenGlider() {
        // Switch to Zen Glider
        if (this.helicopter.typeManager) {
            this.helicopter.changeHelicopterType('zen_glider');
        }
        
        // High altitude start for long autorotation
        this.helicopter.position.set(0, 120, 0);
        
        setTimeout(() => {
            if (this.helicopter.engageAutorotation) {
                this.helicopter.engageAutorotation();
            }
        }, 1000);
    }
    
    demonstrateAchievements() {
        // Trigger several achievements
        if (this.achievements) {
            this.achievements.unlock('digital-awakening');
            this.achievements.unlock('philosophical-wanderer');
            this.achievements.unlock('storm-rider');
            
            // Show unlocked themes
            if (this.helicopter.themes) {
                this.helicopter.themes.unlockTheme('shadow-walker');
                this.helicopter.themes.unlockTheme('quantum-observer');
            }
        }
    }
    
    grandFinale() {
        // Combine multiple effects for spectacular finish
        this.weather.setWeather('glitch');
        this.dayNight.setTimeOfDay(0.8); // Evening
        
        // Switch to Quantum Paradox for maximum effect
        if (this.helicopter.typeManager) {
            this.helicopter.changeHelicopterType('quantum_paradox');
        }
        
        // Epic flight path through all zones
        this.createFlightPath([
            new THREE.Vector3(-200, 50, 200),  // Cave of Shadows
            new THREE.Vector3(200, 30, -200),  // Garden of Paths
            new THREE.Vector3(0, 80, 0),       // Observer's Paradox
            new THREE.Vector3(-100, 60, -100), // Ship of Theseus
            new THREE.Vector3(0, 100, 0)       // High finale
        ]);
        
        // Activate all visual effects
        if (this.game.effectsManager) {
            this.game.effectsManager.intensifyAllEffects();
        }
    }
    
    completeFlight() {
        // Reset to normal conditions
        this.weather.setWeather('clear');
        this.dayNight.setTimeOfDay(0.5); // Noon
        
        // Return to Matrix Scout
        if (this.helicopter.typeManager) {
            this.helicopter.changeHelicopterType('matrix_scout');
        }
        
        // Show completion message
        this.showCompletionMessage();
    }
    
    showControlHints() {
        // Add temporary control overlay
        const hints = document.createElement('div');
        hints.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 20px;
            background: rgba(0, 20, 0, 0.9);
            color: #00ff00;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            border: 1px solid #00ff00;
            z-index: 999;
        `;
        hints.innerHTML = `
            <div><strong>Flight Controls:</strong></div>
            <div>W/S: Collective (Up/Down)</div>
            <div>A/D: Cyclic Roll (Left/Right)</div>
            <div>Q/E: Cyclic Pitch (Forward/Back)</div>
            <div>Shift/Space: Yaw (Turn)</div>
        `;
        document.body.appendChild(hints);
        
        setTimeout(() => {
            if (hints.parentNode) {
                hints.parentNode.removeChild(hints);
            }
        }, 6000);
    }
    
    showCompletionMessage() {
        const completion = document.createElement('div');
        completion.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 40, 0, 0.95);
            color: #00ff00;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            font-family: 'Courier New', monospace;
            border: 2px solid #00ff00;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            z-index: 1001;
        `;
        completion.innerHTML = `
            <h2 style="margin: 0 0 15px 0; color: #ffffff;">🎉 Test Flight Complete!</h2>
            <p style="margin: 0 0 15px 0;">You've experienced all Matrix Helicopter features:</p>
            <ul style="text-align: left; margin: 0 0 20px 20px;">
                <li>5 Unique Helicopter Types</li>
                <li>Advanced Physics & Weather</li>
                <li>4 Philosophical Zones</li>
                <li>Meditation & Mindfulness</li>
                <li>Achievement System</li>
                <li>Dynamic Day/Night Cycle</li>
            </ul>
            <p style="margin: 0 0 20px 0;"><em>"Welcome to the real Matrix Helicopter experience"</em></p>
            <button onclick="this.parentNode.remove()" style="background: #004400; color: #00ff00; border: 1px solid #00ff00; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Continue Exploring</button>
        `;
        document.body.appendChild(completion);
        
        setTimeout(() => {
            if (completion.parentNode) {
                completion.parentNode.removeChild(completion);
            }
        }, 10000);
    }
}