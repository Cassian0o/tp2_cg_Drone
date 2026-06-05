import { GameObject } from "../objects/GameObject.js";

export const LANDING_PAD_POSITION = [70, 0.25, 70];
export const LANDING_PAD_RADIUS = 24;

export class LandingPad extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;
    this.castsShadow = false;
    this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, 56, 32);
    this.position = [...LANDING_PAD_POSITION];
    this.texture = this._createTexture(gl);
  }

  _createTexture(gl) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#252a30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f2f2e8";
    ctx.fillRect(12, 12, 232, 8);
    ctx.fillRect(12, 108, 232, 8);
    ctx.fillRect(24, 60, 28, 8);
    ctx.fillRect(204, 60, 28, 8);

    ctx.strokeStyle = "#ffd447";
    ctx.lineWidth = 6;
    ctx.strokeRect(72, 24, 112, 80);

    ctx.fillStyle = "#f2f2e8";
    ctx.font = "bold 42px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("P", 128, 64);

    return twgl.createTexture(gl, {
      src: canvas,
      min: gl.LINEAR_MIPMAP_LINEAR,
      mag: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
    });
  }
}
