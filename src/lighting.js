// ==========================================
// src/lighting.js (Atualizado)
// [x] Luzes pontuais nos postes
// ==========================================
import { InputManager } from "./engine/InputManager.js";

// Adicionado array de pointLights para os postes
export let lightingState = {
  directionalLightColor: [0.98, 0.94, 0.86],
  directionalLightDir: [-0.45, -0.82, -0.36],
  ambientLight: [0.34, 0.36, 0.4],
  isLightOn: true,
  pointLights: [], // { position: [x,y,z], color: [r,g,b], constant, linear, quadratic }
};

let lKeyWasPressed = false;

export function initLighting() {
  lKeyWasPressed = false;
}

export function updateLighting() {
  const isLPressed = InputManager.isKeyPressed("L");
  if (isLPressed && !lKeyWasPressed) {
    lightingState.isLightOn = !lightingState.isLightOn;
  }
  lKeyWasPressed = isLPressed;
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

export function getLightingUniforms(viewPosition = [0, 0, 0]) {
  // Converte point lights para arrays planos para envio ao shader
  const pointLightPositions = [];
  const pointLightColors = [];

  const activePointLights = lightingState.pointLights
    .map((light) => {
      const dx = light.position[0] - viewPosition[0];
      const dy = light.position[1] - viewPosition[1];
      const dz = light.position[2] - viewPosition[2];
      return { light, distSq: dx * dx + dy * dy + dz * dz };
    })
    .sort((a, b) => a.distSq - b.distSq)
    .slice(0, 8)
    .map((entry) => entry.light);

  activePointLights.forEach((light) => {
    pointLightPositions.push(...light.position);
    pointLightColors.push(...light.color);
  });

  return {
    u_ambientLight: lightingState.isLightOn
      ? lightingState.ambientLight
      : [0.03, 0.03, 0.04],
    u_lightDir: lightingState.directionalLightDir,
    u_lightColor: lightingState.isLightOn
      ? lightingState.directionalLightColor
      : [0, 0, 0],
    u_numPointLights: lightingState.isLightOn ? activePointLights.length : 0,
    u_castShadows: lightingState.isLightOn && lightingState.directionalLightDir[1] < -0.08,
    u_pointLightPositions: pointLightPositions.length
      ? pointLightPositions
      : [0, 0, 0],
    u_pointLightColors: pointLightColors.length ? pointLightColors : [0, 0, 0],
  };
}
