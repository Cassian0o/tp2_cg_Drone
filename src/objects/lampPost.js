import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

export class LampPost extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;

    this.bufferInfo = twgl.primitives.createCylinderBufferInfo(
      gl,
      0.5,
      15,
      12,
      1,
    );

    AssetManager.loadTexture(
      "metal_diffuse",
      "assets/textures/metal_diffuse.jpg",
    );

    this.texture = AssetManager.getTexture("metal_diffuse");
  }
}
