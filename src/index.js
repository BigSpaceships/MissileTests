import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clamp } from './lib';
import { Missile } from './missile.js';
// import { playPause } from './buttons.js';

import PlaneTexture from "./textures/planeTexture.png"
import TaterMissile from "./models/tatermissile.gltf";
import { Euler, Vector3 } from 'three';
import css from './style.css'

let scene, camera, renderer, missile, rotChange, pitchChange, pitch, rot, lastTouchX, lastTouchY, taterModel;

let frame = 0;

const cameraDist = 5;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();

  loader.load(TaterMissile, function(gltf) {
    taterModel = gltf.scene;
    
    missile = new Missile(new Vector3(0, 0, 0), new Euler(), new Vector3(0, 0, 0), new Vector3(30, 0, 30), 40, taterModel);

    scene.add(missile.object)
    scene.add(camera)
  })

  // lights
  const directionalLight = new THREE.DirectionalLight(0xffffff, .6);
  scene.add(directionalLight)

  const ambiantLight = new THREE.AmbientLight(0xffffff, .5)
  scene.add(ambiantLight)

  // plane
  const planeTexture = new THREE.TextureLoader().load(PlaneTexture);

  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  planeTexture.repeat.set(32, 32);
  
  const planeGeo = new THREE.PlaneBufferGeometry(100, 100);
  const planeMat = new THREE.MeshLambertMaterial({
    map: planeTexture
  })

  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  planeMesh.rotation.set(Math.PI / -2, 0, 0);
  scene.add(planeMesh)
  
  let sensitivity = 7;

  pitchChange = 0;
  rotChange = 0;
  rot = 0;
  pitch = Math.PI / 6;

  updateCameraPosition();

  renderer.domElement.onmousemove = function(e) {
    const buttons = e.buttons.toString(2);

    if (buttons.charAt(buttons.length - 1) == 1) { 
    
    pitchChange -= e.movementY * sensitivity / Math.PI / 200;
    rotChange += e.movementX * sensitivity / Math.PI / 200;
    }
  }

  renderer.domElement.addEventListener("touchstart", e => {
    const touch = e.changedTouches[0];
    
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    e.preventDefault();
  });

  renderer.domElement.addEventListener("touchmove", e => {
    const touch = e.changedTouches[0];
    
    rotChange -= (lastTouchX - touch.clientX) * sensitivity / Math.PI / 300;
    pitchChange -= (lastTouchY - touch.clientY) * sensitivity / Math.PI / 300;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;

    e.preventDefault();
  })

}

function updateCameraPosition() {
  const missilePos =  missile === undefined ? new Vector3(0, 0, 0) : missile.object.position.clone();
  
  const verticalDist = Math.sin(pitch) * cameraDist;
  const horizontalDist = Math.cos(pitch) * cameraDist;

  const xPosRelative = Math.sin(rot) * horizontalDist;
  const zPosRelative = Math.cos(rot) * horizontalDist;

  const posRelative = new Vector3(xPosRelative, verticalDist, zPosRelative)

  posRelative.add(missilePos)
  
  camera.position.copy(posRelative);
  
  camera.lookAt(missilePos.add(new Vector3(0, 1, 0)));

  if (pitch == Math.PI / 2) {
    camera.rotateOnWorldAxis(new Vector3(0, 1, 0), rot)
  }
}

function animate() {
  requestAnimationFrame(animate);

  try {
    if (pitchChange != 0 || rotChange != 0) {
      pitch += pitchChange;
      rot += rotChange;

      pitch = clamp(pitch, -Math.PI / 2, Math.PI / 2);
    
      pitchChange = 0;
      rotChange = 0;
    }
    if (missile !== undefined) {
      missile.tick()
      // alert(missile.object.position)
    }

    updateCameraPosition();
    
  
    renderer.render(scene, camera);

    frame++;
  } catch (e) {
    console.log(e)
  }
}

init();
animate();