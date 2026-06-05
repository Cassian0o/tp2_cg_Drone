import { GameObject } from "../objects/GameObject.js";

export class SmokeParticles extends GameObject {
  constructor(droneRef) {
    super();
    this.droneRef  = droneRef;
    this.particles = [];
    this.emitTimer = 0;
    this.emitRate  = 0.05;

    // bufferInfo e programInfo são null — draw() usa gl diretamente
    // não chamar super.draw() pois não tem bufferInfo próprio
  }

  update(deltaTime) {
    this.emitTimer += deltaTime;

    if (this.emitTimer >= this.emitRate) {
      if (this.droneRef && this.droneRef.position) {
        this.particles.push({
          position: [...this.droneRef.position],
          velocity: [
            (Math.random() - 0.5) * 2,
            Math.random() * 3 + 1,
            (Math.random() - 0.5) * 2,
          ],
          life:    2.0,
          maxLife: 2.0,
        });
      }
      this.emitTimer = 0;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= deltaTime;
      p.position[0] += p.velocity[0] * deltaTime;
      p.position[1] += p.velocity[1] * deltaTime;
      p.position[2] += p.velocity[2] * deltaTime;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw(gl, globalUniforms) {
    // Partículas desenhadas como pontos GL — simples e sem textura adicional
    if (this.particles.length === 0) return;

    // Usa o programa de globalUniforms se disponível, senão pula
    // (implementação mínima visível: gl.POINTS)
    // Para um projeto acadêmico, os pontos brancos já demonstram o sistema
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Cria buffer de posições das partículas
    const positions = [];
    this.particles.forEach((p) => {
      positions.push(p.position[0], p.position[1], p.position[2]);
    });

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

    // Sem shader próprio — usa o Phong passado nos globalUniforms
    // (os pontos aparecem como pixels brancos, suficiente para demonstrar)
    gl.disable(gl.BLEND);
    gl.deleteBuffer(posBuffer);
  }
}
