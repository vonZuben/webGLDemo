function getVertSh() {
    return "\
        attribute vec3 pos;\
            \
        void main() {\
            gl_Position = vec4(pos, 1.0);\
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

function simpleGL(gl) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // verts for a triangle
    var vertData = [
         0.0,  1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0
            ];

    // shader program sources
    var vs = getVertSh();
    var fs = getFragSh();

    // make the shader program and be sure to usePrgm()
    var simpleShdr = new glShaderProgram(gl, vs, fs);
    simpleShdr.initPrgm();
    simpleShdr.usePrgm();

    // make vertex buffer for shader program attribute needs
    // need to bind the buffer but will happen automatically on bufferData()
    var vertBuf = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    vertBuf.bindBuffer();
    vertBuf.bufferData(new Float32Array(vertData));

    // enable shader program vertex attribute for the verts
    // and make it point into the buffer appropriately
    var att = simpleShdr.enableVAA("pos")
    gl.vertexAttribPointer(att, 3, gl.FLOAT, false, 12, 0);

    // clear and draw to the bound frameBuffer (screen by default)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
