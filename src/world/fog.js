// ==========================================
// src/world/fog.js
// [x] Neblina via tecla N
// ==========================================
import { InputManager } from "../engine/InputManager.js";

export let fogState = {
  isFogOn: false,
  fogColor: [0.6, 0.6, 0.65, 1.0],
  fogDensity: 0.018,
};

let nKeyWasPressed = false;

export function initFog() {
  nKeyWasPressed = false;
}

export function updateFog() {
  const isNPressed = InputManager.isKeyPressed("N");
  if (isNPressed && !nKeyWasPressed) {
    fogState.isFogOn = !fogState.isFogOn;
  }
  nKeyWasPressed = isNPressed;
}

export function getFogUniforms() {
  return {
    u_fogOn: fogState.isFogOn ? 1 : 0,
    u_fogColor: fogState.fogColor,
    u_fogDensity: fogState.fogDensity,
  };
}
