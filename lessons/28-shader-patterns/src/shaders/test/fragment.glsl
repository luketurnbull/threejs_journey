#define PI 3.14159265389793284626433832795


//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y   
    );
}

void main()
{
    // // Pattern 3
    // float strength = vUv.x;

    // // Pattern 4
    // float strength = vUv.y;

    // // Pattern 5
    // float strength = 1.0 - vUv.y;

    // // Pattern 6
    // float strength = vUv.y * 10.0;

    // // Pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0);

    // // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength);

    // // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // // Pattern 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // // Pattern 13
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;

    // // Pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;

    // // Pattern 15
    // float strength = abs(vUv.x - 0.5);

    // // Pattern 16
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // // Pattern 17
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // // Pattern 18
    // float maxVal = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // float strength = step(0.2, maxVal);

    // // Pattern 19
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // // Pattern 20
    // float strength = ceil(vUv.x * 10.0) / 10.0;
    // strength *= ceil(vUv.y * 10.0) / 10.0;

    // // Pattern 21
    // float strength = random(vUv);

    // // Pattern 22
    // vec2 gridUv = vec2(
    //     ceil(vUv.x * 10.0) / 10.0,
    //     ceil((vUv.y + vUv.x) * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // // Pattern 23
    // float strength = length(vUv);

    // // Pattern 24 - Dark circle in the middle
    // // You can offset the length to the middle
    // float strength = length(vUv - 0.5);

    // // Pattern 25 - Dark circle in the middle
    // // Or use distance to move it, in the middle for instcae:
    // float strength = distance(vUv, vec2(0.2, 0.5));

    // // Pattern 25 - White circle in middle
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // // Pattern 26 - Little white dot, looks like star
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // // Pattern 27 - Skewed spotlight effect
    // vec2 lightUv = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // // Pattern 29 - Star light
    // vec2 lightUvX = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(
    //     vUv.x * 0.5 + 0.25,
    //     vUv.y * 0.1 + 0.45
    // );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // // Pattern 30 - Star light rotated
    // vec2 middle = vec2(0.5);
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, middle);
    // vec2 lightUvX = vec2(
    //     rotatedUv.x * 0.1 + 0.45,
    //     rotatedUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(
    //     rotatedUv.x * 0.5 + 0.25,
    //     rotatedUv.y * 0.1 + 0.45
    // );
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // // Pattern 31 - Black circle
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // // Pattern 32 - Faded double circles
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.2);

    // // Pattern 33 - Circle line
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.2));

    // // Pattern 33 - Circle line, inverted
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.2));

    // // Pattern 34 - Circle line, wobbly
    // vec2 wavedUv = vec2( 
    //     vUv.x + sin(vUv.y * 30.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // // Pattern 35 - Cool sin and cos pattern
    // vec2 wavedUv = vec2( 
    //     vUv.x + sin(vUv.y * 100.0) * 0.1, 
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // // Pattern 36 - angles
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // // Pattern 37 - shorter angle
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // // Pattern 38 - Crazy spirals
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 50.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;

    // // Pattern 39 - 80s spirals
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 100.0);

    // // Pattern 40 - 80s spirals
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 100.0);

    // // Pattern 41 - Squiggle circle
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);

    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // // pattern 42 - Perlin noise
    // float strength = cnoise(vUv * 10.0);

    // // pattern 43 - Perlin noise without blur
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // // pattern 44 - Perlin noise glowing
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // // pattern 45 - Perlin noise with sin
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // // pattern 46 - Perlin noise with sin - sharper
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // pattern 46 - Perlin noise with sin - Inverted
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}