import { GameObject } from "../objects/GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

export class Terrain extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;

    const arrays = twgl.primitives.createPlaneVertices(1000, 1000, 50, 50);
    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    // Utilizando as texturas corretas de chão
    AssetManager.loadTexture(
      "ground_diffuse",
      "assets/textures/ground_diffuse.jpg",
    );
    this.texture = AssetManager.getTexture("ground_diffuse");

    // Nota: Para usar o specular e o normal map ('ground_specular.jpg' e 'ground_normal.jpg'),
    // os shaders (phong.vert e phong.frag) precisarão de uniforms adicionais.
  }
}
