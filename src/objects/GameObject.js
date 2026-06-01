import { mat4 } from "../../utils/math.js";

export class GameObject {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0]; // Em radianos [x, y, z]
    this.scale = [1, 1, 1];

    this.programInfo = null;
    this.bufferInfo = null;
    this.texture = null;

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
        u_diffuseMap: this.texture,
      });

      twgl.drawBufferInfo(gl, this.bufferInfo);
    }

    this.children.forEach((child) => child.draw(gl, globalUniforms));
  }
}
