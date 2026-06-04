// ==========================================
// src/world/fog.js
// [x] Neblina via tecla N
// ==========================================
import { isKeyPressed } from "../../utils/input.js";

export let fogState = {
  isFogOn: false,
  fogColor: [0.6, 0.6, 0.65, 1.0],
  fogDensity: 0.03,
};

let nKeyWasPressed = false;

export function initFog() {
  setInterval(() => {
    const isNPressed = isKeyPressed("N");
    if (isNPressed && !nKeyWasPressed) {
      fogState.isFogOn = !fogState.isFogOn;
    }
    nKeyWasPressed = isNPressed;
  }, 1000 / 60);
}

export function getFogUniforms() {
  return {
    u_fogOn: fogState.isFogOn ? 1 : 0,
    u_fogColor: fogState.fogColor,
    u_fogDensity: fogState.fogDensity,
  };
}
