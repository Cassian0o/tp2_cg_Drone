import { getLightingUniforms } from "../lighting.js";
import { getFogUniforms } from "./fog.js";

const shadowVs = `#version 300 es
in vec4 a_position;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform vec3 u_shadowLightDir;

void main() {
  vec4 worldPos = u_world * a_position;
  float lightY = min(u_shadowLightDir.y, -0.05);
  float t = -worldPos.y / lightY;
  vec3 shadowPos = worldPos.xyz + u_shadowLightDir * t;
  shadowPos.y = 0.14;
  gl_Position = u_worldViewProjection * vec4(shadowPos, 1.0);
}`;

const shadowFs = `#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(0.02, 0.025, 0.03, 0.24);
}`;

// Cena agrupa objetos, atualiza lógica e desenha cada entidade em ordem.
export class Scene {
  constructor() {
    this.gameObjects = [];
    this.updatables = [];
    this.camera = null;
    this._shadowProgramInfo = null;
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

  _isHiddenForCurrentCamera(obj) {
    return obj.hideInCameraModes?.includes(this.camera?.mode);
  }

  update(deltaTime) {
    this.updatables.forEach((obj) => obj.update(deltaTime));
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
      ...getLightingUniforms(this.camera.position),
      ...getFogUniforms(),
    };

    if (!this._shadowProgramInfo) {
      this._shadowProgramInfo = twgl.createProgramInfo(gl, [
        shadowVs,
        shadowFs,
      ]);
    }

    // Primeiro: desenha objetos opacos.
    this.gameObjects.forEach((obj) => {
      if (this._isHiddenForCurrentCamera(obj)) return;
      if (!obj.transparent) obj.draw(gl, globalUniforms);
    });

    if (globalUniforms.u_castShadows) {
      // Se sombras estão habilitadas, desenha projeções no chão.
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);

      this.gameObjects.forEach((obj) => {
        if (this._isHiddenForCurrentCamera(obj)) return;
        if (!obj.transparent)
          obj.drawShadow(gl, this._shadowProgramInfo, globalUniforms);
      });

      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }

    // Depois: desenha objetos transparentes por cima de tudo (vidro, painéis).
    this.gameObjects.forEach((obj) => {
      if (this._isHiddenForCurrentCamera(obj)) return;
      if (obj.transparent) obj.draw(gl, globalUniforms);
    });
  }
}
