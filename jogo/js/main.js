import { createWorld } from './world.js';
import { Player } from './player.js';

class GameApp {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.mapOpen = false;

        this.init();
    }

    init() {
        // Cena com Névoa Suave para Sensação de Profundidade
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.004);

        // Câmera
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Renderizador
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Criar Cidade e Player
        createWorld(this.scene);
        this.player = new Player(this.scene, this.camera);

        // Eventos de Teclado (Mapa / Geral)
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM') {
                this.toggleMap();
            }
        });

        window.addEventListener('resize', () => this.onWindowResize());

        // Iniciar Loop
        this.animate();
    }

    toggleMap() {
        this.mapOpen = !this.mapOpen;
        const modal = document.getElementById('map-modal');
        if (this.mapOpen) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    checkProximity() {
        const points = [
            { id: "GOVERNO", title: "PREFEITURA (GOVERNO)", icon: "🏛️", x: -45, z: -32 },
            { id: "BANCO", title: "BANCO CENTRAL", icon: "🏦", x: 45, z: -32 },
            { id: "ESCRITORIO", title: "ESCRITÓRIOS", icon: "🏢", x: -45, z: 32 },
            { id: "RESTAURANTE", title: "RESTAURANTE", icon: "🍔", x: 45, z: 32 }
        ];

        let found = null;
        const p = this.player.position;

        for (let pt of points) {
            const dist = Math.hypot(p.x - pt.x, p.z - pt.z);
            if (dist < 7) {
                found = pt;
                break;
            }
        }

        const card = document.getElementById('interaction-card');
        if (found) {
            document.getElementById('inter-icon').innerText = found.icon;
            document.getElementById('inter-title').innerText = found.title;
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.mapOpen) {
            this.player.update();
            this.checkProximity();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});