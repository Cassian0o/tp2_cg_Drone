import { mat4 } from "../../utils/math.js";
import { InputManager } from "../engine/InputManager.js";

const CAM1_HEIGHT = 60;

const CAM2_DIST = 40;
const CAM2_HEIGHT = 15;
const CAM2_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

const CAM3_HEIGHT = 3.0;
const CAM3_FORWARD = -5.5;
const CAM3_LOOK_DIST = 40;
const CAM3_PITCH_SPEED = 1.2;
const CAM3_YAW_SPEED = 1.5;
const CAM3_PITCH_LIMIT = Math.PI / 3;

export class Camera {
  constructor(gl) {
    this.gl = gl;
    this.mode = 1;

    this._cam2AngleIndex = 0;
    this._cam3Pitch = -0.08;
    this._cam3Yaw = 0;

    this._key1WasDown = false;
    this._key2WasDown = false;
    this._key3WasDown = false;
    this._keyCWasDown = false;

    this._drone = null;

    this.position = [0, 50, 100];
    this.cameraMatrix = mat4.identity();
    this.viewMatrix = mat4.identity();
    this.viewProjection = mat4.identity();
  }

  attachDrone(drone) {
    this._drone = drone;
  }

  update(deltaTime) {
    this._handleModeSwitch();

    if (!this._drone) {
      this._rebuildMatrices();
      return;
    }

    const dronePos = this._drone.getDronePosition();
    const droneYaw = this._drone.getDroneYaw();

    switch (this.mode) {
      case 1:
        this._updateCam1(dronePos, droneYaw);
        break;
      case 2:
        this._updateCam2(dronePos, droneYaw);
        break;
      case 3:
        this._updateCam3(dronePos, droneYaw, deltaTime);
        break;
    }

    this._rebuildMatrices();
  }

  _updateCam1(dronePos, droneYaw) {
    const behind = 20;
    this.position = [
      dronePos[0] + Math.sin(droneYaw) * behind,
      dronePos[1] + CAM1_HEIGHT,
      dronePos[2] + Math.cos(droneYaw) * behind,
    ];
    this._target = [...dronePos];
    this._up = [0, 1, 0];
  }

  _updateCam2(dronePos, droneYaw) {
    const angle = droneYaw + CAM2_ANGLES[this._cam2AngleIndex];
    this.position = [
      dronePos[0] + Math.sin(angle) * CAM2_DIST,
      dronePos[1] + CAM2_HEIGHT,
      dronePos[2] + Math.cos(angle) * CAM2_DIST,
    ];
    this._target = [...dronePos];
    this._up = [0, 1, 0];
  }

  _updateCam3(dronePos, droneYaw, deltaTime) {
    if (InputManager.isKeyPressed("ARROWUP"))
      this._cam3Pitch -= CAM3_PITCH_SPEED * deltaTime;
    if (InputManager.isKeyPressed("ARROWDOWN"))
      this._cam3Pitch += CAM3_PITCH_SPEED * deltaTime;
    if (InputManager.isKeyPressed("ARROWLEFT"))
      this._cam3Yaw += CAM3_YAW_SPEED * deltaTime;
    if (InputManager.isKeyPressed("ARROWRIGHT"))
      this._cam3Yaw -= CAM3_YAW_SPEED * deltaTime;

    this._cam3Pitch = Math.max(
      -CAM3_PITCH_LIMIT,
      Math.min(CAM3_PITCH_LIMIT, this._cam3Pitch),
    );

    const eyeYaw = droneYaw + this._cam3Yaw;
    this.position = [
      dronePos[0] + Math.sin(droneYaw) * CAM3_FORWARD,
      dronePos[1] + CAM3_HEIGHT,
      dronePos[2] + Math.cos(droneYaw) * CAM3_FORWARD,
    ];

    this._target = [
      this.position[0] -
        Math.sin(eyeYaw) * Math.cos(this._cam3Pitch) * CAM3_LOOK_DIST,
      this.position[1] - Math.sin(this._cam3Pitch) * CAM3_LOOK_DIST,
      this.position[2] -
        Math.cos(eyeYaw) * Math.cos(this._cam3Pitch) * CAM3_LOOK_DIST,
    ];
    this._up = [0, 1, 0];
  }

  _nextCam2Angle() {
    this._cam2AngleIndex = (this._cam2AngleIndex + 1) % CAM2_ANGLES.length;
  }

  _handleModeSwitch() {
    const k1 = InputManager.isKeyPressed("1");
    const k2 = InputManager.isKeyPressed("2");
    const k3 = InputManager.isKeyPressed("3");
    const kC = InputManager.isKeyPressed("C");

    if (k1 && !this._key1WasDown) this.mode = 1;
    if (k2 && !this._key2WasDown) this.mode = 2;
    if (k3 && !this._key3WasDown) this.mode = 3;
    if (kC && !this._keyCWasDown && this.mode === 2) this._nextCam2Angle();

    this._key1WasDown = k1;
    this._key2WasDown = k2;
    this._key3WasDown = k3;
    this._keyCWasDown = kC;
  }

  _rebuildMatrices() {
    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

    const projection = mat4.perspective(
      (60 * Math.PI) / 180,
      this.aspect,
      0.1,
      2000,
    );
    const target = this._target || [0, 0, 0];
    const up = this._up || [0, 1, 0];

    this.cameraMatrix = mat4.lookAt(this.position, target, up);
    this.viewMatrix = mat4.inverse(this.cameraMatrix);
    this.viewProjection = mat4.multiply(projection, this.viewMatrix);
  }
}
