
function getVertSh() {
    return "\
        attribute vec3 pos;\
        uniform mat4 persp;\
        uniform mat4 rot;\
        uniform mat4 mv;\
        void main() {\
            gl_Position = persp * mv * rot * vec4(pos, 1.0);\
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

function animSimpleGL(canvas) {

    var gl = initGL(canvas);

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
    var simpleShdr = new glShaderProgram(gl);
    simpleShdr.initPrgm(vs, fs);
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

    // set the perspective uniform in the shader
    var persp = mat4.create();
    mat4.perspective(45, gl.width / gl.height , 0.1, 100, persp);
    gl.uniformMatrix4fv(simpleShdr.getuLoc("persp"), false, persp);

    // set up matricies for animation, want to rotate on Y axis so rotate then translate (see shader)
    // so that it rotates around the center of the triangle
    var mv = mat4.create();
    mat4.identity(mv);
    mat4.translate(mv, [ 0.0, 0.0, -5.0 ]);
    gl.uniformMatrix4fv(simpleShdr.getuLoc("mv"), false, mv);

    var rot = mat4.create();
    mat4.identity(rot);
    var rotP = simpleShdr.getuLoc("rot");
    gl.uniformMatrix4fv(rotP, false, mv);

    // clear and draw to the bound frameBuffer (screen by default)
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.TRIANGLES, 0, 3);

    var update = function () {
        requestAnimationFrame(update);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        mat4.rotateY(rot, 0.01);
        gl.uniformMatrix4fv(rotP, false, rot);
                };

    update();
}
