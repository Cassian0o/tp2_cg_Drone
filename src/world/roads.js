import { GameObject } from "../objects/GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";
import { mat4 } from "../../utils/math.js";

export class Road extends GameObject {
  constructor(gl, programInfo, isVertical) {
    super();
    this.programInfo = programInfo;
    this.castsShadow = false;
    this.materialColor = [0.46, 0.47, 0.48];

    const width = isVertical ? 24 : 500;
    const depth = isVertical ? 500 : 24;

    this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, width, depth);

    AssetManager.loadTexture(
      "ground_specular",
      "assets/textures/ground_specular.jpg",
    );
    this.texture = AssetManager.getTexture("ground_specular");

    // Diferença mínima no eixo Y para evitar Z-Fighting (sobreposição de texturas)
    this.position = [0, isVertical ? 0.11 : 0.1, 0];
  }
}
