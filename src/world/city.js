import { Vehicle } from "../objects/Vehicle.js";
import { LampPost } from "../objects/lampPost.js";
import { StaticModel } from "../objects/StaticModel.js";
import { Terrain } from "./Terrain.js";
import { Building } from "../objects/building.js";
import { Skybox } from "./Skybox.js";
import { Road } from "./roads.js";
import { LandingPad } from "./landingPad.js";
import { MountainRange } from "./mountainRange.js";
import { addPointLight } from "../lighting.js";

// City constrói o cenário urbano: prédios, estradas, tráfego e props.
export class City {
  static build(gl, scene, phongProgramInfo) {
    const skybox = new Skybox(gl);
    scene.add(skybox);

    const terrain = new Terrain(gl, phongProgramInfo);
    scene.add(terrain);

    const mountains = new MountainRange(gl, phongProgramInfo);
    scene.add(mountains);

    const roadH = new Road(gl, phongProgramInfo, false);
    const roadV = new Road(gl, phongProgramInfo, true);
    scene.add(roadH);
    scene.add(roadV);

    const landingPad = new LandingPad(gl, phongProgramInfo);
    scene.add(landingPad);

    City._addTraffic(gl, scene, phongProgramInfo);
    City._addLights(gl, scene, phongProgramInfo);
    City._addBuildings(gl, scene, phongProgramInfo);
    City._addProps(gl, scene, phongProgramInfo);
  }

  static _addTraffic(gl, scene, programInfo) {
    const vehicleModels = [
      "police",
      "ambulance",
      "taxi",
      "sedan",
      "suv",
      "firetruck",
      "van",
      "truck",
      "delivery",
    ];

    for (let i = 0; i < 22; i++) {
      const modelName =
        vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
      const car = new Vehicle(gl, programInfo, modelName);
      const lane = i % 4;

      car.position = [
        lane < 2 ? -10 + lane * 20 : Math.random() * 240 - 120,
        0,
        lane < 2 ? Math.random() * 280 - 140 : -10 + (lane - 2) * 20,
      ];
      car.rotation[1] = lane < 2 ? 0 : Math.PI / 2;
      car.direction = lane < 2 ? [0, 0, 1] : [1, 0, 0];
      car.scale = [3, 3, 3];
      scene.add(car);
    }
  }

  static _addLights(gl, scene, programInfo) {
    const postPositions = [];
    for (let p = -140; p <= 140; p += 35) {
      if (Math.abs(p) < 30) continue;
      postPositions.push(
        [22, 7.5, p],
        [-22, 7.5, p],
        [p, 7.5, 22],
        [p, 7.5, -22],
      );
    }

    postPositions.forEach(([x, y, z]) => {
      const poste = new LampPost(gl, programInfo);
      poste.position = [x, y, z];
      scene.add(poste);
      addPointLight([x, y + 7, z], [3.1, 2.35, 1.15]);
    });
  }

  static _addBuildings(gl, scene, programInfo) {
    const buildingModels = [
      "building-a",
      "building-b",
      "building-c",
      "building-d",
      "building-e",
      "building-f",
      "building-g",
      "building-h",
      "building-i",
      "building-j",
      "building-k",
      "building-l",
      "building-m",
      "building-n",
      "building-skyscraper-a",
      "building-skyscraper-b",
      "building-skyscraper-c",
      "building-skyscraper-d",
      "building-skyscraper-e",
    ];

    for (let x = -144; x <= 144; x += 32) {
      for (let z = -144; z <= 144; z += 32) {
        const reservedForRoads = Math.abs(x) < 24 || Math.abs(z) < 24;
        const reservedForLanding =
          Math.abs(x - 70) < 42 && Math.abs(z - 70) < 38;
        if (reservedForRoads || reservedForLanding || Math.random() < 0.16)
          continue;

        const modelName =
          buildingModels[Math.floor(Math.random() * buildingModels.length)];
        const building = new Building(gl, programInfo, modelName);
        const isTower = modelName.includes("skyscraper");
        const footprint = isTower
          ? 17 + Math.random() * 5
          : 14 + Math.random() * 6;
        const height = isTower
          ? 24 + Math.random() * 8
          : 12 + Math.random() * 8;

        building.position = [
          x + Math.random() * 6 - 3,
          0,
          z + Math.random() * 6 - 3,
        ];
        building.rotation[1] = (Math.floor(Math.random() * 4) * Math.PI) / 2;
        building.scale = [footprint, height, footprint];
        scene.add(building);
      }
    }
  }

  static _addProps(gl, scene, programInfo) {
    const props = [
      {
        path: "assets/models/antenna.obj",
        position: [-118, 0, 24],
        scale: [8, 8, 8],
        color: [0.82, 0.88, 0.94],
      },
      {
        path: "assets/models/antenna.obj",
        position: [124, 0, -28],
        scale: [8, 8, 8],
        color: [0.82, 0.88, 0.94],
      },
      {
        path: "assets/models/windmill.obj",
        position: [-152, 0, 116],
        scale: [12, 12, 12],
        color: [1.0, 0.94, 0.8],
      },
      {
        path: "assets/models/windmill.obj",
        position: [146, 0, -124],
        scale: [12, 12, 12],
        color: [1.0, 0.94, 0.8],
      },
      {
        path: "assets/models/tractor.obj",
        position: [-92, 0, -132],
        scale: [6, 6, 6],
        color: [0.95, 0.82, 0.42],
      },
      {
        path: "assets/models/detail-parasol-a.obj",
        position: [38, 0, 88],
        scale: [7, 7, 7],
        color: [1.0, 0.9, 0.65],
      },
      {
        path: "assets/models/detail-parasol-b.obj",
        position: [104, 0, 42],
        scale: [7, 7, 7],
        color: [0.84, 0.94, 1.0],
      },
      {
        path: "assets/models/detail-overhang-wide.obj",
        position: [-52, 0, 32],
        scale: [8, 8, 8],
        color: [1.0, 0.72, 0.52],
      },
      {
        path: "assets/models/detail-awning-wide.obj",
        position: [52, 0, -32],
        scale: [8, 8, 8],
        color: [0.72, 0.9, 1.0],
      },
    ];

    props.forEach((prop) => {
      const model = new StaticModel(gl, programInfo, prop.path, {
        position: prop.position,
        rotation: [0, Math.random() * Math.PI * 2, 0],
        scale: prop.scale,
        materialColor: prop.color,
      });
      scene.add(model);
    });
  }
}
