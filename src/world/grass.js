import { GameObject } from "../objects/GameObject.js";

export class Grass extends GameObject {
  constructor(gl, programInfo, count, spreadArea) {
    super();
    this.programInfo = programInfo;

    // Cria um quad simples para cada touceira de grama (billboard)
    this.blades = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spreadArea;
      const z = (Math.random() - 0.5) * spreadArea;
      // Evita colocar grama no meio das ruas e prédios
      if (Math.abs(x) < 18 || Math.abs(z) < 18) continue;
      this.blades.push({ x, z });
    }

    // Quad vertical — representa uma touceira de grama
    this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, 1, 2);

    // Cor verde sólida como textura fallback
    const pixel = new Uint8Array([34, 139, 34, 255]);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    this.texture = tex;
  }

  draw(gl, globalUniforms) {
    if (!this.programInfo || !this.bufferInfo) return;

    gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);

    // Extrai posição da câmera para fazer o billboard virar para ela
    const camPos = globalUniforms.u_viewPosition || [0, 0, 0];

    this.blades.forEach(({ x, z }) => {
      // Ângulo do billboard em direção à câmera
      const dx  = camPos[0] - x;
      const dz  = camPos[2] - z;
      const yaw = Math.atan2(dx, dz);

      const world = twgl.m4.identity();
      twgl.m4.translate(world, [x, 1, z], world);
      twgl.m4.rotateY(world, yaw, world);
      twgl.m4.scale(world, [1, 2, 1], world);

      twgl.setUniforms(this.programInfo, globalUniforms);
      twgl.setUniforms(this.programInfo, {
        u_world: world,
        u_worldInverseTranspose: twgl.m4.transpose(twgl.m4.inverse(world)),
        u_diffuseMap: this.texture,
        u_opacity: 1.0,
      });

      twgl.drawBufferInfo(gl, this.bufferInfo);
    });
  }
}
