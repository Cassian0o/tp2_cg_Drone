import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

export class Cockpit extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;

    this.bufferInfo = twgl.primitives.createSphereBufferInfo(gl, 0.8, 16, 16);

    AssetManager.loadTexture(
      "metal_specular",
      "assets/textures/metal_specular.jpg",
    );

    this.texture = AssetManager.getTexture("metal_specular");

    this.position = [0, 0.8, -0.5];
  }
}
