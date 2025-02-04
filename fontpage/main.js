import './style.css'
// Import the necessary libraries
import * as THREE from 'three';
// import { TextureLoader, sRGBEncoding } from 'three';
// Import the OrbitControls library
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { ColorManagement } from 'three';
ColorManagement.enabled = false;

const renderer = new THREE.WebGLRenderer();
// Description: Create a scene and camera
const scene = new THREE.Scene()
// create new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// create new renderer
// set the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// set interval color
renderer.setClearColor(0x000000,0);

// load the background texture
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('images/fontpagematerial/back.png', (texture) => {
  texture.encoding = THREE.sRGBEncoding;
  scene.background = texture;  // 将图片用作背景
});

// Ensure the body has no margin or padding
document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.overflow = 'hidden';
document.body.style.display = '';
document.body.style.justifyContent = 'center';


// add the renderer to the document
document.body.appendChild(renderer.domElement);

const textures = [
  textureLoader.load('images/fontpagematerial/6.png'),
  textureLoader.load('images/fontpagematerial/7.png'),
  textureLoader.load('images/fontpagematerial/8.png'),
  textureLoader.load('images/fontpagematerial/9.png'),
  textureLoader.load('images/fontpagematerial/10.png'),
  textureLoader.load('images/fontpagematerial/11.png')
];

// create planes for each texture
const planes = textures.map((texture, index) => {
  const geometry = new THREE.PlaneGeometry(1366, 768);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(13.2, -2.8, -10); // 设置初始位置
  plane.scale.set(0.025, 0.025, 0.025); // 调整平面几何体的缩放比例
  scene.add(plane);
  return plane;
});

// set the camera position
camera.position.z = 8;
camera.position.y = 0;
camera.position.x = 0;

// store the last used texture index for each plane
const lastTextureIndices = planes.map(() => -1);

// funtion to change the texture of the planes
function changeTexture() {
  planes.forEach((plane, index) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * textures.length);
    } while (randomIndex === lastTextureIndices[index]);
    plane.material.map = textures[randomIndex];
    plane.material.needsUpdate = true; // 确保材质更新
    lastTextureIndices[index] = randomIndex; // 更新最后使用的纹理索引
  });
}
// change the texture every second
setInterval(changeTexture, 1000);


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Call the animate function to start the animation loop
animate();