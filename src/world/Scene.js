import { getLightingUniforms } from "../lighting.js";

export class Scene {
  constructor() {
    this.gameObjects = [];
    this.camera = null;
  }

  add(gameObject) {
    this.gameObjects.push(gameObject);
  }

  setCamera(camera) {
    this.camera = camera;
  }

  update(deltaTime) {
    this.gameObjects.forEach((obj) => obj.update(deltaTime));
    if (this.camera) this.camera.update(deltaTime);
  }

  draw(gl, timeSec) {
    if (!this.camera) return;

    // Obtém o estado atual da iluminação
    const lightUniforms = getLightingUniforms();

    const globalUniforms = {
      u_viewInverse: this.camera.cameraMatrix,
      u_worldViewProjection: this.camera.viewProjection,
      u_viewPosition: this.camera.position,
      u_time: timeSec,
      ...lightUniforms, // Injeta a luz e a direção na cena inteira
    };

    this.gameObjects.forEach((obj) => obj.draw(gl, globalUniforms));
  }
}
