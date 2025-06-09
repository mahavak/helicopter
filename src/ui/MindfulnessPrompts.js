/**
 * Mindfulness Prompts System
 * Provides contextual meditation guidance based on flight state and location
 */
export class MindfulnessPrompts {
    constructor() {
        this.currentPrompt = null;
        this.promptHistory = [];
        this.lastPromptTime = 0;
        this.promptInterval = 30000; // 30 seconds between prompts
        this.isActive = false;
        
        this.setupPromptDatabase();
    }
    
    setupPromptDatabase() {
        this.prompts = {
            // General flying prompts
            flying: {
                general: [
                    "Notice the rhythm of your breathing as you navigate...",
                    "Feel the helicopter responding to your gentlest intentions...",
                    "Observe how awareness itself flies through this digital space...",
                    "What is the difference between moving and being moved?",
                    "Let your flight become a moving meditation...",
                    "Notice the space between thought and action...",
                    "How does consciousness pilot this virtual vessel?",
                    "Feel the balance between effort and surrender in flight...",
                    "Observe the stillness within movement...",
                    "What remains constant as everything changes around you?"
                ],
                
                stable: [
                    "Rest in this moment of stable flight...",
                    "Notice the peace that comes with balanced control...",
                    "Feel the harmony between you and the aircraft...",
                    "In stability, what insights arise naturally?",
                    "Let this steadiness reflect your inner calm...",
                    "Observe how stillness enables clearer perception..."
                ],
                
                turbulent: [
                    "Notice how you respond to this turbulence...",
                    "Can you find calm within the chaos?",
                    "What does resistance feel like in your body?",
                    "Breathe with the movement rather than against it...",
                    "In difficulty, what qualities arise in you?",
                    "How does acceptance change your experience of instability?"
                ],
                
                ascending: [
                    "Feel yourself rising above previous limitations...",
                    "What perspectives emerge from this higher vantage point?",
                    "Notice the effort required to transcend...",
                    "How does elevation change your view of the landscape below?",
                    "What are you leaving behind as you ascend?",
                    "Feel the lightness that comes with rising consciousness..."
                ],
                
                descending: [
                    "Notice the trust required to let go and descend...",
                    "What wisdom do you carry back down to earth?",
                    "Feel the grounding that comes with return...",
                    "How does humility feel in this moment?",
                    "What are you bringing back from the heights?",
                    "Observe the balance between transcendence and embodiment..."
                ]
            },
            
            // Zone-specific prompts
            zones: {
                'Cave of Shadows': [
                    "What shadows does your consciousness cast in this virtual realm?",
                    "Notice the interplay between light and darkness within you...",
                    "What aspects of yourself hide in the digital shadows?",
                    "How do you distinguish between reality and illusion here?",
                    "What is illuminated when you stop trying to see?",
                    "Feel the depth that darkness can reveal...",
                    "What wisdom emerges from embracing the unknown?",
                    "Notice how shadows define the light...",
                    "What would you discover if you stopped fearing the dark?",
                    "How does the cave reflect your inner landscape?"
                ],
                
                'Garden of Forking Paths': [
                    "Every moment contains infinite possibilities...",
                    "Notice the paths you didn't take alongside the one you chose...",
                    "How do your decisions shape this digital reality?",
                    "What would happen if you chose with complete freedom?",
                    "Feel the weight and lightness of infinite potential...",
                    "Which path calls to your deepest wisdom?",
                    "Notice how choice itself changes the landscape...",
                    "What happens when you embrace uncertainty?",
                    "How do parallel possibilities dance around you?",
                    "What does it mean to be the author of your experience?"
                ],
                
                "Observer's Paradox": [
                    "How does your observation change this virtual world?",
                    "Notice the relationship between watcher and watched...",
                    "What happens when the observer becomes the observed?",
                    "Feel how consciousness collapses possibilities into experience...",
                    "Are you flying the helicopter, or is it flying you?",
                    "What remains when the observer dissolves?",
                    "Notice how attention itself shapes reality...",
                    "How does the act of measurement change what is measured?",
                    "What is the difference between seeing and being seen?",
                    "Feel the paradox of conscious awareness aware of itself..."
                ],
                
                'Ship of Theseus': [
                    "What remains constant as everything changes?",
                    "Notice which parts of you persist through transformation...",
                    "How much can change while still being 'you'?",
                    "What is the essence that survives all modification?",
                    "Feel the continuity within discontinuity...",
                    "Which aspects of identity are truly essential?",
                    "Notice how change and permanence dance together...",
                    "What would remain if everything else were replaced?",
                    "How does the stream of consciousness maintain its flow?",
                    "What is the 'you' that observes all other changes?"
                ]
            },
            
            // Time-based prompts
            timeOfDay: {
                morning: [
                    "Feel the fresh potential of this digital dawn...",
                    "What intentions arise with this new light?",
                    "Notice the awakening happening within awareness...",
                    "How does this virtual sunrise reflect inner illumination?",
                    "What possibilities emerge with the morning light?"
                ],
                
                noon: [
                    "Rest in the fullness of this digital noon...",
                    "Feel the clarity that comes with direct illumination...",
                    "What is revealed in this moment of peak light?",
                    "Notice the absence of shadows in complete awareness...",
                    "How does this brightness reflect your own clarity?"
                ],
                
                evening: [
                    "Feel the gentle settling of this virtual twilight...",
                    "What wisdom has today's flight revealed?",
                    "Notice the peaceful transition from activity to rest...",
                    "How does this dimming light invite deeper reflection?",
                    "What are you ready to release with the setting sun?"
                ],
                
                night: [
                    "Rest in the deep stillness of digital night...",
                    "What emerges when external activity quiets?",
                    "Feel the vast space that darkness reveals...",
                    "Notice the inner light that needs no external source...",
                    "How does this darkness serve as a canvas for consciousness?"
                ]
            },
            
            // Flight state prompts
            flightStates: {
                groundEffect: [
                    "Notice how proximity to earth changes your flight...",
                    "Feel the lift that comes from being grounded...",
                    "How does the earth support your ascension?",
                    "What foundation enables your highest flight?"
                ],
                
                autorotation: [
                    "Trust the natural forces that carry you...",
                    "Notice how surrender can become a form of control...",
                    "Feel the wisdom of working with rather than against...",
                    "What grace emerges when you stop forcing?"
                ],
                
                vortexRing: [
                    "Breathe through this moment of instability...",
                    "Notice what arises when your usual methods fail...",
                    "How do you find center when everything spins?",
                    "What clarity emerges from complete disorientation?"
                ],
                
                hovering: [
                    "Rest in this moment of perfect balance...",
                    "Feel the stillness that contains all movement...",
                    "Notice the effort required to remain in one place...",
                    "What does it mean to be simultaneously moving and still?"
                ]
            },
            
            // Breath-synchronized prompts
            breathing: {
                inhale: [
                    "Breathe in possibility...",
                    "Draw in the vastness of virtual space...",
                    "Feel consciousness expanding with each breath...",
                    "Inhale the digital air of pure potential..."
                ],
                
                exhale: [
                    "Release what no longer serves...",
                    "Let go of the need to control...",
                    "Breathe out limitation...",
                    "Exhale into the spaciousness of being..."
                ],
                
                hold: [
                    "Rest in the pause between breaths...",
                    "Feel the stillness that contains all action...",
                    "Notice the space where transformation happens...",
                    "Rest in the pregnant emptiness..."
                ]
            }
        };
    }
    
    activate() {
        this.isActive = true;
        this.lastPromptTime = Date.now();
    }
    
    deactivate() {
        this.isActive = false;
        this.hideCurrentPrompt();
    }
    
    update(flightData, currentZone, timeOfDay, deltaTime) {
        if (!this.isActive) return;
        
        const now = Date.now();
        
        // Check if it's time for a new prompt
        if (now - this.lastPromptTime > this.promptInterval) {
            this.showContextualPrompt(flightData, currentZone, timeOfDay);
            this.lastPromptTime = now;
        }
    }
    
    showContextualPrompt(flightData, currentZone, timeOfDay) {
        const context = this.analyzeContext(flightData, currentZone, timeOfDay);
        const prompt = this.selectPrompt(context);
        
        if (prompt) {
            this.displayPrompt(prompt, context);
            this.currentPrompt = { text: prompt, context, timestamp: Date.now() };
            this.promptHistory.push(this.currentPrompt);
            
            // Limit history size
            if (this.promptHistory.length > 50) {
                this.promptHistory.shift();
            }
        }
    }
    
    analyzeContext(flightData, currentZone, timeOfDay) {
        const context = {
            zone: currentZone,
            timeOfDay: timeOfDay,
            flightState: 'general',
            stability: 'stable',
            verticalMotion: 'level',
            specialStates: []
        };
        
        // Analyze flight stability
        if (flightData.velocity) {
            const speed = Math.sqrt(
                flightData.velocity.x ** 2 + 
                flightData.velocity.y ** 2 + 
                flightData.velocity.z ** 2
            );
            
            context.stability = speed > 5 ? 'turbulent' : 'stable';
            
            // Detect vertical motion
            if (flightData.velocity.y > 2) {
                context.verticalMotion = 'ascending';
            } else if (flightData.velocity.y < -2) {
                context.verticalMotion = 'descending';
            }
        }
        
        // Check for special flight states
        if (flightData.advancedStatus) {
            const status = flightData.advancedStatus;
            
            if (status.groundEffect) {
                context.specialStates.push('groundEffect');
            }
            if (status.autorotation) {
                context.specialStates.push('autorotation');
            }
            if (status.vortexRingState) {
                context.specialStates.push('vortexRing');
            }
            if (Math.abs(flightData.velocity?.y || 0) < 0.5 && 
                Math.abs(flightData.velocity?.x || 0) < 0.5 && 
                Math.abs(flightData.velocity?.z || 0) < 0.5) {
                context.specialStates.push('hovering');
            }
        }
        
        return context;
    }
    
    selectPrompt(context) {
        const candidates = [];
        
        // Zone-specific prompts (highest priority)
        if (context.zone && this.prompts.zones[context.zone]) {
            candidates.push(...this.prompts.zones[context.zone]);
        }
        
        // Special flight state prompts
        context.specialStates.forEach(state => {
            if (this.prompts.flightStates[state]) {
                candidates.push(...this.prompts.flightStates[state]);
            }
        });
        
        // Flight condition prompts
        if (this.prompts.flying[context.verticalMotion]) {
            candidates.push(...this.prompts.flying[context.verticalMotion]);
        }
        
        if (this.prompts.flying[context.stability]) {
            candidates.push(...this.prompts.flying[context.stability]);
        }
        
        // Time-based prompts
        if (context.timeOfDay && this.prompts.timeOfDay[context.timeOfDay]) {
            candidates.push(...this.prompts.timeOfDay[context.timeOfDay]);
        }
        
        // Default to general flying prompts
        if (candidates.length === 0) {
            candidates.push(...this.prompts.flying.general);
        }
        
        // Filter out recently used prompts
        const recentPrompts = this.promptHistory
            .slice(-10)
            .map(p => p.text);
        
        const freshCandidates = candidates.filter(p => !recentPrompts.includes(p));
        
        // Return random prompt from fresh candidates, or any candidate if all are recent
        const finalCandidates = freshCandidates.length > 0 ? freshCandidates : candidates;
        return finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
    }
    
    displayPrompt(prompt, context) {
        this.hideCurrentPrompt();
        
        const promptDiv = document.createElement('div');
        promptDiv.id = 'mindfulness-floating-prompt';
        promptDiv.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 20px 30px;
            border: 1px solid #00ff00;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            text-align: center;
            z-index: 250;
            max-width: 600px;
            line-height: 1.6;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
            backdrop-filter: blur(10px);
            animation: promptFadeIn 1s ease-out;
        `;
        
        // Add context indicator
        let contextIndicator = '';
        if (context.zone) {
            contextIndicator = `📍 ${context.zone} • `;
        }
        
        promptDiv.innerHTML = `
            <div style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">
                ${contextIndicator}🧘 Mindfulness Prompt
            </div>
            <div style="font-style: italic;">
                ${prompt}
            </div>
        `;
        
        document.body.appendChild(promptDiv);
        
        // Add fade-in animation CSS if not already present
        if (!document.getElementById('prompt-animations')) {
            const style = document.createElement('style');
            style.id = 'prompt-animations';
            style.textContent = `
                @keyframes promptFadeIn {
                    0% { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(-20px) scale(0.9);
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                }
                
                @keyframes promptFadeOut {
                    0% { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                    100% { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(-20px) scale(0.9);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.hideCurrentPrompt();
        }, 8000);
    }
    
    hideCurrentPrompt() {
        const existing = document.getElementById('mindfulness-floating-prompt');
        if (existing) {
            existing.style.animation = 'promptFadeOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (existing.parentElement) {
                    existing.remove();
                }
            }, 500);
        }
    }
    
    showBreathingPrompt(phase) {
        if (!this.isActive) return;
        
        const prompts = this.prompts.breathing[phase] || [];
        if (prompts.length === 0) return;
        
        const prompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        // Show brief breathing prompt
        const breathPromptDiv = document.createElement('div');
        breathPromptDiv.id = 'breathing-sync-prompt';
        breathPromptDiv.style.cssText = `
            position: fixed;
            bottom: 40%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 10px 20px;
            border-radius: 20px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            text-align: center;
            z-index: 200;
            animation: promptFadeIn 0.3s ease-out;
            opacity: 0.8;
        `;
        
        breathPromptDiv.textContent = prompt;
        document.body.appendChild(breathPromptDiv);
        
        // Quick fade out
        setTimeout(() => {
            if (breathPromptDiv.parentElement) {
                breathPromptDiv.style.animation = 'promptFadeOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (breathPromptDiv.parentElement) {
                        breathPromptDiv.remove();
                    }
                }, 300);
            }
        }, 2000);
    }
    
    setPromptInterval(milliseconds) {
        this.promptInterval = Math.max(10000, milliseconds); // Minimum 10 seconds
    }
    
    getPromptHistory() {
        return this.promptHistory.slice();
    }
    
    getContextualPrompts(context) {
        // Return all prompts that match the given context (for testing/preview)
        const allPrompts = [];
        
        if (context.zone && this.prompts.zones[context.zone]) {
            allPrompts.push(...this.prompts.zones[context.zone]);
        }
        
        context.specialStates?.forEach(state => {
            if (this.prompts.flightStates[state]) {
                allPrompts.push(...this.prompts.flightStates[state]);
            }
        });
        
        return allPrompts;
    }
}