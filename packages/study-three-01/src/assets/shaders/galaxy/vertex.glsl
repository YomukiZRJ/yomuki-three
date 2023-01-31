attribute float aScale;
attribute vec3 aRandomness;
uniform float uTime;
uniform float uSize;
varying vec3 vColor;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x,modelPosition.z);// 坐标以x和y的夹角
    float distanceToCenter = length(modelPosition.xz);// 坐标距离中心点的距离
    // 1.0 / distanceToCenter ：为了让距离近的跑的更快 
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; // 偏移角度
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;// 临边
    modelPosition.z = sin(angle) * distanceToCenter; // 对边

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale;
    // gl_PointSize *= ( scale / - mvPosition.z );
    gl_PointSize *= ( 1.0 / -viewPosition.z ); // 开启透视

    vColor = color;
}