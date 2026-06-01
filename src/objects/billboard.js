import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";
import { mat4, degToRad } from "../../utils/math.js";

export class Billboard extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;

    this.bufferInfo = twgl.primitives.createPlaneBufferInfo(gl, 16, 9);

    // Usa a textura de colormap ou outra para a propaganda
    AssetManager.loadTexture("colormap", "assets/models/Textures/colormap.png");
    this.texture = AssetManager.getTexture("colormap");

    // O plano é deitado por padrão no TWGL, precisamos levantar em 90 graus
    this.rotation[0] = degToRad(90);
  }

  // Sobrescrevendo getWorldMatrix para garantir que o tilt de 90 graus fique correto
  getWorldMatrix() {
    let localMatrix = super.getWorldMatrix();
    // Ajustes adicionais de offset podem ser feitos aqui se necessário
    return localMatrix;
  }
}
