import * as THREE from 'three';

export class AudioManager {
    constructor() {
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        
        // Audio categories
        this.ambientSounds = {};
        this.helicopterSounds = {};
        this.narrationAudio = {};
        this.zoneAmbients = {};
        
        // Audio states
        this.currentAmbient = null;
        this.currentNarration = null;
        this.masterVolume = 0.7;
        this.ambientVolume = 0.4;
        this.narrationVolume = 0.8;
        this.helicopterVolume = 0.3;
        
        // Spatial audio settings
        this.maxDistance = 200;
        this.refDistance = 50;
        
        this.initializeAudio();
    }
    
    initializeAudio() {
        // Create audio context if needed
        if (typeof AudioContext !== 'undefined') {
            this.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new webkitAudioContext();
        }
        
        // Create procedural ambient sounds
        this.createProceduralAmbients();
        this.createHelicopterSounds();
        this.createNarrationTracks();
        this.createZoneAmbients();
        
        // Start with general ambient
        this.playAmbient('matrix_void');
    }
    
    createProceduralAmbients() {
        // Matrix void ambient (base ambient sound)
        this.ambientSounds.matrix_void = this.createMatrixVoidAmbient();
        
        // Digital wind
        this.ambientSounds.digital_wind = this.createDigitalWindAmbient();
        
        // Deep meditation drone
        this.ambientSounds.meditation_drone = this.createMeditationDrone();
    }
    
    createMatrixVoidAmbient() {
        // Create a low-frequency ambient hum with digital artifacts
        const audio = new THREE.Audio(this.listener);
        
        if (this.audioContext) {
            // Create oscillators for the ambient sound
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(55, this.audioContext.currentTime); // Low A
            
            oscillator2.type = 'triangle';
            oscillator2.frequency.setValueAtTime(82.4, this.audioContext.currentTime); // Low E
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            filter.Q.setValueAtTime(10, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(this.ambientVolume * 0.3, this.audioContext.currentTime);
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.start();
            oscillator2.start();
            
            // Add subtle modulation
            setInterval(() => {
                if (this.audioContext) {
                    const time = this.audioContext.currentTime;
                    oscillator1.frequency.setValueAtTime(55 + Math.sin(time * 0.1) * 2, time);
                    oscillator2.frequency.setValueAtTime(82.4 + Math.cos(time * 0.07) * 1.5, time);
                }
            }, 100);
        }
        
        return {
            audio: audio,
            isPlaying: false,
            loop: true,
            volume: this.ambientVolume * 0.3
        };
    }
    
    createDigitalWindAmbient() {
        const audio = new THREE.Audio(this.listener);
        
        if (this.audioContext) {
            // Create white noise filtered to sound like digital wind
            const bufferSize = 4096;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    channelData[i] = Math.random() * 2 - 1;
                }
            }
            
            const whiteNoise = this.audioContext.createBufferSource();
            whiteNoise.buffer = buffer;
            whiteNoise.loop = true;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
            filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.ambientVolume * 0.2, this.audioContext.currentTime);
            
            whiteNoise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            whiteNoise.start();
        }
        
        return {
            audio: audio,
            isPlaying: false,
            loop: true,
            volume: this.ambientVolume * 0.2
        };
    }
    
    createMeditationDrone() {
        const audio = new THREE.Audio(this.listener);
        
        if (this.audioContext) {
            // Create a calming drone with overtones
            const fundamental = this.audioContext.createOscillator();
            const overtone1 = this.audioContext.createOscillator();
            const overtone2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            fundamental.type = 'sine';
            fundamental.frequency.setValueAtTime(110, this.audioContext.currentTime); // A2
            
            overtone1.type = 'sine';
            overtone1.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
            
            overtone2.type = 'sine';
            overtone2.frequency.setValueAtTime(330, this.audioContext.currentTime); // E4
            
            gainNode.gain.setValueAtTime(this.ambientVolume * 0.25, this.audioContext.currentTime);
            
            fundamental.connect(gainNode);
            overtone1.connect(gainNode);
            overtone2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            fundamental.start();
            overtone1.start();
            overtone2.start();
        }
        
        return {
            audio: audio,
            isPlaying: false,
            loop: true,
            volume: this.ambientVolume * 0.25
        };
    }
    
    createHelicopterSounds() {
        // Procedural helicopter rotor sounds
        this.helicopterSounds.rotor_main = this.createRotorSound('main', 8); // Main rotor ~8Hz
        this.helicopterSounds.rotor_tail = this.createRotorSound('tail', 25); // Tail rotor ~25Hz
        this.helicopterSounds.engine = this.createEngineSound();
    }
    
    createRotorSound(type, baseFreq) {
        if (!this.audioContext) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(type === 'main' ? 150 : 800, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        
        return {
            oscillator: oscillator,
            gainNode: gainNode,
            filter: filter,
            baseFreq: baseFreq,
            volume: this.helicopterVolume * (type === 'main' ? 0.7 : 0.4)
        };
    }
    
    createEngineSound() {
        if (!this.audioContext) return null;
        
        // Create engine noise
        const bufferSize = 2048;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        const engineNoise = this.audioContext.createBufferSource();
        engineNoise.buffer = buffer;
        engineNoise.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
        filter.Q.setValueAtTime(2, this.audioContext.currentTime);
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        engineNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        engineNoise.start();
        
        return {
            source: engineNoise,
            gainNode: gainNode,
            filter: filter,
            volume: this.helicopterVolume * 0.3
        };
    }
    
    createNarrationTracks() {
        // Philosophical narration content (text-to-speech would be implemented here)
        this.narrationContent = {
            'cave_of_shadows': {
                text: "In this cave, shadows dance on walls... Are they real, or merely projections of a deeper truth? What you see may not be what is...",
                duration: 8000
            },
            'garden_of_paths': {
                text: "Every choice creates infinite realities... In this garden, all paths exist simultaneously. Which path will you choose, knowing all are valid?",
                duration: 9000
            },
            'observers_paradox': {
                text: "The very act of observation changes reality... Your consciousness shapes what you perceive. Are you creating this world, or discovering it?",
                duration: 10000
            },
            'ship_theseus': {
                text: "If every part of a ship is replaced, is it still the same ship? If every thought is replaced, are you still you?",
                duration: 8500
            },
            'meditation_intro': {
                text: "Welcome to the space between thoughts... Here, in the digital void, find the peace beyond understanding...",
                duration: 7000
            }
        };
    }
    
    createZoneAmbients() {
        // Different ambient sounds for each philosophical zone
        this.zoneAmbients['cave_of_shadows'] = this.createCaveAmbient();
        this.zoneAmbients['garden_of_paths'] = this.createGardenAmbient();
        this.zoneAmbients['observers_paradox'] = this.createQuantumAmbient();
        this.zoneAmbients['ship_theseus'] = this.createMemoryAmbient();
    }
    
    createCaveAmbient() {
        // Deep cave reverb with dripping sounds
        if (!this.audioContext) return null;
        
        const reverb = this.audioContext.createConvolver();
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.ambientVolume * 0.4, this.audioContext.currentTime);
        
        return {
            node: reverb,
            gainNode: gainNode,
            volume: this.ambientVolume * 0.4
        };
    }
    
    createGardenAmbient() {
        // Layered harmonic tones suggesting infinite possibilities
        if (!this.audioContext) return null;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.ambientVolume * 0.3, this.audioContext.currentTime);
        
        return {
            gainNode: gainNode,
            volume: this.ambientVolume * 0.3
        };
    }
    
    createQuantumAmbient() {
        // Unpredictable quantum-like audio fluctuations
        if (!this.audioContext) return null;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.ambientVolume * 0.35, this.audioContext.currentTime);
        
        return {
            gainNode: gainNode,
            volume: this.ambientVolume * 0.35
        };
    }
    
    createMemoryAmbient() {
        // Echoing, fragmented sounds suggesting memory and identity
        if (!this.audioContext) return null;
        
        const delay = this.audioContext.createDelay();
        const feedback = this.audioContext.createGain();
        const gainNode = this.audioContext.createGain();
        
        delay.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);
        feedback.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(this.ambientVolume * 0.3, this.audioContext.currentTime);
        
        return {
            delay: delay,
            feedback: feedback,
            gainNode: gainNode,
            volume: this.ambientVolume * 0.3
        };
    }
    
    // Public methods for controlling audio
    playAmbient(ambientName) {
        if (this.currentAmbient && this.ambientSounds[this.currentAmbient]) {
            this.stopAmbient();
        }
        
        if (this.ambientSounds[ambientName]) {
            this.currentAmbient = ambientName;
            this.ambientSounds[ambientName].isPlaying = true;
        }
    }
    
    stopAmbient() {
        if (this.currentAmbient && this.ambientSounds[this.currentAmbient]) {
            this.ambientSounds[this.currentAmbient].isPlaying = false;
            this.currentAmbient = null;
        }
    }
    
    playNarration(narrationKey) {
        if (this.currentNarration) {
            this.stopNarration();
        }
        
        if (this.narrationContent[narrationKey]) {
            this.currentNarration = narrationKey;
            
            // For now, show text. In production, this would trigger TTS
            console.log(`[NARRATION] ${this.narrationContent[narrationKey].text}`);
            
            // Auto-stop after duration
            setTimeout(() => {
                this.stopNarration();
            }, this.narrationContent[narrationKey].duration);
        }
    }
    
    stopNarration() {
        this.currentNarration = null;
    }
    
    updateHelicopterAudio(flightData) {
        if (!this.audioContext) return;
        
        const { collective, speed } = flightData;
        
        // Update main rotor based on collective
        if (this.helicopterSounds.rotor_main) {
            const mainRotorVolume = collective * this.helicopterSounds.rotor_main.volume;
            this.helicopterSounds.rotor_main.gainNode.gain.setValueAtTime(
                mainRotorVolume, 
                this.audioContext.currentTime
            );
            
            // Vary frequency slightly based on load
            const freqVariation = collective * 2;
            this.helicopterSounds.rotor_main.oscillator.frequency.setValueAtTime(
                this.helicopterSounds.rotor_main.baseFreq + freqVariation,
                this.audioContext.currentTime
            );
        }
        
        // Update tail rotor
        if (this.helicopterSounds.rotor_tail) {
            const tailRotorVolume = Math.max(0.3, collective) * this.helicopterSounds.rotor_tail.volume;
            this.helicopterSounds.rotor_tail.gainNode.gain.setValueAtTime(
                tailRotorVolume,
                this.audioContext.currentTime
            );
        }
        
        // Update engine based on speed
        if (this.helicopterSounds.engine) {
            const engineVolume = (0.3 + speed * 0.01) * this.helicopterSounds.engine.volume;
            this.helicopterSounds.engine.gainNode.gain.setValueAtTime(
                Math.min(engineVolume, this.helicopterSounds.engine.volume),
                this.audioContext.currentTime
            );
        }
    }
    
    enterZone(zoneName) {
        // Play zone-specific ambient and narration
        const zoneMap = {
            'Cave of Shadows': 'cave_of_shadows',
            'Garden of Forking Paths': 'garden_of_paths',
            "Observer's Paradox": 'observers_paradox',
            'Ship of Theseus': 'ship_theseus'
        };
        
        const zoneKey = zoneMap[zoneName];
        if (zoneKey) {
            // Play narration for the zone
            this.playNarration(zoneKey);
            
            // Switch to zone-specific ambient if available
            if (this.zoneAmbients[zoneKey]) {
                this.playAmbient('meditation_drone');
            }
        }
    }
    
    exitZone() {
        // Return to general ambient
        this.playAmbient('matrix_void');
        this.stopNarration();
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.audioContext) {
            this.audioContext.destination.gain?.setValueAtTime?.(
                this.masterVolume, 
                this.audioContext.currentTime
            );
        }
    }
    
    // Resume audio context (needed for user interaction requirement)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    update(deltaTime) {
        // Update any time-based audio effects here
        if (this.audioContext && this.currentAmbient) {
            // Add subtle variations to ambient sounds
            const time = this.audioContext.currentTime;
            
            // Example: subtle volume fluctuations for immersion
            if (this.ambientSounds[this.currentAmbient]) {
                const variation = Math.sin(time * 0.1) * 0.05;
                // Apply variation if supported
            }
        }
    }
}