
function getVertSh() {
    return "\
        attribute vec3 pos;\
        uniform mat4 persp;\
        void main() {\
            gl_Position = persp * vec4(pos, 1.0);\
        }\
    ";
}

function getFragSh() {
    return "\
        void main() {\
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\
        }\
    ";
}

function perspecGL(gl) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // verts for a triangle
    vertData = [
         0.0,  1.0, -5.0,
        -1.0, -1.0, -5.0,
         1.0, -1.0, -5.0
            ];

    // shader program sources
    vs = getVertSh();
    fs = getFragSh();

    // make the shader program and be sure to usePrgm()
    simpleShdr = new glShaderProgram(gl, vs, fs);
    simpleShdr.initPrgm();
    simpleShdr.usePrgm();

    // make vertex buffer for shader program attribute needs
    // need to bind the buffer but will happen automatically on bufferData()
    vertBuf = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    vertBuf.bindBuffer();
    vertBuf.bufferData(new Float32Array(vertData));

    // enable shader program vertex attribute for the verts
    // and make it point into the buffer appropriately
    att = simpleShdr.enableVAA("pos")
    gl.vertexAttribPointer(att, 3, gl.FLOAT, false, 12, 0);

    // set the perspective uniform in the shader
    persp = mat4.create();
    mat4.perspective(45, 800 / 500 , 0.1, 100, persp);
    gl.uniformMatrix4fv(simpleShdr.getuLoc("persp"), false, persp);

    // clear and draw to the bound frameBuffer (screen by default)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
