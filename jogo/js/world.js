export function createWorld(scene) {
    // 1. Chão Principal (Grama / Perímetro)
    const terrainGeo = new THREE.PlaneGeometry(800, 800);
    const terrainMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.9 });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 2. Ruas em Asfalto Escuro e Calçadas Elevadas
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.6 });
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x718096, roughness: 0.8 });

    // Grid de Ruas (Cruzamento Central)
    const roadWidth = 18;
    const roadH = new THREE.Mesh(new THREE.PlaneGeometry(800, roadWidth), roadMat);
    roadH.rotation.x = -Math.PI / 2;
    roadH.position.y = 0.05;
    roadH.receiveShadow = true;
    scene.add(roadH);

    const roadV = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, 800), roadMat);
    roadV.rotation.x = -Math.PI / 2;
    roadV.position.y = 0.06;
    roadV.receiveShadow = true;
    scene.add(roadV);

    // Adicionar Faixas de Pedestres
    createCrosswalks(scene);

    // 3. Prédios Especiais com Placas e Entradas Proporcionais
    const specialBuildings = [
        { name: "GOVERNO", icon: "🏛️", color: 0x3182ce, x: -45, z: -45, w: 22, h: 14, d: 22 },
        { name: "BANCO", icon: "🏦", color: 0xd69e2e, x: 45, z: -45, w: 20, h: 18, d: 20 },
        { name: "ESCRITÓRIO", icon: "🏢", color: 0x805ad5, x: -45, z: 45, w: 20, h: 22, d: 20 },
        { name: "RESTAURANTE", icon: "🍔", color: 0xdd6b20, x: 45, z: 45, w: 18, h: 10, d: 18 }
    ];

    specialBuildings.forEach(b => {
        // Bloco da Calçada
        const sw = new THREE.Mesh(new THREE.BoxGeometry(b.w + 6, 0.4, b.d + 6), sidewalkMat);
        sw.position.set(b.x, 0.2, b.z);
        sw.receiveShadow = true;
        scene.add(sw);

        // Corpo do Prédio
        const buildingMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.4 });
        const building = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), buildingMat);
        building.position.set(b.x, b.h / 2 + 0.4, b.z);
        building.castShadow = true;
        building.receiveShadow = true;
        scene.add(building);

        // Detalhes: Porta de Entrada
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x1a202c });
        const door = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.2), doorMat);
        door.position.set(b.x, 2.4, b.z + (b.d / 2) + 0.1);
        scene.add(door);

        // Placa com Iluminação
        const signMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x222222 });
        const sign = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.7, 2.5, 0.6), signMat);
        sign.position.set(b.x, b.h - 2, b.z + (b.d / 2) + 0.3);
        scene.add(sign);

        // Detalhes: Fileiras de Janelas Low-Poly
        createWindows(scene, b.x, b.z, b.w, b.h, b.d);
    });

    // 4. Elementos Urbanos (Árvores e Postes com Luz)
    createProps(scene);

    // 5. Iluminação Principal e Iluminação de Ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xfff5ea, 1.1);
    sun.position.set(100, 150, 80);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 400;

    const d = 150;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;

    scene.add(sun);
}

function createCrosswalks(scene) {
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xedf2f7 });
    for (let i = -6; i <= 6; i += 2) {
        // Faixa Norte
        const stripeN = new THREE.Mesh(new THREE.PlaneGeometry(1, 4), stripeMat);
        stripeN.rotation.x = -Math.PI / 2;
        stripeN.position.set(i, 0.08, -12);
        scene.add(stripeN);

        // Faixa Sul
        const stripeS = new THREE.Mesh(new THREE.PlaneGeometry(1, 4), stripeMat);
        stripeS.rotation.x = -Math.PI / 2;
        stripeS.position.set(i, 0.08, 12);
        scene.add(stripeS);
    }
}

function createWindows(scene, x, z, w, h, d) {
    const winMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1 });
    const rows = Math.floor(h / 4);
    const cols = Math.floor(w / 4);

    for (let r = 1; r < rows; r++) {
        for (let c = -cols / 2 + 0.5; c < cols / 2; c++) {
            const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2), winMat);
            win.position.set(x + c * 3.5, r * 3.5, z + (d / 2) + 0.1);
            scene.add(win);
        }
    }
}

function createProps(scene) {
    // Árvores Low-Poly
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x744210 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2f855a, roughness: 0.5 });

    const treePositions = [
        { x: -15, z: -15 }, { x: 15, z: -15 },
        { x: -15, z: 15 }, { x: 15, z: 15 }
    ];

    treePositions.forEach(pos => {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3, 6), trunkMat);
        trunk.position.set(pos.x, 1.5, pos.z);
        trunk.castShadow = true;
        scene.add(trunk);

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 6), leavesMat);
        leaves.position.set(pos.x, 4.5, pos.z);
        leaves.castShadow = true;
        scene.add(leaves);
    });
}