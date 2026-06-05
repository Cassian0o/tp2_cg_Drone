import { mat4 } from "../../utils/math.js";

const fallbackTextures = new WeakMap();

function getFallbackTexture(gl) {
  if (fallbackTextures.has(gl)) return fallbackTextures.get(gl);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255]),
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  fallbackTextures.set(gl, texture);
  return texture;
}

export class GameObject {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0]; // Em radianos [x, y, z]
    this.visualRotationOffset = [0, 0, 0];
    this.scale = [1, 1, 1];

    this.programInfo = null;
    this.bufferInfo = null;
    this.texture = null;
    this.materialColor = [1, 1, 1];
    this.emissiveColor = [0, 0, 0];
    this.castsShadow = true;

    this.parent = null;
    this.children = [];
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  getWorldMatrix() {
    let localMatrix = mat4.identity();
    localMatrix = mat4.translate(localMatrix, this.position);
    localMatrix = mat4.rotateX(localMatrix, this.rotation[0]);
    localMatrix = mat4.rotateY(localMatrix, this.rotation[1]);
    localMatrix = mat4.rotateZ(localMatrix, this.rotation[2]);
    localMatrix = mat4.rotateX(localMatrix, this.visualRotationOffset[0]);
    localMatrix = mat4.rotateY(localMatrix, this.visualRotationOffset[1]);
    localMatrix = mat4.rotateZ(localMatrix, this.visualRotationOffset[2]);
    localMatrix = mat4.scale(localMatrix, this.scale);

    if (this.parent) {
      return mat4.multiply(this.parent.getWorldMatrix(), localMatrix);
    }
    return localMatrix;
  }

  update(deltaTime) {
    this.children.forEach((child) => child.update(deltaTime));
  }

  draw(gl, globalUniforms) {
    if (this.programInfo && this.bufferInfo) {
      gl.useProgram(this.programInfo.program);
      twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);

      const world = this.getWorldMatrix();

      twgl.setUniforms(this.programInfo, globalUniforms);
      twgl.setUniforms(this.programInfo, {
        u_world: world,
        u_worldInverseTranspose: mat4.transpose(mat4.inverse(world)),
        u_diffuseMap: this.texture || getFallbackTexture(gl),
        u_materialColor: this.materialColor,
        u_emissiveColor: this.emissiveColor,
        u_opacity: this.opacity ?? 1.0,
      });

      twgl.drawBufferInfo(gl, this.bufferInfo);
    }

    this.children.forEach((child) => child.draw(gl, globalUniforms));
  }

  drawShadow(gl, shadowProgramInfo, globalUniforms) {
    if (!this.castsShadow) return;

    if (this.programInfo && this.bufferInfo) {
      gl.useProgram(shadowProgramInfo.program);
      twgl.setBuffersAndAttributes(gl, shadowProgramInfo, this.bufferInfo);

      twgl.setUniforms(shadowProgramInfo, {
        u_world: this.getWorldMatrix(),
        u_worldViewProjection: globalUniforms.u_worldViewProjection,
        u_shadowLightDir: globalUniforms.u_lightDir,
      });

      twgl.drawBufferInfo(gl, this.bufferInfo);
    }

    this.children.forEach((child) => child.drawShadow(gl, shadowProgramInfo, globalUniforms));
  }
}
