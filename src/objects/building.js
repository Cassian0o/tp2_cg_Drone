import { GameObject } from "./GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

export class Building extends GameObject {
  // modeloObjName pode ser 'building-a', 'building-skyscraper-a', etc.
  constructor(gl, programInfo, modeloObjName) {
    super();
    this.programInfo = programInfo;

    // Como o TWGL nativo gera primitivas, em um projeto real com OBJ usa-se um parser.
    // Aqui simulamos a estruturação de como o asset seria atrelado à classe.
    this.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 1);
    this.objPath = `assets/models/${modeloObjName}.obj`;
    this.mtlPath = `assets/models/${modeloObjName}.mtl`;

    AssetManager.loadTexture(
      "metal_diffuse",
      "assets/textures/metal_diffuse.jpg",
    );
    this.texture = AssetManager.getTexture("metal_diffuse");
  }
}
