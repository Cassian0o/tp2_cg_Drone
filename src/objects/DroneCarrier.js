import { GameObject } from "./GameObject.js";
import { InputManager } from "../engine/InputManager.js";
import { loadObj } from "../engine/ObjLoader.js";
import { Propeller } from "./Propeller.js";
import { Cockpit } from "./Cockpit.js";
import {
  LANDING_PAD_POSITION,
  LANDING_PAD_RADIUS,
} from "../world/landingPad.js";

const LANDED_ALTITUDE = 2.4;
const MIN_ALTITUDE = LANDED_ALTITUDE;
const MAX_ALTITUDE = 90;

// DroneCarrier é o veículo principal controlado pelo usuário.
export class DroneCarrier extends GameObject {
  constructor(gl, programInfo) {
    super();

    const propLeft = new Propeller(gl, programInfo, true);
    const propRight = new Propeller(gl, programInfo, false);
    const cockpit = new Cockpit(gl, programInfo);

    this.addChild(propLeft);
    this.addChild(propRight);
    this.addChild(cockpit);

    this.gl = gl;
    this.programInfo = programInfo;
    this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
    this.objPath = "assets/models/intergalactic-spaceship.obj";

    this.texture = this._createHullTexture(gl);

    this.speed = 20.0;
    this.verticalSpeed = 14.0;
    this.turnSpeed = 1.5;
    this.scale = [1.35, 1.35, 1.35];
    this.position = [0, 14, 0];
    this.visualRotationOffset[1] = Math.PI;
    this.materialColor = [0.82, 0.9, 1.08];
    this.hideInCameraModes = [3];
    this._isMoving = false;
    this._landing = false;
    this._pKeyWasDown = false;

    this._loadModel();
  }

  async _loadModel() {
    try {
      this.bufferInfo = await loadObj(this.gl, this.objPath);
    } catch (e) {
      console.warn(
        "DroneCarrier: could not load intergalactic-spaceship.obj; using cube fallback.",
        e,
      );
    }
  }

  _createHullTexture(gl) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, "#d7e2ee");
    gradient.addColorStop(0.45, "#52606e");
    gradient.addColorStop(1, "#111820");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    for (let x = 24; x < 256; x += 44) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 28, 256);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(37, 255, 231, 0.65)";
    for (let y = 28; y < 256; y += 58) {
      ctx.fillRect(20, y, 216, 7);
    }

    ctx.fillStyle = "rgba(255, 113, 65, 0.5)";
    ctx.fillRect(0, 190, 256, 18);

    return twgl.createTexture(gl, {
      src: canvas,
      min: gl.LINEAR_MIPMAP_LINEAR,
      mag: gl.LINEAR,
      wrap: gl.REPEAT,
    });
  }

  update(deltaTime) {
    this._isMoving = false;

    const manualFlight =
      InputManager.isKeyPressed("W") ||
      InputManager.isKeyPressed("S") ||
      InputManager.isKeyPressed("A") ||
      InputManager.isKeyPressed("D") ||
      InputManager.isKeyPressed("Q") ||
      InputManager.isKeyPressed("E");

    if (manualFlight) this._landing = false;

    const pKeyDown = InputManager.isKeyPressed("P");
    if (pKeyDown && !this._pKeyWasDown && this.canLand()) {
      this._landing = true;
    }
    this._pKeyWasDown = pKeyDown;

    if (InputManager.isKeyPressed("W")) {
      this.position[2] -= Math.cos(this.rotation[1]) * this.speed * deltaTime;
      this.position[0] -= Math.sin(this.rotation[1]) * this.speed * deltaTime;
      this._isMoving = true;
    }
    if (InputManager.isKeyPressed("S")) {
      this.position[2] += Math.cos(this.rotation[1]) * this.speed * deltaTime;
      this.position[0] += Math.sin(this.rotation[1]) * this.speed * deltaTime;
      this._isMoving = true;
    }
    if (InputManager.isKeyPressed("A")) {
      this.rotation[1] += this.turnSpeed * deltaTime;
      this._isMoving = true;
    }
    if (InputManager.isKeyPressed("D")) {
      this.rotation[1] -= this.turnSpeed * deltaTime;
      this._isMoving = true;
    }
    if (InputManager.isKeyPressed("E")) {
      this.position[1] += this.verticalSpeed * deltaTime;
      this._isMoving = true;
    }
    if (InputManager.isKeyPressed("Q")) {
      this.position[1] -= this.verticalSpeed * deltaTime;
      this._isMoving = true;
    }

    if (this._landing) {
      const blend = Math.min(deltaTime * 1.6, 1);
      this.position[0] += (LANDING_PAD_POSITION[0] - this.position[0]) * blend;
      this.position[2] += (LANDING_PAD_POSITION[2] - this.position[2]) * blend;
      this.position[1] -= this.verticalSpeed * 0.55 * deltaTime;
      this.rotation[1] += (0 - this.rotation[1]) * Math.min(deltaTime * 1.4, 1);
      this._isMoving = true;

      if (this.position[1] <= LANDED_ALTITUDE) {
        this.position[1] = LANDED_ALTITUDE;
        this._landing = false;
        this._isMoving = false;
      }
    }

    this.position[1] = Math.max(
      MIN_ALTITUDE,
      Math.min(MAX_ALTITUDE, this.position[1]),
    );
    super.update(deltaTime);
  }

  getDronePosition() {
    return [...this.position];
  }

  getDroneYaw() {
    return this.rotation[1];
  }

  isMoving() {
    return this._isMoving;
  }

  canLand() {
    const dx = this.position[0] - LANDING_PAD_POSITION[0];
    const dz = this.position[2] - LANDING_PAD_POSITION[2];
    return Math.sqrt(dx * dx + dz * dz) <= LANDING_PAD_RADIUS;
  }
}
