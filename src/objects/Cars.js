// ==========================================
// src/objects/Cars.js
// [x] Carros com rota autônoma
// ==========================================
import { GameObject } from "./GameObject.js";

export class Car extends GameObject {
  constructor(gl, programInfo, waypoints) {
    super();
    this.programInfo = programInfo;
    this.waypoints = waypoints; // Array de posições [x, y, z]
    this.currentWaypointIndex = 0;
    this.speed = 8.0;

    if (this.waypoints && this.waypoints.length > 0) {
      this.position = [...this.waypoints[0]];
    }
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.waypoints || this.waypoints.length < 2) return;

    const target = this.waypoints[this.currentWaypointIndex];
    const dx = target[0] - this.position[0];
    const dy = target[1] - this.position[1];
    const dz = target[2] - this.position[2];

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 1.0) {
      this.currentWaypointIndex =
        (this.currentWaypointIndex + 1) % this.waypoints.length;
    } else {
      const nx = dx / distance;
      const ny = dy / distance;
      const nz = dz / distance;

      this.position[0] += nx * this.speed * deltaTime;
      this.position[1] += ny * this.speed * deltaTime;
      this.position[2] += nz * this.speed * deltaTime;

      // Rotaciona o carro para olhar para o alvo
      this.rotation[1] = Math.atan2(nx, nz);
    }
  }
}
