precision mediump float;
varying vec2 tcord;
uniform sampler2D samp;
void main() {
    //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = texture2D(samp, tcord);
}
