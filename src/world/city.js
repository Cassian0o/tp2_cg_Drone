import { Vehicle } from "../objects/Vehicle.js";
import { LampPost } from "../objects/lampPost.js";
import { Billboard } from "../objects/billboard.js";
import { Terrain } from "./Terrain.js";
import { Building } from "../objects/Building.js";
import { Skybox } from "./Skybox.js";

export class City {
  static build(gl, scene, phongProgramInfo) {
    const skybox = new Skybox(gl);
    scene.add(skybox);

    const terrain = new Terrain(gl, phongProgramInfo);
    scene.add(terrain);

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

      // Posição nas ruas (exemplo de Z fixo e X variando)
      car.position = [-15 + i * 5, 1.5, Math.random() * 200 - 100];
      car.scale = [1.5, 1.5, 1.5]; // Ajuste a escala conforme o OBJ exportado

      scene.add(car);
    }

    // Criando um Poste e um Outdoor de Teste
    const poste = new LampPost(gl, phongProgramInfo);
    poste.position = [12, 7.5, 12];
    scene.add(poste);

    const billboard = new Billboard(gl, phongProgramInfo);
    billboard.position = [-14, 15, -14];
    billboard.rotation[1] = Math.PI / 4; // Rotação Yaw de 45 graus
    scene.add(billboard);

    // Instanciando os prédios usando os modelos da pasta assets/models/
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
          building.scale = [10, 30, 10]; // Escala temporária até o loader de OBJ processar os vértices reais

          scene.add(building);
        }
      }
    }
  }
}
