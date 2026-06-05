import { GameObject }  from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";
import { loadObj }      from "../engine/ObjLoader.js";

// Modelos disponíveis em assets/models/Textures/
const AVAILABLE_MODELS = [
  "police", "ambulance", "taxi", "sedan", "sedan-sports",
  "suv", "firetruck", "delivery", "van", "truck",
];

// Vehicle carrega modelos de carros e aplica a textura compartilhada.
export class Vehicle extends GameObject {
  constructor(gl, programInfo, modelName) {
    super();
    this.gl          = gl;
    this.programInfo = programInfo;
    this._modelName  = modelName;
    this._ready      = false;

    // Textura colormap — todos os modelos Kenney usam ela
    AssetManager.loadTexture("colormap", "assets/models/Textures/colormap.png");
    this.texture = AssetManager.getTexture("colormap");

    // Velocidade e direção aleatórias
    this.speed     = 10.0 + Math.random() * 15.0;
    this.direction = [0, 0, 1];

    // Carrega o OBJ de forma assíncrona; enquanto carrega usa um cubo placeholder
    this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
    this._loadModel();
  }

  async _loadModel() {
    // Garante que o nome existe na pasta; caso contrário usa sedan como fallback.
    const name = AVAILABLE_MODELS.includes(this._modelName)
      ? this._modelName
      : "sedan";

    try {
      const path = `assets/models/Textures/${name}.obj`;
      this.bufferInfo = await loadObj(this.gl, path);
      this._ready = true;
    } catch (e) {
      console.warn(`Vehicle: não foi possível carregar ${name}.obj, usando cubo.`, e);
    }
  }

  update(deltaTime) {
    // Move o veículo e repete a posição quando sai da área do mapa.
    this.position[0] += this.direction[0] * this.speed * deltaTime;
    this.position[2] += this.direction[2] * this.speed * deltaTime;

    // Loop simples no mapa
    if (this.position[2] >  150) this.position[2] = -150;
    if (this.position[2] < -150) this.position[2] =  150;
    if (this.position[0] >  150) this.position[0] = -150;
    if (this.position[0] < -150) this.position[0] =  150;

    super.update(deltaTime);
  }
}
