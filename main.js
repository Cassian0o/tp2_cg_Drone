import { Engine }        from "./src/engine/engine.js";
import { Scene }         from "./src/world/Scene.js";
import { Camera }        from "./src/camera/Camera.js";
import { City }          from "./src/world/city.js";
import { InputManager }  from "./src/engine/InputManager.js";
import { AssetManager }  from "./src/engine/AssetManager.js";
import { DroneCarrier }  from "./src/objects/DroneCarrier.js";
import { initLighting }  from "./src/lighting.js";

async function loadShader(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar shader: ${url}`);
  return await response.text();
}

async function main() {
  const engine = new Engine("glcanvas");
  const gl     = engine.gl;

  InputManager.init();
  AssetManager.init(gl);
  initLighting();

  const vsSource = await loadShader("shaders/phong.vert");
  const fsSource = await loadShader("shaders/phong.frag");
  const phongProgramInfo = twgl.createProgramInfo(gl, [vsSource, fsSource]);

  const scene  = new Scene();
  const camera = new Camera(gl);
  scene.setCamera(camera);

  City.build(gl, scene, phongProgramInfo);

  const drone = new DroneCarrier(gl, phongProgramInfo);
  scene.add(drone);

  // ── Fase 2: conecta o drone à câmera ──
  camera.attachDrone(drone);

  // HUD de teclas no canto da tela
  _createHUD();

  // Áudio
  const bgm = document.getElementById("bgm");
  const ui  = document.getElementById("start-ui");
  document.body.addEventListener(
    "click",
    () => {
      bgm.play().catch(() => {});
      if (ui) ui.style.display = "none";
    },
    { once: true }
  );

  engine.setScene(scene);
  engine.start();
}

function _createHUD() {
  const hud = document.createElement("div");
  hud.id = "hud";
  hud.innerHTML = `
    <b>Drone Carrier</b><br>
    W/S — mover &nbsp; A/D — girar<br>
    1 — câmera aérea<br>
    2 — câmera lateral &nbsp; C — alternar lado<br>
    3 — câmera cabine (setas giram o olhar)<br>
    L — toggle luz
  `;
  hud.style.cssText = `
    position:absolute; bottom:16px; left:16px;
    color:#fff; font:13px/1.7 monospace;
    background:rgba(0,0,0,.6); padding:12px 16px;
    border-radius:8px; pointer-events:none; z-index:10;
  `;
  document.body.appendChild(hud);
}

main();
