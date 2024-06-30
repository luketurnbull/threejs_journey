uniform vec3 uColour;
uniform sampler2D uTexture;

varying vec2 vuv;
varying float vElevation;

void main() {
   vec4 textureColour = texture2D(uTexture, vuv);
   textureColour.rgb *= vElevation * 2.0 + 0.9;
   gl_FragColor = vec4(textureColour);
}
