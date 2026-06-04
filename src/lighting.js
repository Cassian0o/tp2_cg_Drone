// ==========================================
// src/lighting.js (Atualizado)
// [x] Luzes pontuais nos postes
// ==========================================
import { isKeyPressed } from "../utils/input.js";

// Adicionado array de pointLights para os postes
export let lightingState = {
  directionalLightColor: [1.0, 1.0, 0.9],
  directionalLightDir: [-0.577, -0.577, -0.577], // Normalizado internamente
  ambientLight: [0.2, 0.2, 0.22],
  isLightOn: true,
  pointLights: [], // { position: [x,y,z], color: [r,g,b], constant, linear, quadratic }
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

export function addPointLight(position, color) {
  lightingState.pointLights.push({
    position: position,
    color: color,
    constant: 1.0,
    linear: 0.09,
    quadratic: 0.032,
  });
}

export function getLightingUniforms() {
  // Converte point lights para arrays planos para envio ao shader
  const pointLightPositions = [];
  const pointLightColors = [];

  lightingState.pointLights.forEach((light) => {
    pointLightPositions.push(...light.position);
    pointLightColors.push(...light.color);
  });

  return {
    u_ambientLight: lightingState.ambientLight,
    u_lightDir: lightingState.directionalLightDir,
    u_lightColor: lightingState.isLightOn
      ? lightingState.directionalLightColor
      : [0, 0, 0],
    u_numPointLights: lightingState.pointLights.length,
    u_pointLightPositions: pointLightPositions.length
      ? pointLightPositions
      : [0, 0, 0],
    u_pointLightColors: pointLightColors.length ? pointLightColors : [0, 0, 0],
  };
}
