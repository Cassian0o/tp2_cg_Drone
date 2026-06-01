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

    const globalUniforms = {
      u_viewInverse: this.camera.cameraMatrix,
      u_worldViewProjection: this.camera.viewProjection,
      u_viewPosition: this.camera.position,
      u_time: timeSec,
    };

    this.gameObjects.forEach((obj) => obj.draw(gl, globalUniforms));
  }
}
