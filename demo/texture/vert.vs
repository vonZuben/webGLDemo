attribute vec3 pos;
attribute vec2 tpos;
varying vec2 tcord;
uniform mat4 perspec;
uniform mat4 translate;
void main() {
    gl_Position = perspec * translate * vec4(pos, 1.0);
    tcord = tpos;
}
