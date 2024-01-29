import * as THREE from 'three';
import WebGL from "three/addons/capabilities/WebGL.js";
import { Game } from "./Game";
import { GameObject } from "./base/GameObject";
import { CameraComponent } from "./base/CameraComponent";
import { FluidManager } from "./FluidManager";
import GUI from "lil-gui";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const game = new Game(scene, renderer);

const init = () => {

  const gui = new GUI();
  gui.add( game, 'togglePause' );

  const cameraObject = new GameObject(game, 0, 0, 5); // Position the camera
  const cameraComponent = new CameraComponent(cameraObject);
  cameraObject.addComponent(cameraComponent);

  game.addObject(cameraObject);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
      game.togglePause();
    }
  });

  const fluidManager = new FluidManager(game, 0, 0 , 30, 10, 0.15);
  fluidManager.init();
  gui.add( fluidManager, 'horizontal' );
  gui.add( fluidManager, 'vertical' );
  gui.add( fluidManager, 'spacing' );
  gui.add( fluidManager, 'radius' );
  gui.add( fluidManager, 'init' );

};

if (WebGL.isWebGLAvailable()) {
  init();
  game.start();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("msg-div").appendChild(warning);
}
