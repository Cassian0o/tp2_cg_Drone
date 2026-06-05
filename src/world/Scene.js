import { getLightingUniforms } from "../lighting.js";
import { getFogUniforms }      from "./fog.js";

export class Scene {
  constructor() {
    this.gameObjects = [];
    this.updatables  = [];
    this.camera = null;
  }

  add(gameObject) {
    this.gameObjects.push(gameObject);
  }

  addUpdatable(obj) {
    this.updatables.push(obj);
  }

  setCamera(camera) {
    this.camera = camera;
  }

  update(deltaTime) {
    this.updatables.forEach((obj) => obj.update(deltaTime));
    this.gameObjects.forEach((obj) => obj.update(deltaTime));
    if (this.camera) this.camera.update(deltaTime);
  }

  draw(gl, timeSec) {
    if (!this.camera) return;

    const globalUniforms = {
      u_viewInverse:         this.camera.cameraMatrix,
      u_worldViewProjection: this.camera.viewProjection,
      u_viewPosition:        this.camera.position,
      u_time:                timeSec,
      ...getLightingUniforms(),
      ...getFogUniforms(),
    };

    // Primeiro: opacos
    this.gameObjects.forEach((obj) => {
      if (!obj.transparent) obj.draw(gl, globalUniforms);
    });

    // Depois: transparentes (cockpit de vidro)
    this.gameObjects.forEach((obj) => {
      if (obj.transparent) obj.draw(gl, globalUniforms);
    });
  }
}
