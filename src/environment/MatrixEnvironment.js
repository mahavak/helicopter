import * as THREE from 'three';

export class MatrixEnvironment {
    constructor(scene) {
        this.scene = scene;
        this.philosophicalZones = [];
        
        this.createBasicEnvironment();
        this.createPhilosophicalZones();
    }
    
    createBasicEnvironment() {
        // Matrix-style grid ground
        const gridSize = 1000;
        const gridDivisions = 100;
        
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x003300, 0x001100);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        
        // Ambient lighting with Matrix green tint
        const ambientLight = new THREE.AmbientLight(0x003300, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light (simulating distant digital sun)
        const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.5);
        directionalLight.position.set(100, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Create distant matrix walls
        this.createMatrixWalls();
    }
    
    createMatrixWalls() {
        const wallGeometry = new THREE.PlaneGeometry(500, 300);
        const wallMaterial = new THREE.MeshBasicMaterial({
            color: 0x001100,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        // Create walls at cardinal directions
        const positions = [
            { x: 400, y: 150, z: 0, rotY: -Math.PI/2 },
            { x: -400, y: 150, z: 0, rotY: Math.PI/2 },
            { x: 0, y: 150, z: 400, rotY: 0 },
            { x: 0, y: 150, z: -400, rotY: Math.PI }
        ];
        
        positions.forEach(pos => {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.position.set(pos.x, pos.y, pos.z);
            wall.rotation.y = pos.rotY;
            this.scene.add(wall);
        });
    }
    
    createPhilosophicalZones() {
        // Zone 1: The Cave of Shadows (Plato's Allegory)
        this.createCaveOfShadows();
        
        // Zone 2: The Garden of Forking Paths (Free Will)
        this.createGardenOfForkingPaths();
        
        // Zone 3: The Observer's Paradox
        this.createObserversParadox();
        
        // Zone 4: The Ship of Theseus Memorial
        this.createShipOfTheseus();
    }
    
    createCaveOfShadows() {
        const zone = {
            name: "Cave of Shadows",
            position: new THREE.Vector3(-200, 50, 200),
            objects: []
        };
        
        // Create cave entrance
        const caveGeometry = new THREE.CylinderGeometry(20, 25, 40, 8);
        const caveMaterial = new THREE.MeshPhongMaterial({
            color: 0x002200,
            transparent: true,
            opacity: 0.8
        });
        
        const cave = new THREE.Mesh(caveGeometry, caveMaterial);
        cave.position.copy(zone.position);
        cave.rotation.x = Math.PI / 2;
        this.scene.add(cave);
        zone.objects.push(cave);
        
        // Create dancing shadows on the cave wall
        for (let i = 0; i < 5; i++) {
            const shadowGeometry = new THREE.PlaneGeometry(5, 8);
            const shadowMaterial = new THREE.MeshBasicMaterial({
                color: 0x004400,
                transparent: true,
                opacity: 0.6
            });
            
            const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
            shadow.position.set(
                zone.position.x + Math.random() * 30 - 15,
                zone.position.y + Math.random() * 10,
                zone.position.z - 20
            );
            this.scene.add(shadow);
            zone.objects.push(shadow);
        }
        
        // Add floating text
        this.addPhilosophicalText(
            zone.position.clone().add(new THREE.Vector3(0, 30, 0)),
            "What if what you see\nis just projection?"
        );
        
        this.philosophicalZones.push(zone);
    }
    
    createGardenOfForkingPaths() {
        const zone = {
            name: "Garden of Forking Paths", 
            position: new THREE.Vector3(200, 30, -200),
            objects: []
        };
        
        // Create branching pathways
        const pathMaterial = new THREE.MeshBasicMaterial({
            color: 0x003300,
            transparent: true,
            opacity: 0.7
        });
        
        // Main path
        const mainPathGeometry = new THREE.BoxGeometry(60, 1, 5);
        const mainPath = new THREE.Mesh(mainPathGeometry, pathMaterial);
        mainPath.position.copy(zone.position);
        this.scene.add(mainPath);
        zone.objects.push(mainPath);
        
        // Branching paths
        for (let i = 0; i < 8; i++) {
            const branchGeometry = new THREE.BoxGeometry(30, 1, 3);
            const branch = new THREE.Mesh(branchGeometry, pathMaterial);
            
            const angle = (i / 8) * Math.PI * 2;
            branch.position.set(
                zone.position.x + Math.cos(angle) * 40,
                zone.position.y,
                zone.position.z + Math.sin(angle) * 40
            );
            branch.rotation.y = angle;
            this.scene.add(branch);
            zone.objects.push(branch);
        }
        
        this.addPhilosophicalText(
            zone.position.clone().add(new THREE.Vector3(0, 40, 0)),
            "Do your choices matter\nif all paths exist?"
        );
        
        this.philosophicalZones.push(zone);
    }
    
    createObserversParadox() {
        const zone = {
            name: "Observer's Paradox",
            position: new THREE.Vector3(0, 80, 0),
            objects: []
        };
        
        // Create quantum cubes that phase in and out
        for (let i = 0; i < 12; i++) {
            const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
            const cubeMaterial = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.5,
                wireframe: Math.random() > 0.5
            });
            
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            const angle = (i / 12) * Math.PI * 2;
            cube.position.set(
                zone.position.x + Math.cos(angle) * 50,
                zone.position.y + Math.random() * 30,
                zone.position.z + Math.sin(angle) * 50
            );
            
            // Add rotation animation data
            cube.userData = {
                rotationSpeed: Math.random() * 0.02,
                phaseSpeed: Math.random() * 2 + 1
            };
            
            this.scene.add(cube);
            zone.objects.push(cube);
        }
        
        this.addPhilosophicalText(
            zone.position.clone().add(new THREE.Vector3(0, 50, 0)),
            "Does consciousness\ncreate reality?"
        );
        
        this.philosophicalZones.push(zone);
    }
    
    createShipOfTheseus() {
        const zone = {
            name: "Ship of Theseus Memorial",
            position: new THREE.Vector3(-100, 60, -100),
            objects: []
        };
        
        // Create a large helicopter being rebuilt
        const helicopterParts = [];
        
        // Main body parts
        for (let i = 0; i < 6; i++) {
            const partGeometry = new THREE.BoxGeometry(4, 2, 8);
            const partMaterial = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? 0x003300 : 0x001100,
                transparent: true,
                opacity: 0.6 + Math.random() * 0.4
            });
            
            const part = new THREE.Mesh(partGeometry, partMaterial);
            part.position.set(
                zone.position.x + i * 5 - 12,
                zone.position.y + Math.random() * 10,
                zone.position.z
            );
            
            // Phase in/out animation data
            part.userData = {
                originalOpacity: part.material.opacity,
                phaseSpeed: Math.random() * 1 + 0.5
            };
            
            this.scene.add(part);
            zone.objects.push(part);
            helicopterParts.push(part);
        }
        
        this.addPhilosophicalText(
            zone.position.clone().add(new THREE.Vector3(0, 40, 0)),
            "If every part changes\nam I still me?"
        );
        
        this.philosophicalZones.push(zone);
    }
    
    addPhilosophicalText(position, text) {
        // Create floating text using sprites
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#00ff00';
        context.font = '24px Courier New';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            context.fillText(
                line, 
                canvas.width / 2, 
                canvas.height / 2 + (index - lines.length / 2 + 0.5) * 30
            );
        });
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        sprite.position.copy(position);
        sprite.scale.set(50, 25, 1);
        
        this.scene.add(sprite);
    }
    
    update(deltaTime) {
        // Update philosophical zones animations
        this.philosophicalZones.forEach(zone => {
            zone.objects.forEach(obj => {
                if (obj.userData.rotationSpeed) {
                    obj.rotation.x += obj.userData.rotationSpeed;
                    obj.rotation.y += obj.userData.rotationSpeed * 0.7;
                    obj.rotation.z += obj.userData.rotationSpeed * 0.3;
                }
                
                if (obj.userData.phaseSpeed) {
                    const time = Date.now() * 0.001;
                    const phase = Math.sin(time * obj.userData.phaseSpeed) * 0.5 + 0.5;
                    obj.material.opacity = 0.3 + phase * 0.6;
                }
                
                if (obj.userData.originalOpacity !== undefined) {
                    const time = Date.now() * 0.001;
                    const phase = Math.sin(time * obj.userData.phaseSpeed) * 0.5 + 0.5;
                    obj.material.opacity = obj.userData.originalOpacity * (0.3 + phase * 0.7);
                }
            });
        });
    }
}