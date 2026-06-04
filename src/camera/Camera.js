// Câmera 1 (tecla 1): visão de cima acompanhando o drone
// Câmera 2 (tecla 2): lateral — frente/trás/esq/dir relativo ao drone
//                     tecla C alterna entre os 4 ângulos laterais
// Câmera 3 (tecla 3, extra +5%): dentro da cabine, setas giram o olhar
//
// Todas as câmeras seguem o drone via getDronePosition() / getDroneYaw()

import { mat4 } from "../../utils/math.js";
import { InputManager } from "../engine/InputManager.js";

// ── constantes de configuração ──────────────────────────────────────────────

const CAM1_HEIGHT  = 60;   // altura da câmera aérea acima do drone
const CAM1_DIST    = 0;    // distância horizontal (0 = diretamente acima)

const CAM2_DIST    = 40;   // distância da câmera lateral ao drone
const CAM2_HEIGHT  = 15;   // altura da câmera lateral

// Ângulos laterais disponíveis com tecla C (em radianos, relativo ao yaw do drone)
const CAM2_ANGLES  = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // frente, esq, trás, dir

const CAM3_HEIGHT  = 1.2;  // altura da câmera dentro da cabine (relativo ao drone)
const CAM3_FORWARD = -1.0; // offset frontal dentro da cabine
const CAM3_PITCH_SPEED = 1.2; // radianos/s ao pressionar setas
const CAM3_YAW_SPEED   = 1.5;
const CAM3_PITCH_LIMIT  = Math.PI / 3; // ±60°

// ── classe ───────────────────────────────────────────────────────────────────

export class Camera {
  constructor(gl) {
    this.gl = gl;

    // modo: 1 = aérea, 2 = lateral, 3 = cabine
    this.mode = 1;

    // câmera 2 — índice do ângulo lateral atual
    this._cam2AngleIndex = 0;

    // câmera 3 — pitch e yaw livres controlados pelas setas
    this._cam3Pitch = 0;
    this._cam3Yaw   = 0;

    // debounce das teclas de modo e tecla C
    this._key1WasDown = false;
    this._key2WasDown = false;
    this._key3WasDown = false;
    this._keyCWasDown = false;

    // drone — será preenchido via attachDrone()
    this._drone = null;

    // matrizes expostas para Scene.js
    this.position        = [0, 50, 100];
    this.cameraMatrix    = mat4.identity();
    this.viewMatrix      = mat4.identity();
    this.viewProjection  = mat4.identity();
  }

  // Conecta o drone à câmera. Chamar em main.js após criar o DroneCarrier.
  attachDrone(drone) {
    this._drone = drone;
  }

  update(deltaTime) {
    this._handleModeSwitch();

    if (!this._drone) return;

    const dronePos = this._drone.getDronePosition();
    const droneYaw = this._drone.getDroneYaw();

    switch (this.mode) {
      case 1: this._updateCam1(dronePos, droneYaw); break;
      case 2: this._updateCam2(dronePos, droneYaw); break;
      case 3: this._updateCam3(dronePos, droneYaw, deltaTime); break;
    }

    this._rebuildMatrices();
  }

  // ── câmera 1: aérea ────────────────────────────────────────────────────────

  _updateCam1(dronePos, droneYaw) {
    // Posição diretamente acima + ligeiramente atrás para dar noção de direção
    const behind = 20;
    this.position = [
      dronePos[0] + Math.sin(droneYaw) * behind,
      dronePos[1] + CAM1_HEIGHT,
      dronePos[2] + Math.cos(droneYaw) * behind,
    ];
    this._target = [...dronePos];
    this._up     = [0, 1, 0];
  }

  // ── câmera 2: lateral ──────────────────────────────────────────────────────

  _updateCam2(dronePos, droneYaw) {
    const angle = droneYaw + CAM2_ANGLES[this._cam2AngleIndex];
    this.position = [
      dronePos[0] + Math.sin(angle) * CAM2_DIST,
      dronePos[1] + CAM2_HEIGHT,
      dronePos[2] + Math.cos(angle) * CAM2_DIST,
    ];
    this._target = [...dronePos];
    this._up     = [0, 1, 0];
  }

  _nextCam2Angle() {
    this._cam2AngleIndex = (this._cam2AngleIndex + 1) % CAM2_ANGLES.length;
  }

  // ── câmera 3: cockpit (extra +5%) ──────────────────────────────────────────

  _updateCam3(dronePos, droneYaw, deltaTime) {
    // Controle de pitch/yaw com setas
    if (InputManager.isKeyPressed("ARROWUP"))    this._cam3Pitch -= CAM3_PITCH_SPEED * deltaTime;
    if (InputManager.isKeyPressed("ARROWDOWN"))  this._cam3Pitch += CAM3_PITCH_SPEED * deltaTime;
    if (InputManager.isKeyPressed("ARROWLEFT"))  this._cam3Yaw   += CAM3_YAW_SPEED   * deltaTime;
    if (InputManager.isKeyPressed("ARROWRIGHT")) this._cam3Yaw   -= CAM3_YAW_SPEED   * deltaTime;

    // Limita pitch para não virar de cabeça para baixo
    this._cam3Pitch = Math.max(-CAM3_PITCH_LIMIT, Math.min(CAM3_PITCH_LIMIT, this._cam3Pitch));

    // Posição do olho: dentro da cabine, orientada pelo yaw do drone
    const eyeYaw = droneYaw + this._cam3Yaw;
    this.position = [
      dronePos[0] + Math.sin(droneYaw) * CAM3_FORWARD,
      dronePos[1] + CAM3_HEIGHT,
      dronePos[2] + Math.cos(droneYaw) * CAM3_FORWARD,
    ];

    // Direção do olhar: para onde as setas apontam
    const lookDist = 10;
    this._target = [
      this.position[0] + Math.sin(eyeYaw)   * Math.cos(this._cam3Pitch) * lookDist,
      this.position[1] - Math.sin(this._cam3Pitch) * lookDist,
      this.position[2] + Math.cos(eyeYaw)   * Math.cos(this._cam3Pitch) * lookDist,
    ];
    this._up = [0, 1, 0];
  }

  // ── gerenciamento de modo ──────────────────────────────────────────────────

  _handleModeSwitch() {
    const k1 = InputManager.isKeyPressed("1");
    const k2 = InputManager.isKeyPressed("2");
    const k3 = InputManager.isKeyPressed("3");
    const kC = InputManager.isKeyPressed("C");

    // Troca de modo com borda de descida (evita repetição)
    if (k1 && !this._key1WasDown) { this.mode = 1; }
    if (k2 && !this._key2WasDown) { this.mode = 2; }
    if (k3 && !this._key3WasDown) { this.mode = 3; }

    // Tecla C alterna ângulo lateral (só na câmera 2)
    if (kC && !this._keyCWasDown && this.mode === 2) {
      this._nextCam2Angle();
    }

    this._key1WasDown = k1;
    this._key2WasDown = k2;
    this._key3WasDown = k3;
    this._keyCWasDown = kC;
  }

  // ── matrizes ──────────────────────────────────────────────────────────────

  _rebuildMatrices() {
    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

    const projection = mat4.perspective(
      (60 * Math.PI) / 180,
      this.aspect,
      0.1,
      2000
    );

    // Garante target/up padrão caso drone ainda não esteja disponível
    const target = this._target || [0, 0, 0];
    const up     = this._up     || [0, 1, 0];

    this.cameraMatrix   = mat4.lookAt(this.position, target, up);
    this.viewMatrix     = mat4.inverse(this.cameraMatrix);
    this.viewProjection = mat4.multiply(projection, this.viewMatrix);
  }
}
