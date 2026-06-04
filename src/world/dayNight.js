// ==========================================
// src/world/dayNight.js
// [x] Ciclo dia/noite — varia cor e direção da luz
// ==========================================
import { lightingState } from "../lighting.js";

export class DayNightCycle {
  constructor() {
    this.timeOfDay = 0;
    this.speed = 0.2; // Velocidade do ciclo
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
      lightingState.directionalLightColor = [1.0, 0.9, 0.8];
      lightingState.ambientLight = [0.4, 0.4, 0.45];
    } else {
      // Noite
      lightingState.directionalLightColor = [0.2, 0.2, 0.4];
      lightingState.ambientLight = [0.1, 0.1, 0.15];
    }
  }
}
