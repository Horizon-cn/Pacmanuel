import './style.css'
// Import the necessary libraries
import * as THREE from 'three';
// import { TextureLoader, sRGBEncoding } from 'three';
// Import the OrbitControls library
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { ColorManagement } from 'three';
import { Var } from 'three/tsl';
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
  textureLoader.load('images/fontpagematerial/11.png'),
  textureLoader.load('images/fontpagematerial/12.png')
];

const width = window.innerWidth;
const height = window.innerHeight;

// create planes for each texture
const planes = textures.map((texture, index) => {
  const geometry = new THREE.PlaneGeometry(1366, 768);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0.003 * (width), -0.0008 * (height), 0.01); // 设置初始位置
  plane.scale.set(0.009 * (width) / 1646 , 0.01 / 1120 * (height), 1); // 调整平面几何体的缩放比例
  scene.add(plane);
  return plane;
});

const texture1 = textureLoader.load('images/fontpagematerial/13.png');
// create a plane geometry and a basic material
const geometry1 = new THREE.PlaneGeometry(1366, 768); // 创建平面几何体，宽度为 1366，高度为 768
const material1 = new THREE.MeshBasicMaterial({ map: texture1, transparent: true, opacity: 1 }); // 创建材质并应用纹理
const plane1 = new THREE.Mesh(geometry1, material1);
plane1.position.set(-0.00068 * (width), -0.00265 * (height), 0.01); // 设置初始位置
plane1.scale.set(0.0025 * (width) / 1646 , 0.0026 / 1120 * (height), 1); // 调整平面几何体的缩放比例
scene.add(plane1); // 将平面添加到场景中

const texture2 = textureLoader.load('images/fontpagematerial/14.png');
// create a plane geometry and a basic material
const geometry2 = new THREE.PlaneGeometry(1366, 768); // 创建平面几何体，宽度为 1366，高度为 768
const material2 = new THREE.MeshBasicMaterial({ map: texture2, transparent: true, opacity: 1 }); // 创建材质并应用纹理
const plane2 = new THREE.Mesh(geometry2, material2);
plane2.position.set(0.003 * (width), 0.003 * (height), 1); // 设置初始位置
plane2.scale.set(0.004 * (width) / 1646 , 0.0044 / 1120 * (height), 1); // 调整平面几何体的缩放比例
scene.add(plane2); // 将平面添加到场景中

const texture3 = textureLoader.load('images/fontpagematerial/15.png');
// create a plane geometry and a basic material
const geometry3 = new THREE.PlaneGeometry(1366, 768); // 创建平面几何体，宽度为 1366，高度为 768
const material3 = new THREE.MeshBasicMaterial({ map: texture3, transparent: true, opacity: 1 }); // 创建材质并应用纹理
const plane3 = new THREE.Mesh(geometry3, material3);
plane3.position.set(0.0032 * (width), 0.0022 * (height), 1); // 设置初始位置
plane3.scale.set(0.0035 * (width) / 1646 , 0.004 / 1120 * (height), 1); // 调整平面几何体的缩放比例
scene.add(plane3); // 将平面添加到场景中

// set the camera position
camera.position.z = 8;
camera.position.y = 0;
camera.position.x = 0;

// store the last used texture index for each plane
const lastTextureIndices = planes.map(() => -1);

var movedirection1 = 1;

var movecheck1 = 1;
var movecheck2 = 1;

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  console.log(width);
  const height = window.innerHeight;
  console.log(height);
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Adjust plane positions and scales based on new window size
  planes.forEach((plane, index) => {
    plane.position.set(0.003 * (width), -0.0008 * (height), 0.01); // 设置初始位置
    plane.scale.set(0.009 * (width) / 1646 , 0.01 / 1120 * (height), 1); // 调整平面几何体的缩放比例
  });
  plane1.position.set(-0.00068 * (width), -0.00265 * (height), 0.01); // 设置初始位置
  plane1.scale.set(0.0025 * (width) / 1646 , 0.0026 / 1120 * (height), 1); // 调整平面几何体的缩放比例
  plane2.position.set(0.003 * (width), 0.003 * (height), 1); // 设置初始位置
  plane2.scale.set(0.004 * (width) / 1646 , 0.0044 / 1120 * (height), 1); // 调整平面几何体的缩放比例
  plane3.position.set(0.0033 * (width), 0.0022 * (height), 1); // 设置初始位置
  plane3.scale.set(0.0035 * (width) / 1646 , 0.004 / 1120 * (height), 1); // 调整平面几何体的缩放比例  
});

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

  if (plane1.position.x < -0.00068 * (width) || plane1.position.x > 0.0006 * (width)) {
    movedirection1 *= -1;
  }
  plane1.position.x += 0.00002 * movedirection1 * (width);
  console.log(plane1.position.x);

  if (plane2.position.y < -0.004 * (height)) {
    plane2.position.set(0.004 * (width), 0.004 * (height), 1); // 设置初始位置
  }
  plane2.position.x -= 0.00005 * (height);
  plane2.position.y -= 0.00003 * (height);

  if (plane3.position.y < -0.005 * (height)) {
    plane3.position.set(0.0056 * (width), 0.0042 * (height), 1); // 设置初始位置
  }
  plane3.position.x -= 0.000035 * (height);
  plane3.position.y -= 0.000021 * (height);
}

// Call the animate function to start the animation loop
animate();