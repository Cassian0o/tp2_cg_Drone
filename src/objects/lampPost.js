import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

class LampBulb extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;
    this.bufferInfo = twgl.primitives.createSphereBufferInfo(gl, 1.15, 16, 12);
    this.position = [0, 8.1, 0];
    this.scale = [1, 0.72, 1];
    this.materialColor = [1.0, 0.86, 0.45];
    this.emissiveColor = [1.25, 0.84, 0.32];
    this.castsShadow = false;

    const pixel = new Uint8Array([255, 221, 120, 255]);
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
}

export class LampPost extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;

    this.bufferInfo = twgl.primitives.createCylinderBufferInfo(gl, 0.38, 15, 12, 1);
    this.materialColor = [0.82, 0.86, 0.84];

    AssetManager.loadTexture("metal_diffuse", "assets/textures/metal_diffuse.jpg");
    this.texture = AssetManager.getTexture("metal_diffuse");

    this.addChild(new LampBulb(gl, programInfo));
  }
}
