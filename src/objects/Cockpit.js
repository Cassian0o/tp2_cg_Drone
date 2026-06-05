import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

export class Cockpit extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;
    this.bufferInfo = twgl.primitives.createSphereBufferInfo(gl, 0.8, 16, 16);

    AssetManager.loadTexture("metal_specular", "assets/textures/metal_specular.jpg");
    this.texture = AssetManager.getTexture("metal_specular");

    this.position = [0, 0.8, -0.5];

    // Sinaliza para ser desenhado por último
    this.transparent = true;
    this.opacity = 0.35;
  }

  draw(gl, globalUniforms) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);

    gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);

    const world = this.getWorldMatrix();
    twgl.setUniforms(this.programInfo, globalUniforms);
    twgl.setUniforms(this.programInfo, {
      u_world: world,
      u_worldInverseTranspose: twgl.m4.transpose(twgl.m4.inverse(world)),
      u_diffuseMap: this.texture,
      u_opacity: this.opacity,
    });

    twgl.drawBufferInfo(gl, this.bufferInfo);

    gl.depthMask(true);
    gl.disable(gl.BLEND);

    this.children.forEach((child) => child.draw(gl, globalUniforms));
  }
}
