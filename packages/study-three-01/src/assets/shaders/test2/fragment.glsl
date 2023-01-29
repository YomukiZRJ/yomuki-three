#define PI 3.1415926
varying vec2 vUv;
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
vec2 rotate (vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos (rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos (rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x- mid.x) + mid.y
    );
}
void main()
{
    // float strength = vUv.x;

    // float strength = vUv.y;

    // float strength = 1.0 - vUv.y;

    // float strength = vUv.y * 10.0;

    // float strength = mod(vUv.y * 10.0,1.0);

    // float strength = mod(vUv.y * 10.0,1.0);
    // strength = step(0.5,strength);

    // float strength = mod(vUv.y * 10.0,1.0);
    // strength = step(0.9,strength);

    // float strength = mod(vUv.x * 10.0,1.0);
    // strength = step(0.9,strength);

    // float strength = step(0.9,mod(vUv.x * 10.0,1.0));
    // strength += step(0.9,mod(vUv.y * 10.0,1.0));

    // float strength = step(0.9,mod(vUv.x * 10.0,1.0));
    // strength *= step(0.9,mod(vUv.y * 10.0,1.0));

    // float strength = step(0.8,mod(vUv.y * 10.0,1.0));
    // strength -= step(0.8,mod(vUv.x * 10.0,1.0));

    // float strength = step(0.2,mod(vUv.x * 10.0,1.0));
    // strength *= step(0.8,mod(vUv.y * 10.0,1.0));

    // float barX = step(0.4,mod(vUv.x * 10.0,1.0)) * step(0.8,mod(vUv.y * 10.0,1.0));
    // float barY = step(0.4,mod(vUv.y * 10.0,1.0)) * step(0.8,mod(vUv.x * 10.0,1.0));
    // float strength = barX + barY;

    // float barX = step(0.4,mod(vUv.x * 10.0,1.0)) * step(0.8,mod(vUv.y * 10.0 + 0.2,1.0));
    // float barY = step(0.4,mod(vUv.y * 10.0,1.0)) * step(0.8,mod(vUv.x * 10.0 + 0.2,1.0));
    // float strength = barX + barY;

    // float strength = abs(vUv.x - 0.5);

    // float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    // float strength =max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    // float strength = step(0.2,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));

    // float strength1 = step(0.2,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // float strength2 = 1.0-step(0.25,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // float strength = strength1 * strength2;

    // float strength = floor(vUv.x * 10.0)/10.0;

    // float strength = floor(vUv.x * 10.0)/10.0;
    // strength *= floor(vUv.y * 10.0)/10.0;

    // float strength = random(vUv);

    // vec2 gridUv = vec2(floor(vUv.x * 10.0)/10.0,floor(vUv.y * 10.0)/10.0);
    // float strength = random(gridUv);

    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0)/10.0,
    //     floor(vUv.y * 10.0 + vUv.x * 5.0)/10.0
    // );
    // float strength = random(gridUv);

    // float strength = length(vUv);

    // float strength = length(vUv - 0.5);

    // float strength = distance(vUv, vec2(0.5));

    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // float strength = 0.02 / distance(vUv, vec2(0.5));

    // vec2 lightUv = vec2(
    //     vUv.x  * 0.2 + 0.4,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.02 / distance(lightUv, vec2(0.5));

    // float lightX = 0.015 / distance(vec2(vUv.y  * 0.1 + 0.45,vUv.x * 0.5 + 0.25), vec2(0.5));
    // float lightY = 0.015 / distance(vec2(vUv.x  * 0.1 + 0.45,vUv.y * 0.5 + 0.25), vec2(0.5));
    // float strength =lightX * lightY;

    // vec2 rotateUv = rotate(vUv,PI * 0.25,vec2(0.5));
    // float lightX = 0.015 / distance(vec2(rotateUv.y  * 0.1 + 0.45,rotateUv.x * 0.5 + 0.25), vec2(0.5));
    // float lightY = 0.015 / distance(vec2(rotateUv.x  * 0.1 + 0.45,rotateUv.y * 0.5 + 0.25), vec2(0.5));
    // float strength =lightX * lightY;

    // float strength = step(0.25,distance(vUv, vec2(0.5)));

    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // float strength = 1.0 - step(0.01,abs(distance(vUv, vec2(0.5)) - 0.25));

    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01,abs(distance(waveUv, vec2(0.5)) - 0.25));

    // vec2 waveUv = vec2(
    //     vUv.x+ sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01,abs(distance(waveUv, vec2(0.5)) - 0.25));

    // vec2 waveUv = vec2(
    //     vUv.x+ sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01,abs(distance(waveUv, vec2(0.5)) - 0.25));

    // float angle = atan(vUv.x,vUv.y);
    // float strength = angle;

    // float angle = atan(vUv.x - 0.5,vUv.y - 0.5);
    // float strength = angle;

    // float angle = atan(vUv.x - 0.5,vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // float angle = atan(vUv.x - 0.5,vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle,1.0);
    // float strength = angle;

    // float angle = atan(vUv.x - 0.5,vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 50.0);

    float angle = atan(vUv.x - 0.5,vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float sinsoid = sin(angle * 50.0);
    float radius = 0.25 + sinsoid * 0.02;
    float strength = 1.0 - step(0.01,abs(distance(vUv, vec2(0.5)) - radius));


    strength = clamp(strength,0.0,1.0);
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv,1.0);
    vec3 mixedColor = mix(blackColor,uvColor,strength);


    

    gl_FragColor = vec4(mixedColor, 1.0);
}