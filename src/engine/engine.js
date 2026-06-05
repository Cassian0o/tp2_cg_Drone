// Engine gerencia o contexto WebGL, o loop de atualização e a cena principal.
export class Engine {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    this.gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!this.gl) throw new Error("WebGL não suportado");

    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);

    this.scene = null;
    this.lastTime = 0;
  }

  // Associa a cena que será renderizada pelo motor.
  setScene(scene) {
    this.scene = scene;
  }

  // Inicia o loop de animação.
  start() {
    requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    const deltaTime = (time - this.lastTime) * 0.001;
    this.lastTime = time;

    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0.1, 0.1, 0.12, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    if (this.scene) {
      // Atualiza todos os objetos da cena com o tempo decorrido.
      this.scene.update(deltaTime);
      this.scene.draw(this.gl, time * 0.001);
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}
