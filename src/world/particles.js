import { GameObject } from "../objects/GameObject.js";

const vs = `#version 300 es
in vec3 a_position;
in float a_lifeRatio;
in float a_size;

uniform mat4 u_worldViewProjection;

out float v_lifeRatio;

void main() {
  gl_Position = u_worldViewProjection * vec4(a_position, 1.0);
  gl_PointSize = clamp(a_size * 95.0 / max(gl_Position.w, 1.0), 5.0, 34.0);
  v_lifeRatio = a_lifeRatio;
}`;

const fs = `#version 300 es
precision mediump float;

in float v_lifeRatio;
out vec4 outColor;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;

  float softEdge = smoothstep(1.0, 0.15, d);
  float age = 1.0 - v_lifeRatio;
  vec3 young = vec3(0.42, 0.48, 0.56);
  vec3 old = vec3(0.16, 0.17, 0.18);
  vec3 color = mix(young, old, age);
  float alpha = softEdge * v_lifeRatio * 0.42;

  outColor = vec4(color, alpha);
}`;

export class SmokeParticles extends GameObject {
  constructor(droneRef) {
    super();
    this.droneRef = droneRef;
    this.transparent = true;
    this.castsShadow = false;
    this.hideInCameraModes = [3];

    this.particles = [];
    this.emitTimer = 0;
    this.emitRate = 0.035;
    this.maxParticles = 420;

    this._programInfo = null;
    this._bufferInfo = null;
  }

  update(deltaTime) {
    const droneIsMoving = this.droneRef?.isMoving?.() ?? false;

    if (droneIsMoving) {
      this.emitTimer += deltaTime;
      while (this.emitTimer >= this.emitRate) {
        this._emitBurst();
        this.emitTimer -= this.emitRate;
      }
    } else {
      this.emitTimer = 0;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= deltaTime;
      p.position[0] += p.velocity[0] * deltaTime;
      p.position[1] += p.velocity[1] * deltaTime;
      p.position[2] += p.velocity[2] * deltaTime;
      p.velocity[1] += 0.5 * deltaTime;
      p.size += p.growth * deltaTime;

      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }
  }

  _emitBurst() {
    if (!this.droneRef) return;

    const pos = this.droneRef.getDronePosition?.() || this.droneRef.position;
    const yaw = this.droneRef.getDroneYaw?.() || 0;
    const rear = [Math.sin(yaw), 0, Math.cos(yaw)];
    const side = [Math.cos(yaw), 0, -Math.sin(yaw)];
    const engineOffsets = [-1.2, 1.2];
    const exhaustDistance = 2.4;

    // Mistura uma nuvem central para o volume do escape do drone.
    const coreLife = 1.0 + Math.random() * 0.45;
    this.particles.push({
      position: [
        pos[0] + (Math.random() - 0.5) * 0.6,
        pos[1] + 0.1 + Math.random() * 0.2,
        pos[2] + (Math.random() - 0.5) * 0.6,
      ],
      velocity: [
        (Math.random() - 0.5) * 0.45,
        0.3 + Math.random() * 0.35,
        (Math.random() - 0.5) * 0.45,
      ],
      life: coreLife,
      maxLife: coreLife,
      size: 3.2 + Math.random() * 2.4,
      growth: 2.2 + Math.random() * 2.0,
    });

    // Dois focos de fumaça nas saídas do motor.
    engineOffsets.forEach((sideOffset) => {
      const jitterSide = (Math.random() - 0.5) * 0.4;
      const jitterUp = Math.random() * 0.3;
      const spawn = [
        pos[0] + rear[0] * exhaustDistance + side[0] * (sideOffset + jitterSide),
        pos[1] + 0.05 + jitterUp,
        pos[2] + rear[2] * exhaustDistance + side[2] * (sideOffset + jitterSide),
      ];

      const drift = 0.9 + Math.random() * 0.9;
      const maxLife = 1.2 + Math.random() * 0.8;
      this.particles.push({
        position: spawn,
        velocity: [
          rear[0] * drift + (Math.random() - 0.5) * 0.5,
          0.3 + Math.random() * 0.5,
          rear[2] * drift + (Math.random() - 0.5) * 0.5,
        ],
        life: maxLife,
        maxLife,
        size: 4.0 + Math.random() * 4.0,
        growth: 3.5 + Math.random() * 3.5,
      });
    });
  }

  draw(gl, globalUniforms) {
    if (this.particles.length === 0) return;

    if (!this._programInfo) {
      this._programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    }

    const positions = [];
    const lifeRatios = [];
    const sizes = [];

    this.particles.forEach((p) => {
      positions.push(p.position[0], p.position[1], p.position[2]);
      lifeRatios.push(Math.max(0, p.life / p.maxLife));
      sizes.push(p.size);
    });

    const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: { numComponents: 3, data: new Float32Array(positions) },
      lifeRatio: { numComponents: 1, data: new Float32Array(lifeRatios) },
      size: { numComponents: 1, data: new Float32Array(sizes) },
    });

    gl.useProgram(this._programInfo.program);
    twgl.setBuffersAndAttributes(gl, this._programInfo, bufferInfo);
    twgl.setUniforms(this._programInfo, {
      u_worldViewProjection: globalUniforms.u_worldViewProjection,
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
    gl.depthMask(true);
    gl.disable(gl.BLEND);

    Object.values(bufferInfo.attribs).forEach((attrib) => {
      if (attrib.buffer) gl.deleteBuffer(attrib.buffer);
    });
  }
}
