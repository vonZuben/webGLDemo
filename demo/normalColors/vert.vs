attribute vec3 pos;
attribute vec3 normal;
uniform mat4 persp;
uniform mat4 trans;
uniform mat4 rot;
varying vec4 color;
void main () {
    vec4 vp = trans * rot * vec4(pos, 1.0);
    gl_Position = persp * vp;
    //color = vec4((vp.z + 7.2) * 0.3, (vp.z + 7.2) * 0.3, (vp.z + 7.2) * 0.4, 1.0);
    color = rot * vec4(normalize(normal), 1.0);
}
