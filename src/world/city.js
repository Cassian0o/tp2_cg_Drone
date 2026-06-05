import { Vehicle }       from "../objects/Vehicle.js";
import { LampPost }      from "../objects/lampPost.js";
import { Billboard }     from "../objects/billboard.js";
import { Terrain }       from "./Terrain.js";
import { Building }      from "../objects/building.js";
import { Skybox }        from "./Skybox.js";
import { Road }          from "./roads.js";
import { addPointLight } from "../lighting.js";

export class City {
  static build(gl, scene, phongProgramInfo) {
    const skybox = new Skybox(gl);
    scene.add(skybox);

    const terrain = new Terrain(gl, phongProgramInfo);
    scene.add(terrain);

    const roadH = new Road(gl, phongProgramInfo, false);
    const roadV = new Road(gl, phongProgramInfo, true);
    scene.add(roadH);
    scene.add(roadV);

    // Veículos — modelos OBJ Kenney são ~1 unidade; escala para ficarem visíveis
    const vehicleModels = ["police", "ambulance", "taxi", "sedan", "suv", "firetruck"];
    for (let i = 0; i < 10; i++) {
      const vModel = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
      const car = new Vehicle(gl, phongProgramInfo, vModel);
      car.position = [-15 + i * 5, 0, Math.random() * 200 - 100];
      car.scale    = [3, 3, 3]; // modelos Kenney são ~1 unidade
      scene.add(car);
    }

    // Postes com luzes pontuais (+4%)
    const postPositions = [
      [12, 7.5, 12],  [-12, 7.5, 12],
      [12, 7.5, -12], [-12, 7.5, -12],
      [40, 7.5, 0],   [-40, 7.5, 0],
      [0, 7.5, 40],   [0, 7.5, -40],
    ];
    postPositions.forEach(([x, y, z]) => {
      const poste = new LampPost(gl, phongProgramInfo);
      poste.position = [x, y, z];
      scene.add(poste);
      addPointLight([x, y + 7, z], [1.0, 0.9, 0.6]);
    });

    const billboard = new Billboard(gl, phongProgramInfo);
    billboard.position  = [-14, 15, -14];
    billboard.rotation[1] = Math.PI / 4;
    scene.add(billboard);

    // Prédios — OBJs Kenney são ~1–2 unidades; escala grande para cidade
    const buildingModels = [
      "building-a", "building-b", "building-c",
      "building-skyscraper-a", "building-skyscraper-b",
    ];
    for (let x = -100; x <= 100; x += 40) {
      for (let z = -100; z <= 100; z += 40) {
        if (Math.abs(x) > 20 && Math.abs(z) > 20) {
          const modelName = buildingModels[Math.floor(Math.random() * buildingModels.length)];
          const building  = new Building(gl, phongProgramInfo, modelName);
          building.position = [x, 0, z];
          building.scale    = [20, 20, 20]; // escala para OBJ Kenney (~1 unidade)
          scene.add(building);
        }
      }
    }
  }
}
