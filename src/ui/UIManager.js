import { MeditationUI } from './MeditationUI.js';

export class UIManager {
    constructor() {
        this.altitudeElement = document.getElementById('altitude');
        this.speedElement = document.getElementById('speed');
        this.realityLayerElement = document.getElementById('reality-layer');
        this.timeElement = null;
        this.weatherElement = null;
        this.themeElement = null;
        this.achievementElement = null;
        this.helicopterInfoElement = null;
        this.advancedStatusElement = null;
        
        this.currentRealityLayer = 'Simulation';
        this.lastPhilosophicalZone = null;
        
        // Initialize meditation UI
        this.meditationUI = new MeditationUI();
        
        this.setupKeyboardHelp();
        this.setupAdditionalUI();
        this.setupEnhancedHUD();
    }
    
    update(flightData) {
        if (this.altitudeElement) {
            this.altitudeElement.textContent = flightData.altitude;
        }
        
        if (this.speedElement) {
            this.speedElement.textContent = flightData.speed;
        }
        
        // Update helicopter information
        this.updateHelicopterInfo(flightData);
        
        // Update advanced flight status
        this.updateAdvancedStatus(flightData);
        
        // Check if near philosophical zones
        const currentZone = this.checkPhilosophicalProximity(flightData.position);
        
        // Update meditation UI (will get time of day from main game loop)
        this.meditationUI.update(flightData, currentZone, this.currentTimeOfDay);
        
        // Update reality layer display
        if (this.realityLayerElement) {
            this.realityLayerElement.textContent = this.currentRealityLayer;
        }
    }
    
    checkPhilosophicalProximity(position) {
        const zones = [
            { name: 'Cave of Shadows', pos: { x: -200, y: 50, z: 200 } },
            { name: 'Garden of Forking Paths', pos: { x: 200, y: 30, z: -200 } },
            { name: "Observer's Paradox", pos: { x: 0, y: 80, z: 0 } },
            { name: 'Ship of Theseus', pos: { x: -100, y: 60, z: -100 } }
        ];
        
        let nearestZone = null;
        let minDistance = Infinity;
        
        zones.forEach(zone => {
            const distance = Math.sqrt(
                Math.pow(position.x - zone.pos.x, 2) +
                Math.pow(position.y - zone.pos.y, 2) +
                Math.pow(position.z - zone.pos.z, 2)
            );
            
            if (distance < 100 && distance < minDistance) {
                minDistance = distance;
                nearestZone = zone.name;
            }
        });
        
        if (nearestZone && nearestZone !== this.lastPhilosophicalZone) {
            this.showZoneMessage(nearestZone);
            this.lastPhilosophicalZone = nearestZone;
        } else if (!nearestZone) {
            this.lastPhilosophicalZone = null;
            this.hideZoneMessage();
        }
        
        return nearestZone;
    }
    
    showZoneMessage(zoneName) {
        this.removeExistingZoneMessage();
        
        const messages = {
            'Cave of Shadows': 'Entering the Cave of Shadows...\nWhat shadows do you cast?',
            'Garden of Forking Paths': 'Garden of Forking Paths ahead...\nEvery choice creates a new reality.',
            "Observer's Paradox": "Observer's Paradox detected...\nYour presence changes everything.",
            'Ship of Theseus': 'Ship of Theseus Memorial...\nWhat remains when all has changed?'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'zone-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 20px;
            border: 1px solid #00ff00;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            text-align: center;
            z-index: 200;
            white-space: pre-line;
            text-shadow: 0 0 10px #00ff00;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        messageDiv.textContent = messages[zoneName] || `Entering ${zoneName}...`;
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => this.hideZoneMessage(), 3000);
    }
    
    hideZoneMessage() {
        this.removeExistingZoneMessage();
    }
    
    removeExistingZoneMessage() {
        const existing = document.getElementById('zone-message');
        if (existing) {
            existing.remove();
        }
    }
    
    setupKeyboardHelp() {
        // Create help overlay
        const helpDiv = document.createElement('div');
        helpDiv.id = 'keyboard-help';
        helpDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: #00ff00;
            padding: 15px;
            border: 1px solid #003300;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 150;
            opacity: 0.7;
        `;
        
        helpDiv.innerHTML = `
            <strong>FLIGHT CONTROLS</strong><br>
            SPACE: Climb<br>
            SHIFT: Descend<br>
            W/S: Pitch<br>
            A/D: Roll<br>
            Q/E: Yaw<br>
            <br>
            <strong>HELICOPTERS</strong><br>
            1-5: Switch Types<br>
            F: Autorotation<br>
            T: Weather Effects<br>
            <br>
            <strong>SYSTEM</strong><br>
            R: Toggle Reality Layer<br>
            M: Mute/Unmute Audio<br>
            ENTER: Meditation Mode<br>
            <br>
            <em>Explore the philosophical zones</em>
        `;
        
        document.body.appendChild(helpDiv);
        
        // Add CSS for fadeInOut animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupAdditionalUI() {
        this.timeElement = document.getElementById('time-info');
        this.weatherElement = document.getElementById('weather-info');
        this.themeElement = document.getElementById('theme-info');
    }
    
    updateTimeInfo(dayNightCycle) {
        if (this.timeElement && dayNightCycle) {
            const phaseInfo = dayNightCycle.getCurrentPhaseInfo();
            this.timeElement.textContent = `${phaseInfo.timeString} - ${phaseInfo.name}`;
            
            // Store current time of day for meditation UI
            this.currentTimeOfDay = phaseInfo.phase || 'day';
        }
    }
    
    updateWeatherInfo(weatherSystem) {
        if (this.weatherElement && weatherSystem) {
            const weatherInfo = weatherSystem.getCurrentWeatherInfo();
            this.weatherElement.textContent = `${weatherInfo.name}`;
        }
    }
    
    updateThemeInfo(customization) {
        if (this.themeElement && customization) {
            const currentTheme = customization.getCurrentTheme();
            this.themeElement.textContent = `Theme: ${currentTheme.name}`;
        }
    }
    
    toggleRealityLayer() {
        this.currentRealityLayer = this.currentRealityLayer === 'Simulation' ? 'Code View' : 'Simulation';
        
        // Could trigger visual changes in the renderer here
        // For now, just update the display
        if (this.realityLayerElement) {
            this.realityLayerElement.textContent = this.currentRealityLayer;
        }
    }
    
    setupEnhancedHUD() {
        // Create helicopter info panel
        const helicopterInfoDiv = document.createElement('div');
        helicopterInfoDiv.id = 'helicopter-info';
        helicopterInfoDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 15px;
            border: 1px solid #003300;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 100;
            min-width: 200px;
        `;
        
        helicopterInfoDiv.innerHTML = `
            <div style="margin-bottom: 10px; border-bottom: 1px solid #003300; padding-bottom: 5px;">
                <strong>HELICOPTER STATUS</strong>
            </div>
            <div>Type: <span id="heli-type">Matrix Scout</span></div>
            <div>Mass: <span id="heli-mass">800</span> kg</div>
            <div>Max Lift: <span id="heli-lift">12000</span> N</div>
            <div style="margin-top: 10px;">
                <div>Collective: <span id="control-collective">0.00</span></div>
                <div>Pitch: <span id="control-pitch">0.00</span></div>
                <div>Roll: <span id="control-roll">0.00</span></div>
                <div>Yaw: <span id="control-yaw">0.00</span></div>
            </div>
        `;
        
        document.body.appendChild(helicopterInfoDiv);
        this.helicopterInfoElement = helicopterInfoDiv;
        
        // Create advanced status panel
        const advancedStatusDiv = document.createElement('div');
        advancedStatusDiv.id = 'advanced-status';
        advancedStatusDiv.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 15px;
            border: 1px solid #003300;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            z-index: 100;
            min-width: 250px;
        `;
        
        advancedStatusDiv.innerHTML = `
            <div style="margin-bottom: 10px; border-bottom: 1px solid #003300; padding-bottom: 5px;">
                <strong>ADVANCED FLIGHT STATUS</strong>
            </div>
            <div class="status-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                <div>Ground Effect: <span id="ground-effect">No</span></div>
                <div>Vortex Ring: <span id="vortex-ring">No</span></div>
                <div>Autorotation: <span id="autorotation">No</span></div>
                <div>Ground Contact: <span id="ground-contact">No</span></div>
                <div>Torque: <span id="torque">0.00</span></div>
                <div>Wind Speed: <span id="wind-speed">0.0</span> m/s</div>
            </div>
        `;
        
        document.body.appendChild(advancedStatusDiv);
        this.advancedStatusElement = advancedStatusDiv;
    }
    
    updateHelicopterInfo(flightData) {
        if (!flightData.helicopter || !this.helicopterInfoElement) return;
        
        const typeElement = document.getElementById('heli-type');
        const massElement = document.getElementById('heli-mass');
        const liftElement = document.getElementById('heli-lift');
        
        if (typeElement) typeElement.textContent = flightData.helicopter.type;
        
        // Update controls display
        if (flightData.controls) {
            const collectiveElement = document.getElementById('control-collective');
            const pitchElement = document.getElementById('control-pitch');
            const rollElement = document.getElementById('control-roll');
            const yawElement = document.getElementById('control-yaw');
            
            if (collectiveElement) collectiveElement.textContent = flightData.controls.collective;
            if (pitchElement) pitchElement.textContent = flightData.controls.cyclicPitch;
            if (rollElement) rollElement.textContent = flightData.controls.cyclicRoll;
            if (yawElement) yawElement.textContent = flightData.controls.pedal;
        }
    }
    
    updateAdvancedStatus(flightData) {
        if (!flightData.advancedStatus || !this.advancedStatusElement) return;
        
        const status = flightData.advancedStatus;
        
        const groundEffectElement = document.getElementById('ground-effect');
        const vortexRingElement = document.getElementById('vortex-ring');
        const autorotationElement = document.getElementById('autorotation');
        const groundContactElement = document.getElementById('ground-contact');
        const torqueElement = document.getElementById('torque');
        const windSpeedElement = document.getElementById('wind-speed');
        
        if (groundEffectElement) {
            groundEffectElement.textContent = status.groundEffect ? 'Yes' : 'No';
            groundEffectElement.style.color = status.groundEffect ? '#ffaa00' : '#00ff00';
        }
        
        if (vortexRingElement) {
            vortexRingElement.textContent = status.vortexRingState ? 'DANGER' : 'No';
            vortexRingElement.style.color = status.vortexRingState ? '#ff4400' : '#00ff00';
        }
        
        if (autorotationElement) {
            autorotationElement.textContent = status.autorotation ? 'ACTIVE' : 'No';
            autorotationElement.style.color = status.autorotation ? '#ff8800' : '#00ff00';
        }
        
        if (groundContactElement) {
            groundContactElement.textContent = status.groundContact ? 'Yes' : 'No';
            groundContactElement.style.color = status.groundContact ? '#ffaa00' : '#00ff00';
        }
        
        if (torqueElement) torqueElement.textContent = status.torque;
        if (windSpeedElement) windSpeedElement.textContent = status.windSpeed;
    }
    
    // Meditation UI delegation methods
    toggleMeditationMode() {
        this.meditationUI.toggleMeditationMode();
    }
    
    isInMeditationMode() {
        return this.meditationUI.isInMeditationMode();
    }
}