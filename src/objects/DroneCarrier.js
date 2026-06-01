import { GameObject } from "./GameObject.js";
import { InputManager } from "../engine/InputManager.js";
import { AssetManager } from "../engine/AssetManager.js";
import { Propeller } from "./Propeller.js";
import { Cockpit } from "./Cockpit.js";

export class DroneCarrier extends GameObject {
  constructor(gl, programInfo) {
    super();
    const propLeft = new Propeller(gl, programInfo, true);
    const propRight = new Propeller(gl, programInfo, false);
    const cockpit = new Cockpit(gl, programInfo);

    this.addChild(propLeft);
    this.addChild(propRight);
    this.addChild(cockpit);
    this.programInfo = programInfo;

    this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
    this.objPath = `assets/models/drone.obj`; // Referência ao asset enviado

    AssetManager.loadTexture(
      "metal_specular",
      "assets/textures/metal_specular.jpg",
    );
    this.texture = AssetManager.getTexture("metal_specular");

    this.speed = 20.0;
    this.turnSpeed = 1.5;
    this.scale = [2, 2, 2];
    this.position = [0, 10, 0];
  }

  update(deltaTime) {
    if (InputManager.isKeyPressed("W")) {
      this.position[2] -= Math.cos(this.rotation[1]) * this.speed * deltaTime;
      this.position[0] -= Math.sin(this.rotation[1]) * this.speed * deltaTime;
    }
    if (InputManager.isKeyPressed("S")) {
      this.position[2] += Math.cos(this.rotation[1]) * this.speed * deltaTime;
      this.position[0] += Math.sin(this.rotation[1]) * this.speed * deltaTime;
    }
    if (InputManager.isKeyPressed("A")) {
      this.rotation[1] += this.turnSpeed * deltaTime;
    }
    if (InputManager.isKeyPressed("D")) {
      this.rotation[1] -= this.turnSpeed * deltaTime;
    }
    super.update(deltaTime);
  }
}
