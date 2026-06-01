export class AssetManager {
  static textures = {};

  static init(gl) {
    this.gl = gl;
  }

  static loadTexture(name, url) {
    // Se a textura já foi carregada antes, ignora e usa a da memória!
    if (this.textures[name]) return;

    this.textures[name] = twgl.createTexture(this.gl, {
      src: url,
      min: this.gl.LINEAR_MIPMAP_LINEAR,
      mag: this.gl.LINEAR,
      wrap: this.gl.REPEAT,
    });
  }

  static loadCubemap(name, urls) {
    if (this.textures[name]) return;
    this.textures[name] = twgl.createTexture(this.gl, {
      target: this.gl.TEXTURE_CUBE_MAP,
      src: urls,
      min: this.gl.LINEAR_MIPMAP_LINEAR,
    });
  }

  static getTexture(name) {
    return this.textures[name];
  }
}
