import { GameObject }   from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";
import { loadObj }       from "../engine/ObjLoader.js";

// Modelos disponíveis em assets/models/
const AVAILABLE_MODELS = [
  "building-a", "building-b", "building-c", "building-d",
  "building-e", "building-f", "building-g", "building-h",
  "building-i", "building-j", "building-k", "building-l",
  "building-m", "building-n",
  "building-skyscraper-a", "building-skyscraper-b",
  "building-skyscraper-c", "building-skyscraper-d",
  "building-skyscraper-e",
];

export class Building extends GameObject {
  constructor(gl, programInfo, modelName) {
    super();
    this.gl          = gl;
    this.programInfo = programInfo;
    this._modelName  = modelName;

    // Colormap — prédios Kenney também usam ela
    AssetManager.loadTexture("colormap", "assets/models/Textures/colormap.png");
    this.texture = AssetManager.getTexture("colormap");

    // Placeholder enquanto o OBJ carrega
    this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
    this._loadModel();
  }

  async _loadModel() {
    const name = AVAILABLE_MODELS.includes(this._modelName)
      ? this._modelName
      : "building-a";

    try {
      this.bufferInfo = await loadObj(this.gl, `assets/models/${name}.obj`);
    } catch (e) {
      console.warn(`Building: não foi possível carregar ${name}.obj, usando cubo.`, e);
    }
  }
}
