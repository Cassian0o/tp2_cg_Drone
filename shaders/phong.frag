#version 300 es
precision highp float;

in vec3 v_normal;
in vec2 v_texcoord;
in vec3 v_surfaceToView;
in vec3 v_worldPosition;

uniform sampler2D u_diffuseMap;
uniform vec3  u_lightDir;
uniform vec3  u_lightColor;
uniform vec3  u_ambientLight;
uniform float u_opacity;

// Luzes pontuais dos postes (máximo 8)
uniform int   u_numPointLights;
uniform vec3  u_pointLightPositions[8];
uniform vec3  u_pointLightColors[8];

// Neblina
uniform int   u_fogOn;
uniform vec4  u_fogColor;
uniform float u_fogDensity;
uniform vec3  u_viewPosition;

out vec4 outColor;

void main() {
    vec3 normal               = normalize(v_normal);
    vec3 surfaceToViewDir     = normalize(v_surfaceToView);
    vec3 halfVector           = normalize(-u_lightDir + surfaceToViewDir);

    // Luz direcional (sol/lua)
    float light    = max(dot(normal, -u_lightDir), 0.0);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(max(dot(normal, halfVector), 0.0), 50.0);
    }

    vec4 diffuseColor = texture(u_diffuseMap, v_texcoord);
    vec3 color = diffuseColor.rgb * u_ambientLight
               + diffuseColor.rgb * light * u_lightColor
               + specular * u_lightColor;

    // Luzes pontuais dos postes
    for (int i = 0; i < 8; i++) {
        if (i >= u_numPointLights) break;
        vec3  toLight  = u_pointLightPositions[i] - v_worldPosition;
        float dist     = length(toLight);
        vec3  lightDir = toLight / dist;
        float atten    = 1.0 / (1.0 + 0.09 * dist + 0.032 * dist * dist);
        float diff     = max(dot(normal, lightDir), 0.0);
        color += diffuseColor.rgb * u_pointLightColors[i] * diff * atten;
    }

    // Neblina exponencial
    if (u_fogOn == 1) {
        float dist    = length(u_viewPosition - v_worldPosition);
        float fogFact = exp(-u_fogDensity * dist);
        fogFact       = clamp(fogFact, 0.0, 1.0);
        color         = mix(u_fogColor.rgb, color, fogFact);
    }

    outColor = vec4(color, diffuseColor.a * u_opacity);
}
