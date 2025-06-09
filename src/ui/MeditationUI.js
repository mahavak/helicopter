import * as THREE from 'three';
import { MindfulnessPrompts } from './MindfulnessPrompts.js';

/**
 * Enhanced Meditation UI System
 * Provides visual meditation guides, progress visualization, and mindfulness prompts
 */
export class MeditationUI {
    constructor() {
        this.isActive = false;
        this.currentSession = null;
        this.breathingGuide = null;
        this.progressVisualization = null;
        this.mindfulnessPrompts = [];
        this.meditationHUD = null;
        
        // Meditation session tracking
        this.sessionStartTime = null;
        this.sessionDuration = 0;
        this.breathingRate = 6; // breaths per minute
        this.currentPhase = 'preparation';
        
        // Visual elements
        this.breathingCircle = null;
        this.progressBar = null;
        this.promptDisplay = null;
        this.focusIndicator = null;
        
        // Mindfulness system
        this.mindfulnessPrompts = new MindfulnessPrompts();
        
        this.init();
    }
    
    init() {
        this.createMeditationHUD();
        this.setupBreathingGuide();
        this.setupProgressVisualization();
        this.setupMindfulnessPrompts();
        this.createFocusIndicator();
    }
    
    createMeditationHUD() {
        const hudContainer = document.createElement('div');
        hudContainer.id = 'meditation-hud';
        hudContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 20px;
            border: 1px solid #00ff00;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            z-index: 100;
            display: none;
            min-width: 300px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            backdrop-filter: blur(5px);
        `;
        
        hudContainer.innerHTML = `
            <div class="meditation-header">
                <h3 style="margin: 0 0 10px 0; color: #00ff00; text-shadow: 0 0 10px #00ff00;">
                    🧘 MEDITATION MODE
                </h3>
                <div id="session-info" style="font-size: 12px; opacity: 0.8;">
                    Session: <span id="session-duration">00:00</span> | 
                    Phase: <span id="meditation-phase">Preparation</span>
                </div>
            </div>
            
            <div class="meditation-controls" style="margin: 15px 0;">
                <div style="margin-bottom: 10px;">
                    <label>Breathing Rate: <span id="breathing-rate">6</span> BPM</label>
                    <input type="range" id="breathing-slider" min="4" max="12" value="6" 
                           style="width: 100%; margin-top: 5px;">
                </div>
                
                <div class="session-controls">
                    <button id="start-meditation" style="margin-right: 10px;">Start Session</button>
                    <button id="pause-meditation">Pause</button>
                    <button id="end-meditation" style="margin-left: 10px;">End</button>
                </div>
            </div>
            
            <div id="meditation-progress" style="margin: 15px 0;">
                <div style="margin-bottom: 5px;">Progress:</div>
                <div id="progress-bar-container" style="background: #003300; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div id="progress-bar" style="background: linear-gradient(90deg, #00ff00, #00aa00); height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>
            
            <div id="mindfulness-prompt" style="margin-top: 15px; padding: 10px; background: rgba(0, 255, 0, 0.1); border-radius: 5px; font-style: italic; min-height: 40px;">
                Press 'Enter' to begin your meditation journey...
            </div>
        `;
        
        document.body.appendChild(hudContainer);
        this.meditationHUD = hudContainer;
        
        this.setupEventListeners();
    }
    
    setupBreathingGuide() {
        const breathingContainer = document.createElement('div');
        breathingContainer.id = 'breathing-guide';
        breathingContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 200;
            display: none;
            text-align: center;
        `;
        
        // Create SVG breathing circle
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '200');
        svg.style.cssText = 'filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.5));';
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', '50');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#00ff00');
        circle.setAttribute('stroke-width', '3');
        circle.setAttribute('opacity', '0.8');
        circle.id = 'breathing-circle';
        
        // Inner circle for pulse effect
        const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle.setAttribute('cx', '100');
        innerCircle.setAttribute('cy', '100');
        innerCircle.setAttribute('r', '30');
        innerCircle.setAttribute('fill', 'rgba(0, 255, 0, 0.2)');
        innerCircle.setAttribute('stroke', 'none');
        innerCircle.id = 'breathing-inner-circle';
        
        svg.appendChild(innerCircle);
        svg.appendChild(circle);
        
        // Breathing instruction text
        const instructionText = document.createElement('div');
        instructionText.id = 'breathing-instruction';
        instructionText.style.cssText = `
            margin-top: 20px;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            color: #00ff00;
            text-shadow: 0 0 10px #00ff00;
        `;
        instructionText.textContent = 'Breathe In';
        
        breathingContainer.appendChild(svg);
        breathingContainer.appendChild(instructionText);
        document.body.appendChild(breathingContainer);
        
        this.breathingGuide = breathingContainer;
        this.breathingCircle = circle;
        this.breathingInnerCircle = innerCircle;
        this.breathingInstruction = instructionText;
    }
    
    setupProgressVisualization() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'meditation-progress-visual';
        progressContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 150;
            display: none;
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid #00ff00;
            backdrop-filter: blur(10px);
        `;
        
        progressContainer.innerHTML = `
            <div style="text-align: center; font-family: 'Courier New', monospace; color: #00ff00;">
                <div style="margin-bottom: 10px;">Meditation Insights</div>
                <div id="insight-metrics" style="display: flex; gap: 20px; justify-content: center;">
                    <div class="metric">
                        <div id="stability-score" style="font-size: 24px; font-weight: bold;">85%</div>
                        <div style="font-size: 12px; opacity: 0.8;">Stability</div>
                    </div>
                    <div class="metric">
                        <div id="focus-score" style="font-size: 24px; font-weight: bold;">72%</div>
                        <div style="font-size: 12px; opacity: 0.8;">Focus</div>
                    </div>
                    <div class="metric">
                        <div id="depth-score" style="font-size: 24px; font-weight: bold;">91%</div>
                        <div style="font-size: 12px; opacity: 0.8;">Depth</div>
                    </div>
                </div>
                <div id="insight-visualization" style="margin-top: 15px; height: 30px; background: #001100; border-radius: 15px; overflow: hidden; position: relative;">
                    <div id="insight-wave" style="background: linear-gradient(90deg, #00ff00, #00aa00, #006600); height: 100%; width: 0%; transition: width 0.5s;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(progressContainer);
        this.progressVisualization = progressContainer;
    }
    
    setupMindfulnessPrompts() {
        this.mindfulnessPrompts = [
            // Preparation phase
            {
                phase: 'preparation',
                prompts: [
                    "Take a moment to settle into your helicopter seat...",
                    "Notice the hum of the rotors and the gentle sway...",
                    "Feel your connection to this digital aircraft...",
                    "Allow your breathing to naturally slow and deepen..."
                ]
            },
            // Flying meditation
            {
                phase: 'flying',
                prompts: [
                    "Observe how smoothly you navigate through the digital sky...",
                    "Notice the relationship between your intention and the helicopter's response...",
                    "Feel the balance between effort and effortlessness in flight...",
                    "Let your awareness expand to encompass the entire virtual world...",
                    "What does it mean to pilot consciousness itself?",
                    "Notice how your attention shapes your flight experience..."
                ]
            },
            // Zone-specific prompts
            {
                phase: 'cave_of_shadows',
                prompts: [
                    "What shadows does your digital self cast?",
                    "How do you distinguish between simulation and reality?",
                    "What aspects of yourself remain hidden in the darkness?",
                    "Notice how perception creates the cave around you..."
                ]
            },
            {
                phase: 'garden_of_forking_paths',
                prompts: [
                    "Every flight path contains infinite possibilities...",
                    "How do your choices shape this digital reality?",
                    "What would happen if you chose differently?",
                    "Feel the weight and lightness of infinite potential..."
                ]
            },
            {
                phase: 'observers_paradox',
                prompts: [
                    "How does your observation change this virtual world?",
                    "What is the relationship between watcher and watched?",
                    "Notice how consciousness collapses possibilities into experience...",
                    "Are you flying the helicopter, or is it flying you?"
                ]
            },
            // Deep meditation
            {
                phase: 'deep',
                prompts: [
                    "Rest in the spaciousness of digital sky...",
                    "Let go of the need to control or direct...",
                    "Simply be present with what arises...",
                    "Notice the silence between the rotor beats...",
                    "What remains when the pilot dissolves?",
                    "Rest in pure awareness, vast as the virtual horizon..."
                ]
            }
        ];
    }
    
    createFocusIndicator() {
        const focusContainer = document.createElement('div');
        focusContainer.id = 'focus-indicator';
        focusContainer.style.cssText = `
            position: fixed;
            top: 50%;
            right: 30px;
            transform: translateY(-50%);
            z-index: 120;
            display: none;
        `;
        
        // Create vertical focus meter
        focusContainer.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.8); padding: 15px; border-radius: 10px; border: 1px solid #00ff00;">
                <div style="text-align: center; font-family: 'Courier New', monospace; color: #00ff00; margin-bottom: 10px; font-size: 12px;">
                    FOCUS
                </div>
                <div style="width: 20px; height: 150px; background: #001100; border-radius: 10px; overflow: hidden; position: relative;">
                    <div id="focus-level" style="background: linear-gradient(0deg, #ff4400, #ffaa00, #00ff00); width: 100%; height: 70%; position: absolute; bottom: 0; transition: height 0.3s;"></div>
                </div>
                <div id="focus-percentage" style="text-align: center; font-family: 'Courier New', monospace; color: #00ff00; margin-top: 10px; font-size: 12px;">
                    70%
                </div>
            </div>
        `;
        
        document.body.appendChild(focusContainer);
        this.focusIndicator = focusContainer;
    }
    
    setupEventListeners() {
        // Breathing rate slider
        const breathingSlider = document.getElementById('breathing-slider');
        if (breathingSlider) {
            breathingSlider.addEventListener('input', (e) => {
                this.breathingRate = parseInt(e.target.value);
                document.getElementById('breathing-rate').textContent = this.breathingRate;
            });
        }
        
        // Session control buttons
        const startBtn = document.getElementById('start-meditation');
        const pauseBtn = document.getElementById('pause-meditation');
        const endBtn = document.getElementById('end-meditation');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startMeditationSession());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseMeditationSession());
        if (endBtn) endBtn.addEventListener('click', () => this.endMeditationSession());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && !this.isActive) {
                this.toggleMeditationMode();
            }
            if (e.code === 'Escape' && this.isActive) {
                this.toggleMeditationMode();
            }
        });
    }
    
    toggleMeditationMode() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            this.enterMeditationMode();
        } else {
            this.exitMeditationMode();
        }
    }
    
    enterMeditationMode() {
        console.log('🧘 Entering Meditation Mode');
        
        // Show meditation UI elements
        if (this.meditationHUD) this.meditationHUD.style.display = 'block';
        if (this.progressVisualization) this.progressVisualization.style.display = 'block';
        if (this.focusIndicator) this.focusIndicator.style.display = 'block';
        
        // Activate mindfulness prompts
        this.mindfulnessPrompts.activate();
        
        // Update meditation phase
        this.currentPhase = 'preparation';
        this.updatePhaseDisplay();
        
        // Show initial prompt
        this.showMindfulnessPrompt();
        
        // Dim the regular UI
        this.dimRegularUI(true);
    }
    
    exitMeditationMode() {
        console.log('🧘 Exiting Meditation Mode');
        
        // Hide meditation UI elements
        if (this.meditationHUD) this.meditationHUD.style.display = 'none';
        if (this.breathingGuide) this.breathingGuide.style.display = 'none';
        if (this.progressVisualization) this.progressVisualization.style.display = 'none';
        if (this.focusIndicator) this.focusIndicator.style.display = 'none';
        
        // Deactivate mindfulness prompts
        this.mindfulnessPrompts.deactivate();
        
        // End any active session
        if (this.currentSession) {
            this.endMeditationSession();
        }
        
        // Restore regular UI
        this.dimRegularUI(false);
    }
    
    startMeditationSession() {
        this.currentSession = {
            startTime: Date.now(),
            duration: 0,
            targetDuration: 10 * 60 * 1000, // 10 minutes default
            phase: 'preparation'
        };
        
        this.sessionStartTime = Date.now();
        this.currentPhase = 'preparation';
        
        // Show breathing guide
        if (this.breathingGuide) this.breathingGuide.style.display = 'block';
        
        // Start breathing animation
        this.startBreathingAnimation();
        
        // Start session timer
        this.sessionTimer = setInterval(() => {
            this.updateSessionProgress();
        }, 1000);
        
        console.log('🧘 Meditation session started');
    }
    
    pauseMeditationSession() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        if (this.breathingAnimation) {
            clearInterval(this.breathingAnimation);
            this.breathingAnimation = null;
        }
        
        console.log('⏸️ Meditation session paused');
    }
    
    endMeditationSession() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        if (this.breathingAnimation) {
            clearInterval(this.breathingAnimation);
            this.breathingAnimation = null;
        }
        
        // Hide breathing guide
        if (this.breathingGuide) this.breathingGuide.style.display = 'none';
        
        // Show session summary
        this.showSessionSummary();
        
        this.currentSession = null;
        console.log('🧘 Meditation session ended');
    }
    
    startBreathingAnimation() {
        const breathingCycleMs = (60 / this.breathingRate) * 1000;
        const inhaleMs = breathingCycleMs * 0.4;
        const holdMs = breathingCycleMs * 0.2;
        const exhaleMs = breathingCycleMs * 0.4;
        
        let isInhaling = true;
        let cycleStartTime = Date.now();
        
        this.breathingAnimation = setInterval(() => {
            const elapsed = Date.now() - cycleStartTime;
            
            if (isInhaling && elapsed < inhaleMs) {
                // Inhale phase
                const progress = elapsed / inhaleMs;
                this.animateBreathingCircle(30 + (progress * 20), 'Breathe In', progress);
            } else if (elapsed < inhaleMs + holdMs) {
                // Hold phase
                this.animateBreathingCircle(50, 'Hold', 1);
            } else if (elapsed < inhaleMs + holdMs + exhaleMs) {
                // Exhale phase
                const progress = (elapsed - inhaleMs - holdMs) / exhaleMs;
                this.animateBreathingCircle(50 - (progress * 20), 'Breathe Out', 1 - progress);
            } else {
                // Reset cycle
                cycleStartTime = Date.now();
                isInhaling = true;
            }
        }, 50);
    }
    
    animateBreathingCircle(radius, instruction, intensity) {
        if (this.breathingCircle) {
            this.breathingCircle.setAttribute('r', radius.toString());
        }
        
        if (this.breathingInnerCircle) {
            this.breathingInnerCircle.setAttribute('r', (radius * 0.6).toString());
            this.breathingInnerCircle.setAttribute('opacity', (0.2 + intensity * 0.3).toString());
        }
        
        if (this.breathingInstruction) {
            this.breathingInstruction.textContent = instruction;
        }
        
        // Show contextual breathing prompts
        const breathingPhase = instruction.toLowerCase().includes('in') ? 'inhale' : 
                             instruction.toLowerCase().includes('out') ? 'exhale' : 'hold';
        
        if (Math.random() < 0.1) { // 10% chance to show breathing prompt
            this.mindfulnessPrompts.showBreathingPrompt(breathingPhase);
        }
    }
    
    updateSessionProgress() {
        if (!this.currentSession) return;
        
        const elapsed = Date.now() - this.sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        // Update session duration display
        const durationElement = document.getElementById('session-duration');
        if (durationElement) {
            durationElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = Math.min(elapsed / this.currentSession.targetDuration, 1) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Update phase based on duration
        if (elapsed > 2 * 60 * 1000 && this.currentPhase === 'preparation') {
            this.currentPhase = 'flying';
            this.updatePhaseDisplay();
            this.showMindfulnessPrompt();
        }
    }
    
    updatePhaseDisplay() {
        const phaseElement = document.getElementById('meditation-phase');
        if (phaseElement) {
            phaseElement.textContent = this.currentPhase.charAt(0).toUpperCase() + this.currentPhase.slice(1);
        }
    }
    
    showMindfulnessPrompt() {
        const phasePrompts = this.mindfulnessPrompts.find(p => p.phase === this.currentPhase);
        if (!phasePrompts) return;
        
        const randomPrompt = phasePrompts.prompts[Math.floor(Math.random() * phasePrompts.prompts.length)];
        
        const promptElement = document.getElementById('mindfulness-prompt');
        if (promptElement) {
            promptElement.style.animation = 'none';
            promptElement.offsetHeight; // Trigger reflow
            promptElement.style.animation = 'fadeInOut 4s ease-in-out';
            promptElement.textContent = randomPrompt;
        }
    }
    
    updateMeditationMetrics(flightData) {
        if (!this.isActive) return;
        
        // Calculate meditation metrics based on flight stability
        const velocity = flightData.velocity || { x: 0, y: 0, z: 0 };
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
        
        // Stability: inversely related to speed and angular velocity
        const stability = Math.max(0, 100 - (speed * 10));
        
        // Focus: based on control smoothness (mock calculation)
        const focus = Math.max(30, 100 - (Math.abs(flightData.controls?.collective || 0) * 50));
        
        // Depth: based on session duration and zone proximity
        const sessionTime = this.currentSession ? (Date.now() - this.sessionStartTime) / 1000 : 0;
        const depth = Math.min(100, sessionTime / 10 + 50);
        
        // Update UI elements
        const stabilityElement = document.getElementById('stability-score');
        const focusElement = document.getElementById('focus-score');
        const depthElement = document.getElementById('depth-score');
        const focusLevel = document.getElementById('focus-level');
        const focusPercentage = document.getElementById('focus-percentage');
        
        if (stabilityElement) stabilityElement.textContent = `${Math.round(stability)}%`;
        if (focusElement) focusElement.textContent = `${Math.round(focus)}%`;
        if (depthElement) depthElement.textContent = `${Math.round(depth)}%`;
        
        if (focusLevel) {
            focusLevel.style.height = `${focus}%`;
        }
        if (focusPercentage) {
            focusPercentage.textContent = `${Math.round(focus)}%`;
        }
        
        // Update insight wave
        const insightWave = document.getElementById('insight-wave');
        if (insightWave) {
            const avgScore = (stability + focus + depth) / 3;
            insightWave.style.width = `${avgScore}%`;
        }
    }
    
    updatePhaseBasedOnLocation(position, zone) {
        if (!this.isActive) return;
        
        // Update meditation phase based on current zone
        let newPhase = this.currentPhase;
        
        if (zone) {
            const zoneName = zone.toLowerCase().replace(/[^a-z]/g, '_');
            if (this.mindfulnessPrompts.some(p => p.phase === zoneName)) {
                newPhase = zoneName;
            }
        } else if (this.currentPhase.includes('_')) {
            // Return to flying if no longer in a special zone
            newPhase = 'flying';
        }
        
        if (newPhase !== this.currentPhase) {
            this.currentPhase = newPhase;
            this.updatePhaseDisplay();
            
            // Show new prompt after a delay
            setTimeout(() => {
                this.showMindfulnessPrompt();
            }, 2000);
        }
    }
    
    dimRegularUI(dim) {
        const flightInfo = document.getElementById('flight-info');
        const keyboardHelp = document.getElementById('keyboard-help');
        
        if (flightInfo) {
            flightInfo.style.opacity = dim ? '0.3' : '1';
        }
        if (keyboardHelp) {
            keyboardHelp.style.opacity = dim ? '0.3' : '1';
        }
    }
    
    showSessionSummary() {
        if (!this.currentSession) return;
        
        const duration = Date.now() - this.sessionStartTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: #00ff00;
            padding: 30px;
            border: 2px solid #00ff00;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            text-align: center;
            z-index: 300;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        `;
        
        summaryDiv.innerHTML = `
            <h3 style="margin-top: 0; text-shadow: 0 0 10px #00ff00;">🧘 SESSION COMPLETE</h3>
            <div style="margin: 20px 0;">
                <div>Duration: ${minutes}m ${seconds}s</div>
                <div>Phase: ${this.currentPhase}</div>
                <div style="margin-top: 15px; color: #00aa00;">
                    "The digital meditation reveals the nature of consciousness itself."
                </div>
            </div>
            <button onclick="this.parentElement.remove()" 
                    style="background: #003300; color: #00ff00; border: 1px solid #00ff00; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Continue Journey
            </button>
        `;
        
        document.body.appendChild(summaryDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (summaryDiv.parentElement) {
                summaryDiv.remove();
            }
        }, 10000);
    }
    
    // Public interface
    isInMeditationMode() {
        return this.isActive;
    }
    
    update(flightData, currentZone, timeOfDay) {
        if (!this.isActive) return;
        
        this.updateMeditationMetrics(flightData);
        this.updatePhaseBasedOnLocation(flightData.position, currentZone);
        
        // Update contextual mindfulness prompts
        this.mindfulnessPrompts.update(flightData, currentZone, timeOfDay, 0.016);
        
        // Automatically show new prompts periodically (legacy system)
        if (this.currentSession && Math.random() < 0.01) { // 1% chance per frame
            this.showMindfulnessPrompt();
        }
    }
}