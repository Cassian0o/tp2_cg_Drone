import { isKeyPressed } from "../utils/input.js";
import { vec3 } from "../utils/math.js";

export let lightingState = {
  directionalLightColor: [1.0, 1.0, 0.9],
  directionalLightDir: vec3.normalize([-1, -1, -0.5]),
  ambientLight: [0.2, 0.2, 0.22],
  isLightOn: true,
};

let lKeyWasPressed = false;

export function initLighting() {
  setInterval(() => {
    const isLPressed = isKeyPressed("L");
    if (isLPressed && !lKeyWasPressed) {
      lightingState.isLightOn = !lightingState.isLightOn;
    }
    lKeyWasPressed = isLPressed;
  }, 1000 / 60);
}

export function getLightingUniforms() {
  return {
    u_ambientLight: lightingState.ambientLight,
    u_lightDir: lightingState.directionalLightDir,
    u_lightColor: lightingState.isLightOn
      ? lightingState.directionalLightColor
      : [0, 0, 0],
  };
}
