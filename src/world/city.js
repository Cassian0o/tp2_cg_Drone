import { Vehicle } from "../objects/Vehicle.js";
import { LampPost } from "../objects/lampPost.js";
import { Billboard } from "../objects/billboard.js";
import { Terrain } from "./Terrain.js";
import { Building } from "../objects/Building.js";
import { Skybox } from "./Skybox.js";
import { Road } from "./roads.js";

export class City {
  static build(gl, scene, phongProgramInfo) {
    const skybox = new Skybox(gl);
    scene.add(skybox);

    const terrain = new Terrain(gl, phongProgramInfo);
    scene.add(terrain);

    // Instanciando as ruas
    const roadH = new Road(gl, phongProgramInfo, false);
    const roadV = new Road(gl, phongProgramInfo, true);
    scene.add(roadH);
    scene.add(roadV);

    // Criando Trânsito
    const vehicleModels = [
      "police",
      "ambulance",
      "taxi",
      "sedan",
      "suv",
      "firetruck",
    ];
    for (let i = 0; i < 10; i++) {
      const vModel =
        vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
      const car = new Vehicle(gl, phongProgramInfo, vModel);
      car.position = [-15 + i * 5, 1.5, Math.random() * 200 - 100];
      car.scale = [1.5, 1.5, 1.5];
      scene.add(car);
    }

    // Criando um Poste e um Outdoor
    const poste = new LampPost(gl, phongProgramInfo);
    poste.position = [12, 7.5, 12];
    scene.add(poste);

    const billboard = new Billboard(gl, phongProgramInfo);
    billboard.position = [-14, 15, -14];
    billboard.rotation[1] = Math.PI / 4;
    scene.add(billboard);

    // Criando os prédios
    const buildingModels = [
      "building-a",
      "building-b",
      "building-c",
      "building-skyscraper-a",
      "building-skyscraper-b",
    ];
    for (let x = -100; x <= 100; x += 40) {
      for (let z = -100; z <= 100; z += 40) {
        if (Math.abs(x) > 20 && Math.abs(z) > 20) {
          const modelName =
            buildingModels[Math.floor(Math.random() * buildingModels.length)];
          const building = new Building(gl, phongProgramInfo, modelName);
          building.position = [x, 15, z];
          building.scale = [10, 30, 10];
          scene.add(building);
        }
      }
    }
  }
}
