// ===== Three.js Setup =====
let scene, camera, renderer;
let particles = [];
let shapes = [];
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.0015);

    // Camera setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    // Renderer setup
    const canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // Create particle system
    createParticles();

    // Create floating objects with enhanced animations
    createFloatingObjects();

    // Lighting - more dramatic
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x0ea5e9, 1.5, 150);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 1, 120);
    pointLight2.position.set(-50, -30, 30);
    scene.add(pointLight2);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Mouse tracking
    document.addEventListener('mousemove', onMouseMove);

    // Start animation loop
    animate();
}

function createParticles() {
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 250;
        positions[i + 1] = (Math.random() - 0.5) * 250;
        positions[i + 2] = (Math.random() - 0.5) * 250;

        // Color variation
        colors[i] = Math.random() * 0.5 + 0.3;
        colors[i + 1] = Math.random() * 0.8 + 0.2;
        colors[i + 2] = Math.random() * 0.6 + 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
        vertexColors: true
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    particles.push({
        mesh: particleSystem,
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
        )
    });
}

function createFloatingObjects() {
    const shapeConfigs = [
        {
            geometry: new THREE.IcosahedronGeometry(6),
            color: 0x0ea5e9,
            emissive: 0x0a7dbf,
            position: [-100, -60, -80]
        },
        {
            geometry: new THREE.OctahedronGeometry(5),
            color: 0xf43f5e,
            emissive: 0xbe123c,
            position: [100, -70, -60]
        },
        {
            geometry: new THREE.TetrahedronGeometry(6),
            color: 0x06b6d4,
            emissive: 0x0891b2,
            position: [-85, 80, -100]
        },
        {
            geometry: new THREE.BoxGeometry(6, 6, 6),
            color: 0x0ea5e9,
            emissive: 0x0a7dbf,
            position: [90, 75, -70]
        },
        {
            geometry: new THREE.DodecahedronGeometry(4),
            color: 0xf43f5e,
            emissive: 0xbe123c,
            position: [-95, -70, -90]
        }
    ];

    shapeConfigs.forEach((config, index) => {
        const material = new THREE.MeshPhongMaterial({
            color: config.color,
            emissive: config.emissive,
            wireframe: false,
            transparent: true,
            opacity: 0.85,
            shininess: 100
        });

        const mesh = new THREE.Mesh(config.geometry, material);
        mesh.position.set(...config.position);
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        shapes.push({
            mesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.015,
                (Math.random() - 0.5) * 0.015,
                (Math.random() - 0.5) * 0.015
            )
        });
    });

    // Create Koenigsegg car
    createKoenigseggCar();
}

function createKoenigseggCar() {
    const carGroup = new THREE.Group();
    carGroup.position.set(0, -12, 0);
    carGroup.scale.set(1.2, 1.2, 1.2);
    
    // Create a more realistic Koenigsegg body using LatheGeometry for aerodynamic curves
    
    // Main chassis/body
    const bodyGeometry = new THREE.BoxGeometry(3.5, 1.4, 9);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xff1744,
        emissive: 0xcc0000,
        shininess: 120,
        reflectivity: 0.8,
        side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.z = 0.2;
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);
    
    // Front spoiler
    const spoilerGeometry = new THREE.BoxGeometry(3.8, 0.3, 0.8);
    const spoilerMaterial = new THREE.MeshPhongMaterial({
        color: 0xcc0000,
        emissive: 0x990000,
        shininess: 100
    });
    const frontSpoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
    frontSpoiler.position.set(0, 0.5, 4.5);
    frontSpoiler.castShadow = true;
    carGroup.add(frontSpoiler);
    
    // Hood - curved front
    const hoodGeometry = new THREE.BoxGeometry(3.3, 0.6, 2);
    const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
    hood.position.set(0, 1.05, 3);
    hood.rotation.x = -0.15;
    hood.castShadow = true;
    carGroup.add(hood);
    
    // Cockpit/cabin - sleek design
    const cabinGeometry = new THREE.BoxGeometry(2.8, 1, 3.5);
    const cabinMaterial = new THREE.MeshPhongMaterial({
        color: 0xdd1133,
        emissive: 0xaa0000,
        shininess: 110
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 1.2, 0.8);
    cabin.castShadow = true;
    carGroup.add(cabin);
    
    // Windshield - large glass area
    const windshieldGeometry = new THREE.BoxGeometry(2.6, 0.8, 2.2);
    const windshieldMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a0a0a,
        transparent: true,
        opacity: 0.4,
        shininess: 120,
        reflectivity: 0.9
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 1.15, 1.5);
    windshield.castShadow = false;
    carGroup.add(windshield);
    
    // Rear spoiler/wing
    const rearWingGeometry = new THREE.BoxGeometry(4.2, 0.2, 0.6);
    const rearWingMaterial = new THREE.MeshPhongMaterial({
        color: 0xaa0000,
        emissive: 0x660000,
        shininess: 90
    });
    const rearWing = new THREE.Mesh(rearWingGeometry, rearWingMaterial);
    rearWing.position.set(0, 1.8, -4.2);
    rearWing.castShadow = true;
    carGroup.add(rearWing);
    
    // Rear bumper
    const bumpGeometry = new THREE.BoxGeometry(3.6, 0.4, 0.5);
    const bump = new THREE.Mesh(bumpGeometry, bodyMaterial);
    bump.position.set(0, 0.5, -4.5);
    bump.castShadow = true;
    carGroup.add(bump);
    
    // Wheels with better detail
    const wheelGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.45, 32);
    const wheelMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a0a0a,
        shininess: 50,
        metalness: 0.6
    });
    
    const rimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.48, 16);
    const rimMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x111111,
        shininess: 80
    });
    
    const wheelPositions = [
        [-1.4, -1, 1.8],
        [1.4, -1, 1.8],
        [-1.4, -1, -2.2],
        [1.4, -1, -2.2]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        rim.position.z = -0.01;
        wheel.add(rim);
        
        carGroup.add(wheel);
    });
    
    // Headlights - LED style
    const headlightGeometry = new THREE.ConeGeometry(0.25, 0.5, 16);
    const headlightMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff88,
        emissive: 0xffff44,
        shininess: 100
    });
    
    const leftLight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftLight.position.set(-0.8, 0.6, 4.3);
    leftLight.rotation.z = -0.3;
    carGroup.add(leftLight);
    
    const rightLight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightLight.position.set(0.8, 0.6, 4.3);
    rightLight.rotation.z = 0.3;
    carGroup.add(rightLight);
    
    // Rear lights - LED clusters
    const rearLightGeometry = new THREE.SphereGeometry(0.18, 12, 12);
    const rearLightMaterial = new THREE.MeshPhongMaterial({
        color: 0xff2222,
        emissive: 0xff0000,
        shininess: 100
    });
    
    const leftRearLight = new THREE.Mesh(rearLightGeometry, rearLightMaterial);
    leftRearLight.position.set(-1.1, 0.5, -4.6);
    carGroup.add(leftRearLight);
    
    const rightRearLight = new THREE.Mesh(rearLightGeometry, rearLightMaterial);
    rightRearLight.position.set(1.1, 0.5, -4.6);
    carGroup.add(rightRearLight);
    
    // Side vents/details
    const ventGeometry = new THREE.BoxGeometry(0.3, 0.2, 1.2);
    const ventMaterial = new THREE.MeshPhongMaterial({
        color: 0x440000,
        emissive: 0x220000,
        shininess: 60
    });
    
    [-1.7, 1.7].forEach(x => {
        const vent = new THREE.Mesh(ventGeometry, ventMaterial);
        vent.position.set(x, 0.6, -1.5);
        carGroup.add(vent);
    });
    
    // Interior detail
    const interiorGeometry = new THREE.BoxGeometry(2.3, 0.4, 2.5);
    const interiorMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        emissive: 0x0a0a0a,
        shininess: 40
    });
    const interior = new THREE.Mesh(interiorGeometry, interiorMaterial);
    interior.position.set(0, 0.8, 0.8);
    carGroup.add(interior);
    
    scene.add(carGroup);
    
    // Store car for animation
    window.car = {
        group: carGroup,
        position: 0,
        time: 0,
        wheels: []
    };
    
    // Get wheel meshes for rotation
    let wheelCount = 0;
    carGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry && wheelCount < 4) {
            window.car.wheels.push(child);
            wheelCount++;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Update shapes with enhanced rotation
    shapes.forEach(shape => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;

        // Boundary bouncing with smooth animation
        if (Math.abs(shape.mesh.position.x) > 80) shape.velocity.x *= -1;
        if (Math.abs(shape.mesh.position.y) > 80) shape.velocity.y *= -1;
        if (Math.abs(shape.mesh.position.z) > 80) shape.velocity.z *= -1;

        shape.mesh.position.add(shape.velocity);
    });

    // Animate car
    if (window.car) {
        const speed = 0.15;
        window.car.position += speed;
        
        // Continuous running animation
        const maxDistance = 60;
        if (window.car.position > maxDistance) {
            window.car.position = -maxDistance;
        }
        
        window.car.group.position.x = window.car.position;
        
        // Rotate wheels
        window.car.wheels.forEach(wheel => {
            if (wheel) {
                wheel.rotation.x += speed * 0.15;
            }
        });
        
        // Slight bobbing animation
        window.car.group.position.y = -15 + Math.sin(window.car.time) * 0.3;
        window.car.time += 0.02;
    }

    // Smooth mouse-based camera movement
    mouse.x += (targetMouse.x - mouse.x) * 0.08;
    mouse.y += (targetMouse.y - mouse.y) * 0.08;

    camera.position.x = mouse.x * 0.08;
    camera.position.y = mouse.y * 0.08;
    camera.lookAt(scene.position);

    // Render scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function onMouseMove(event) {
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Initialize on load
window.addEventListener('load', initThreeJS);

// ===== Custom Cursor =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 80);
});

document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
    cursorFollower.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Form Submission =====
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputs = this.querySelectorAll('input, textarea');
    let allValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allValid = false;
            input.style.borderColor = '#f43f5e';
        } else {
            input.style.borderColor = 'rgba(30, 41, 59, 0.5)';
        }
    });

    if (allValid) {
        alert('Thanks for reaching out! I\'ll get back to you soon. 🚀');
        this.reset();
    }
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach((section, index) => {
    // Show first section immediately, others animate in on scroll
    if (index === 0) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    } else {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    }
    section.style.transition = 'opacity 1s ease, transform 1s ease';
    observer.observe(section);
});

// ===== Navbar Active Link =====
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#0ea5e9';
        } else {
            link.style.color = '#e2e8f0';
        }
    });
});

// ===== Project Filtering =====
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Get filter value
            const filterValue = button.getAttribute('data-filter');

            // Filter projects with animation
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Initialize project filters when DOM is ready
document.addEventListener('DOMContentLoaded', initProjectFilters);

console.log('🚀 Welcome to Gaurav Sonigra\'s 3D Portfolio! Explore the interactive experience.');
