import { Engine } from "./src/engine/engine.js";
import { Scene } from "./src/world/Scene.js";
import { Camera } from "./src/camera/Camera.js";
import { City } from "./src/world/city.js";
import { InputManager } from "./src/engine/InputManager.js";
import { AssetManager } from "./src/engine/AssetManager.js";
import { DroneCarrier } from "./src/objects/DroneCarrier.js";
import { initLighting } from "./src/lighting.js";

async function loadShader(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar shader: ${url}`);
  return await response.text();
}

async function main() {
  const engine = new Engine("glcanvas");
  const gl = engine.gl;

  InputManager.init();
  AssetManager.init(gl);
  initLighting();

  const vsSource = await loadShader("shaders/phong.vert");
  const fsSource = await loadShader("shaders/phong.frag");
  const phongProgramInfo = twgl.createProgramInfo(gl, [vsSource, fsSource]);

  const scene = new Scene();
  const camera = new Camera(gl);
  scene.setCamera(camera);

  City.build(gl, scene, phongProgramInfo);

  const drone = new DroneCarrier(gl, phongProgramInfo);
  scene.add(drone);

  const bgm = document.getElementById("bgm");
  const ui = document.getElementById("start-ui");

  document.body.addEventListener(
    "click",
    () => {
      bgm.play().catch((e) => console.log("Áudio bloqueado."));
      if (ui) ui.style.display = "none";
    },
    { once: true },
  );

  engine.setScene(scene);
  engine.start();
}

main();
