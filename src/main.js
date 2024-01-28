import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { Circle } from "./objects/Circle";
import { Game } from "./Game";
import { GameObject } from "./base/GameObject";
import { CameraComponent } from "./base/CameraComponent";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const game = new Game(scene, renderer);

const init = () => {
  const circle = new Circle(game, 0, 0, 0.5, 1, { x: 1, y: 1.2 });
  game.addObject(circle);

  const circle2 = new Circle(game, 1, 1, 0.5, 1, { x: 1, y: 1.2 });
  game.addObject(circle2);

  const circle3 = new Circle(game, 2, 0, 1, 2, { x: 1, y: 1.2 });
  game.addObject(circle3);

  const cameraObject = new GameObject(game, 0, 0, 5); // Position the camera
  const cameraComponent = new CameraComponent(cameraObject);
  cameraObject.addComponent(cameraComponent);

  game.addObject(cameraObject);
};

if (WebGL.isWebGLAvailable()) {
  init();
  game.start();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("msg-div").appendChild(warning);
}
