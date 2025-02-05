import './style.css'
import * as THREE from 'three';
import { ColorManagement } from 'three';
import goldTexture from './assets/gold.png'
import gpaTexture from './assets/gpa.png'
import inverseTexture from './assets/inverse_gpa.png'

ColorManagement.enabled = false;

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// // Set renderer properties
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0x000000, 1);
// renderer.outputColorSpace = THREE.SRGBColorSpace;

// // Load the background texture
// const textureLoader = new THREE.TextureLoader();
// const backgroundTexture = textureLoader.load('images/fontpagematerial/back.png', (texture) => {
//     texture.encoding = THREE.sRGBEncoding;
//     scene.background = texture;
// });

// document.body.appendChild(renderer.domElement);

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1366 / 768, 0.1, 1000); // Adjust the aspect ratio to match the desired canvas size

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(1366, 768); // Set the canvas size to 1940x1080 pixels
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Load the background texture
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('/images/fontpagematerial/back.png', (texture) => {
    scene.background = backgroundTexture;
});


// Load textures for animation
const textures = [
    textureLoader.load('images/fontpagematerial/6.png'),
    textureLoader.load('images/fontpagematerial/7.png'),
    textureLoader.load('images/fontpagematerial/8.png'),
    textureLoader.load('images/fontpagematerial/9.png'),
    textureLoader.load('images/fontpagematerial/10.png'),
    textureLoader.load('images/fontpagematerial/11.png')
];

// Create planes for each texture
const planes = textures.map((texture, index) => {
    const geometry = new THREE.PlaneGeometry(1366, 768);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(13.2, -2.8, -10);
    plane.scale.set(0.025, 0.025, 0.025);
    scene.add(plane);
    return plane;
});

// Create materials array for the coin
const coinMaterials = [];

// Load gold texture and create materials for top and side
textureLoader.load(
    gpaTexture,
    function(texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        // Material for top face
        coinMaterials[0] = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide
        });
        // Material for side
        coinMaterials[2] = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide
        });
    },
    undefined,
    function(error) {
        console.error('Error loading gpa texture:', error);
    }
);

// Load inverse texture for bottom face
textureLoader.load(
    inverseTexture,
    function(texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        coinMaterials[1] = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide
        });
    },
    undefined,
    function(error) {
        console.error('Error loading inverse texture:', error);
    }
);

const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
const coin = new THREE.Mesh(coinGeometry, coinMaterials);

// Scale the coin to make it larger
coin.scale.set(1.7, 1.7, 1.7); // Adjust the scale values as needed

// Position and rotate the coin
coin.position.set(-20, 5, -10);
coin.rotation.z = Math.PI / 2;
scene.add(coin);

// Add edges with stronger black color
const coin_edges = new THREE.EdgesGeometry(coinGeometry);
const coin_line = new THREE.LineSegments(
    coin_edges, 
    new THREE.LineBasicMaterial({ 
        color: 0x000000,
        linewidth: 2
    })
);

// Match coin edge position and rotation
coin_line.position.copy(coin.position);
coin_line.rotation.z = Math.PI / 2;
scene.add(coin_line);

// Position the camera to look directly at the coin
camera.position.set(coin.position.x, coin.position.y, coin.position.z + 10); // Adjust the z value as needed
camera.lookAt(coin.position);

// Position the camera
camera.position.z = 8;
camera.position.y = 0;
camera.position.x = 0;

// Store the last used texture index for each plane
const lastTextureIndices = planes.map(() => -1);

// Function to change the texture of the planes
function changeTexture() {
    planes.forEach((plane, index) => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * textures.length);
        } while (randomIndex === lastTextureIndices[index]);
        plane.material.map = textures[randomIndex];
        plane.material.needsUpdate = true;
        lastTextureIndices[index] = randomIndex;
    });
}

// Change the texture every second
setInterval(changeTexture, 1000);

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate coin and its edges
    coin.rotation.y += 0.1;
    coin_line.rotation.y += 0.1;
    
    renderer.render(scene, camera);
}

animate();