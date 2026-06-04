// ==========================================
// src/world/particles.js
// [x] Partículas de fumaça no drone
// ==========================================
import { GameObject } from "../objects/GameObject.js";

export class SmokeParticles extends GameObject {
  constructor(droneRef) {
    super();
    this.droneRef = droneRef; // Referência ao objeto do drone (getDronePosition)
    this.particles = [];
    this.emitTimer = 0;
    this.emitRate = 0.05; // Segundos entre emissões
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.emitTimer += deltaTime;

    // Emite nova partícula na posição atual do drone
    if (this.emitTimer >= this.emitRate) {
      if (this.droneRef && this.droneRef.position) {
        this.particles.push({
          position: [...this.droneRef.position],
          velocity: [
            (Math.random() - 0.5) * 2,
            Math.random() * 2,
            (Math.random() - 0.5) * 2,
          ],
          life: 2.0, // Tempo de vida em segundos
          maxLife: 2.0,
        });
      }
      this.emitTimer = 0;
    }

    // Atualiza estado das partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.life -= deltaTime;

      p.position[0] += p.velocity[0] * deltaTime;
      p.position[1] += p.velocity[1] * deltaTime;
      p.position[2] += p.velocity[2] * deltaTime;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(gl, globalUniforms) {
    // Implementação de instancing ou desenho de quads voltados para a câmera (billboarding)
    // Para cada partícula em this.particles, envia a matriz de transformação
  }
}
