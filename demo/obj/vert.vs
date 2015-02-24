attribute vec3 pos;
uniform mat4 persp;
uniform mat4 trans;
uniform mat4 rot;
void main () {
    gl_Position = persp * trans * rot * vec4(pos, 1.0);
}
