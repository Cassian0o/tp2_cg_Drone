// ==========================================
// src/world/grass.js
// [x] Grama billboard espalhada pelo cenário
// ==========================================
import { GameObject } from "../objects/GameObject.js";

export class Grass extends GameObject {
  constructor(gl, programInfo, count, spreadArea) {
    super();
    this.programInfo = programInfo;
    this.grassPositions = [];

    // Gera posições aleatórias para a grama
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spreadArea;
      const z = (Math.random() - 0.5) * spreadArea;
      const y = 0; // Ajustar para o terreno, se necessário
      this.grassPositions.push(x, y, z);
    }
  }

  draw(gl, globalUniforms) {
    if (!this.programInfo || !this.bufferInfo) return;

    gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
    twgl.setUniforms(this.programInfo, globalUniforms);
    twgl.setUniforms(this.programInfo, { u_diffuseMap: this.texture });

    // Em um cenário real, utilize ANGLE_instanced_arrays / gl.drawElementsInstanced
    // ou twgl.drawBufferInfo com instanciamento habilitado no bufferInfo.
    // twgl.drawBufferInfo(gl, this.bufferInfo, gl.TRIANGLES, this.bufferInfo.numElements, 0, this.grassPositions.length / 3);
  }
}
