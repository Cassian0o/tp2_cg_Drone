#version 300 es
precision highp float;

in vec3 v_normal;
in vec2 v_texcoord;
in vec3 v_surfaceToView;

uniform sampler2D u_diffuseMap;
uniform vec3 u_lightDir;
uniform vec3 u_lightColor;
uniform vec3 u_ambientLight;

out vec4 outColor;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(-u_lightDir + surfaceToViewDirection);

    float light = max(dot(normal, -u_lightDir), 0.0);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(max(dot(normal, halfVector), 0.0), 50.0);
    }

    vec4 diffuseColor = texture(u_diffuseMap, v_texcoord);
    
    vec3 color = diffuseColor.rgb * u_ambientLight +
                 diffuseColor.rgb * light * u_lightColor +
                 specular * u_lightColor;

    outColor = vec4(color, diffuseColor.a);
}