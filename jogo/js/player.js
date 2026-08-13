export class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        // Posição e Física
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3();
        this.moveSpeed = 0;
        this.maxSpeed = 0.14;
        this.runMultiplier = 1.85;
        this.accel = 0.02;
        this.decel = 0.03;

        this.gravity = -0.016;
        this.jumpForce = 0.38;
        this.isGrounded = true;

        // Stamina
        this.stamina = 100;
        this.maxStamina = 100;

        // Câmera Orbital
        this.yaw = 0;
        this.pitch = 0.35; // Ângulo levemente elevado (Third-Person Pro)
        this.camDistance = 14; // Distância confortável sem poluir a visão

        // Teclas
        this.keys = { w: false, a: false, s: false, d: false, space: false, shift: false };

        this.initMesh();
        this.initControls();
    }

    initMesh() {
        // Grupo do Personagem
        this.group = new THREE.Group();

        // Materiais para Roupas Low-Poly
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }); // Camisa Azul
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }); // Calça Escura
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a }); // Sapatos

        // 1. Pernas e Sapatos
        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), pantsMat);
        legR.position.set(0.25, 0.55, 0);
        legR.castShadow = true;
        this.group.add(legR);

        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), pantsMat);
        legL.position.set(-0.25, 0.55, 0);
        legL.castShadow = true;
        this.group.add(legL);

        const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.45), shoeMat);
        shoeR.position.set(0.25, 0.1, 0.05);
        this.group.add(shoeR);

        const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.45), shoeMat);
        shoeL.position.set(-0.25, 0.1, 0.05);
        this.group.add(shoeL);

        // 2. Tronco / Camisa
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.5), shirtMat);
        torso.position.y = 1.7;
        torso.castShadow = true;
        this.group.add(torso);

        // 3. Braços
        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 0.25), shirtMat);
        armR.position.set(0.6, 1.7, 0);
        armR.castShadow = true;
        this.group.add(armR);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 0.25), shirtMat);
        armL.position.set(-0.6, 1.7, 0);
        armL.castShadow = true;
        this.group.add(armL);

        // 4. Cabeça
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), skinMat);
        head.position.y = 2.6;
        head.castShadow = true;
        this.group.add(head);

        this.group.position.copy(this.position);
        this.scene.add(this.group);
    }

    initControls() {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));

        // Controle de Rotação da Câmera (Arrasto / Move)
        let isMouseDown = false;
        window.addEventListener('mousedown', () => isMouseDown = true);
        window.addEventListener('mouseup', () => isMouseDown = false);
        window.addEventListener('mousemove', (e) => {
            if (isMouseDown || document.pointerLockElement === document.body) {
                this.yaw -= e.movementX * 0.003;
                this.pitch -= e.movementY * 0.003;
                // Limite vertical da câmera
                this.pitch = Math.max(0.1, Math.min(1.2, this.pitch));
            }
        });

        // Zoom do Mouse
        window.addEventListener('wheel', (e) => {
            this.camDistance += e.deltaY * 0.01;
            this.camDistance = Math.max(8, Math.min(25, this.camDistance));
        });
    }

    handleKey(e, isDown) {
        switch (e.code) {
            case 'KeyW': this.keys.w = isDown; break;
            case 'KeyS': this.keys.s = isDown; break;
            case 'KeyA': this.keys.a = isDown; break;
            case 'KeyD': this.keys.d = isDown; break;
            case 'Space': this.keys.space = isDown; break;
            case 'ShiftLeft':
            case 'ShiftRight': this.keys.shift = isDown; break;
        }
    }

    update() {
        // 1. Gestão de Stamina
        let isRunning = this.keys.shift && this.stamina > 5 && (this.keys.w || this.keys.s || this.keys.a || this.keys.d);
        let targetMaxSpeed = this.maxSpeed * (isRunning ? this.runMultiplier : 1);

        if (isRunning) {
            this.stamina = Math.max(0, this.stamina - 0.4);
        } else {
            this.stamina = Math.min(this.maxStamina, this.stamina + 0.25);
        }
        document.getElementById('stamina-fill').style.width = `${(this.stamina / this.maxStamina) * 100}%`;

        // 2. Cálculo do Movimento Relativo à Câmera
        const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
        const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

        let inputDir = new THREE.Vector3();
        if (this.keys.w) inputDir.add(forward);
        if (this.keys.s) inputDir.sub(forward);
        if (this.keys.a) inputDir.sub(right);
        if (this.keys.d) inputDir.add(right);

        // Suavização / Aceleração
        if (inputDir.lengthSq() > 0) {
            inputDir.normalize();
            this.moveSpeed = Math.min(targetMaxSpeed, this.moveSpeed + this.accel);

            this.position.x += inputDir.x * this.moveSpeed;
            this.position.z += inputDir.z * this.moveSpeed;

            // Rotacionar personagem para a direção do movimento
            const targetRotation = Math.atan2(inputDir.x, inputDir.z);
            this.group.rotation.y = targetRotation;
        } else {
            this.moveSpeed = Math.max(0, this.moveSpeed - this.decel);
        }

        // 3. Gravidade e Pulo Único
        if (this.keys.space && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }

        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;

        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        this.group.position.copy(this.position);

        // 4. Posicionamento Suave da Câmera Terceira Pessoa
        this.camera.position.x = this.position.x + this.camDistance * Math.sin(this.yaw) * Math.cos(this.pitch);
        this.camera.position.y = this.position.y + 2 + this.camDistance * Math.sin(this.pitch);
        this.camera.position.z = this.position.z + this.camDistance * Math.cos(this.yaw) * Math.cos(this.pitch);

        this.camera.lookAt(this.position.x, this.position.y + 1.8, this.position.z);
    }
}