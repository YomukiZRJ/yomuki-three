uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
// attribute float aRandom;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    // vRandom = aRandom;
    
    
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1; // 波浪
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1; // 波浪
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1; // 风的仰角，为了创建不同海拔下的亮与暗
    elevation+=sin(modelPosition.y * uFrequency.y - uTime) * 0.1; 
    modelPosition.z += elevation;
    // modelPosition.z += aRandom *0.1;
    vec4 viewPosiotion = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosiotion;
    gl_Position = projectionPosition;
    // gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);

    vUv = uv;
    vElevation = elevation;
}