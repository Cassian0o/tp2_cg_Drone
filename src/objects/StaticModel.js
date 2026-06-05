import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";
import { loadObj } from "../engine/ObjLoader.js";

export class StaticModel extends GameObject {
  constructor(gl, programInfo, modelPath, options = {}) {
    super();
    this.gl = gl;
    this.programInfo = programInfo;
    this.modelPath = modelPath;

    this.position = options.position || [0, 0, 0];
    this.rotation = options.rotation || [0, 0, 0];
    this.scale = options.scale || [1, 1, 1];
    this.materialColor = options.materialColor || [1, 1, 1];
    this.castsShadow = options.castsShadow ?? true;

    AssetManager.loadTexture("colormap", "assets/models/Textures/colormap.png");
    this.texture = AssetManager.getTexture("colormap");
    this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
    this._loadModel();
  }

  async _loadModel() {
    try {
      this.bufferInfo = await loadObj(this.gl, this.modelPath);
    } catch (e) {
      console.warn(`StaticModel: could not load ${this.modelPath}; using cube fallback.`, e);
    }
  }
}
