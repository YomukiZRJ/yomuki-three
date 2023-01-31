varying vec3 vColor;
void main()
{
    // 画个扩散的圆
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength; // 反一下

    // 画个发光的圆
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength,10.0); // 幂函数
    // 颜色
    gl_FragColor = vec4(vColor, strength); // 用透明度代替mix 提高性能
}