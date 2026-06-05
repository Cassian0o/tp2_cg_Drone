import { Engine }          from "./src/engine/engine.js";
import { Scene }           from "./src/world/Scene.js";
import { Camera }          from "./src/camera/Camera.js";
import { City }            from "./src/world/city.js";
import { InputManager }    from "./src/engine/InputManager.js";
import { AssetManager }    from "./src/engine/AssetManager.js";
import { DroneCarrier }    from "./src/objects/DroneCarrier.js";
import { initLighting }    from "./src/lighting.js";
import { DayNightCycle }   from "./src/world/dayNight.js";
import { initFog }         from "./src/world/fog.js";
import { SmokeParticles }  from "./src/world/particles.js";
import { Car }             from "./src/objects/Cars.js";
import { Grass }           from "./src/world/grass.js";

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
  initFog();

  const vsSource = await loadShader("shaders/phong.vert");
  const fsSource = await loadShader("shaders/phong.frag");
  const phongProgramInfo = twgl.createProgramInfo(gl, [vsSource, fsSource]);

  const scene  = new Scene();
  const camera = new Camera(gl);
  scene.setCamera(camera);

  City.build(gl, scene, phongProgramInfo);

  // Drone
  const drone = new DroneCarrier(gl, phongProgramInfo);
  scene.add(drone);
  camera.attachDrone(drone);

  // Ciclo dia/noite
  const dayNight = new DayNightCycle();
  scene.addUpdatable(dayNight);

  // Partículas de fumaça seguindo o drone
  const smoke = new SmokeParticles(drone);
  scene.add(smoke);

  // Carros voadores com rotas autônomas
  const flyingRoutes = [
    [ [60, 30, -60], [-60, 35, -60], [-60, 30, 60], [60, 35, 60] ],
    [ [-80, 25, 0],  [0, 28, 80],   [80, 25, 0],   [0, 22, -80] ],
    [ [40, 40, 40],  [-40, 45, 40], [-40, 40, -40], [40, 45, -40] ],
  ];
  flyingRoutes.forEach((waypoints) => {
    const car = new Car(gl, phongProgramInfo, waypoints);
    car.bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 2);
    scene.add(car);
  });

  // Grama billboard espalhada pelo terreno
  const grass = new Grass(gl, phongProgramInfo, 300, 400);
  scene.add(grass);

  _createHUD();

  const bgm = document.getElementById("bgm");
  const ui  = document.getElementById("start-ui");
  document.body.addEventListener("click", () => {
    bgm.play().catch(() => {});
    if (ui) ui.style.display = "none";
  }, { once: true });

  engine.setScene(scene);
  engine.start();
}

function _createHUD() {
  const hud = document.createElement("div");
  hud.innerHTML = `
    <b>Drone Carrier</b><br>
    W/S — mover &nbsp;&nbsp; A/D — girar<br>
    1 — câmera aérea<br>
    2 — câmera lateral &nbsp; C — alternar lado<br>
    3 — câmera cabine (setas giram o olhar)<br>
    L — toggle luz &nbsp;&nbsp; N — neblina
  `;
  hud.style.cssText = `
    position:absolute; bottom:16px; left:16px;
    color:#fff; font:13px/1.8 monospace;
    background:rgba(0,0,0,.6); padding:12px 16px;
    border-radius:8px; pointer-events:none; z-index:10;
  `;
  document.body.appendChild(hud);
}

main();
