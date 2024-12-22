const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151620);

const camera = new THREE.PerspectiveCamera(
    40,  // Reduced FOV to zoom in (default is 70)
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Move the camera closer to the model (adjust to zoom in further)
camera.position.set(10, 5, 50); // Camera position closer to the scene
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.75;

document.querySelector(".garage").appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0x404040, 1);  // Soft white ambient light with intensity 1
scene.add(ambientLight);

// Add a single Directional light to illuminate the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Intensity set to 1
directionalLight.position.set(5, 10, 5); // Light position
directionalLight.castShadow = true;
scene.add(directionalLight);

// Shadow settings for better shadow quality (optional)
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;


// Create a white point light
const pointLight = new THREE.PointLight(0xffffff, 1, 50);  // Color, intensity, distance
pointLight.position.set(0, 10, 0);  // Set the position of the light
scene.add(pointLight);

// Create the first point light (Red light)
// Create the first point light (Red light)
const pointLight1 = new THREE.PointLight(0xff0000, 1, 50); // Red light
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

// Create the second point light (Green light)
const pointLight2 = new THREE.PointLight(0x00ff00, 1, 50); // Green light
pointLight2.position.set(-10, 10, 10);
scene.add(pointLight2);

// Create the third point light (Blue light)
const pointLight3 = new THREE.PointLight(0x0000ff, 1, 50); // Blue light
pointLight3.position.set(10, -10, 10);
scene.add(pointLight3);

// Create the fourth point light (Yellow light)
const pointLight4 = new THREE.PointLight(0xffff00, 1, 50); // Yellow light
pointLight4.position.set(-10, -10, 10);
scene.add(pointLight4);


// Create a white point light behind the object to simulate backlighting
const backlight = new THREE.PointLight(0xffffff, 1, 50);  // White light, intensity of 1, and distance of 50
backlight.position.set(0, 10, -30);  // Position the light behind the object (along negative Z axis)
scene.add(backlight);


// OrbitControls setup for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 0, 0);

// Set up EffectComposer for post-processing
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

// Add a bloom effect (UnrealBloomPass)
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // Strength of the bloom
    0.4,  // Radius of the bloom
    0.85  // Threshold of the bloom
);
composer.addPass(bloomPass);

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load("./assests/cyber.glb", function (gltf) {
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    // Traverse the model and apply emissive materials to the neon parts
    model.traverse((child) => {
        if (child.isMesh) {
            if (child.name === "neon_part1" || child.name === "neon_part2") {
                child.material.emissive = new THREE.Color(0x00ff00);  // Green neon glow
                child.material.emissiveIntensity = 0.8;  // Adjust the emissive intensity
                child.material.needsUpdate = true;  // Update the material to reflect the changes
            }
        }
    });

    scene.add(model);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render(); // Use composer to apply post-processing
}

animate();
