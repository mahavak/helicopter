export class UIManager {
    constructor() {
        this.altitudeElement = document.getElementById('altitude');
        this.speedElement = document.getElementById('speed');
        this.realityLayerElement = document.getElementById('reality-layer');
        this.timeElement = null;
        this.weatherElement = null;
        this.themeElement = null;
        this.achievementElement = null;
        
        this.currentRealityLayer = 'Simulation';
        this.lastPhilosophicalZone = null;
        
        this.setupKeyboardHelp();
        this.setupAdditionalUI();
    }
    
    update(flightData) {
        if (this.altitudeElement) {
            this.altitudeElement.textContent = flightData.altitude;
        }
        
        if (this.speedElement) {
            this.speedElement.textContent = flightData.speed;
        }
        
        // Check if near philosophical zones
        this.checkPhilosophicalProximity(flightData.position);
        
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
            <strong>SYSTEM</strong><br>
            R: Toggle Reality Layer<br>
            M: Mute/Unmute Audio<br>
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
}