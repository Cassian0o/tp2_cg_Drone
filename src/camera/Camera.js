import { mat4 } from "../../utils/math.js";

export class Camera {
  constructor(gl) {
    this.gl = gl;
    this.position = [0, 50, 100];
    this.target = [0, 0, 0];
    this.up = [0, 1, 0];

    this.fov = (60 * Math.PI) / 180;
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 2000;

    this.projectionMatrix = mat4.perspective(
      this.fov,
      this.aspect,
      this.zNear,
      this.zFar,
    );
    this.cameraMatrix = mat4.identity();
    this.viewMatrix = mat4.identity();
    this.viewProjection = mat4.identity();
  }

  update(deltaTime) {
    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    this.projectionMatrix = mat4.perspective(
      this.fov,
      this.aspect,
      this.zNear,
      this.zFar,
    );

    this.cameraMatrix = mat4.lookAt(this.position, this.target, this.up);
    this.viewMatrix = mat4.inverse(this.cameraMatrix);
    this.viewProjection = mat4.multiply(this.projectionMatrix, this.viewMatrix);
  }
}
