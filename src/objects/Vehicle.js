import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";
import { mat4 } from "../../utils/math.js";

export class Vehicle extends GameObject {
  constructor(gl, programInfo, modelName) {
    super();
    this.programInfo = programInfo;

    // Aqui o AssetManager já deve ter o parser do OBJ pronto
    this.objPath = `assets/models/Textures/${modelName}.obj`;

    // Todos esses carros costumam usar o colormap.png
    AssetManager.loadTexture("colormap", "assets/models/Textures/colormap.png");
    this.texture = AssetManager.getTexture("colormap");

    this.speed = 10.0 + Math.random() * 15.0; // Velocidade aleatória
    this.direction = [0, 0, 1]; // Andando para frente no eixo Z
  }

  update(deltaTime) {
    // Lógica simples de patrulha/movimento autônomo
    this.position[0] += this.direction[0] * this.speed * deltaTime;
    this.position[2] += this.direction[2] * this.speed * deltaTime;

    // Se sair muito do mapa, reseta a posição (loop simples)
    if (this.position[2] > 150) this.position[2] = -150;
    if (this.position[2] < -150) this.position[2] = 150;
    if (this.position[0] > 150) this.position[0] = -150;
    if (this.position[0] < -150) this.position[0] = 150;

    super.update(deltaTime);
  }
}
