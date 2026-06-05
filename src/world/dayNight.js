// ==========================================
// src/world/dayNight.js
// [x] Ciclo dia/noite — varia cor e direção da luz
// ==========================================
import { lightingState } from "../lighting.js";

export class DayNightCycle {
  constructor() {
    this.timeOfDay = Math.PI / 2.4;
    this.speed = 0.018; // Velocidade do ciclo
  }

  update(deltaTime) {
    this.timeOfDay += deltaTime * this.speed;

    // Direção do sol baseada no ciclo circular
    const dirX = Math.cos(this.timeOfDay);
    const dirY = Math.sin(this.timeOfDay);

    // Atualiza direção da luz principal (sol/lua)
    const length = Math.sqrt(dirX * dirX + dirY * dirY + 0.25);
    lightingState.directionalLightDir = [
      dirX / length,
      -dirY / length,
      -0.5 / length,
    ];

    // Interpolação de cores Dia/Noite
    if (dirY > 0) {
      // Dia
      lightingState.directionalLightColor = [0.98, 0.94, 0.86];
      lightingState.ambientLight = [0.34, 0.36, 0.4];
    } else {
      // Noite
      lightingState.directionalLightColor = [0.16, 0.2, 0.38];
      lightingState.ambientLight = [0.08, 0.09, 0.14];
    }
  }
}
