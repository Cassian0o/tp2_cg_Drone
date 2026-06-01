import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

export class Propeller extends GameObject {
  constructor(gl, programInfo, isLeft) {
    super();
    this.programInfo = programInfo;

    // Simulação do buffer para a hélice (idealmente seria um obj)
    this.bufferInfo = twgl.primitives.createCylinderBufferInfo(
      gl,
      0.5,
      0.1,
      12,
      1,
    );

    // Textura escura para as hélices
    AssetManager.loadTexture("dark_metal", "assets/textures/metal_diffuse.jpg");
    this.texture = AssetManager.getTexture("dark_metal");

    this.rotationSpeed = 20.0; // Velocidade de giro

    // Posicionamento relativo ao Drone (pai)
    this.position = isLeft ? [-1.5, 0.5, 0] : [1.5, 0.5, 0];
  }

  update(deltaTime) {
    // Gira continuamente no próprio eixo Y (local)
    this.rotation[1] += this.rotationSpeed * deltaTime;

    // Chama o update do pai (GameObject)
    super.update(deltaTime);
  }
}
