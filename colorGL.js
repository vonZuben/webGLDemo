function getfs(){
    return "\
        precision mediump float;\
            varying vec4 vColor;\
            void main(void) {\
                gl_FragColor = vColor;\
            }\
        ";
}

function getvs() {
    return "\
            attribute vec3 aVertexPosition;\
            attribute vec3 aVertexColor;\
            varying vec4 vColor;\
            void main(void) {\
                gl_Position = vec4(aVertexPosition, 1.0);\
                vColor = vec4(aVertexColor, 1.0);\
            }\
        ";
}


function colorGL(gl) {

    var vss = getvs();
    var fss = getfs();

    var shdrp = new glShaderProgram(gl, vss, fss);
    shdrp.initPrgm();
    shdrp.usePrgm();

    var vertPos = shdrp.enableVAA("aVertexPosition");
    var colorPos = shdrp.enableVAA("aVertexColor");

    var buf = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    //gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
         0.0,  1.0,  0.0,  1.0, 0.0, 0.0,
        -1.0, -1.0,  0.0,  0.0, 1.0, 0.0,
         1.0, -1.0,  0.0,  0.0, 0.0, 1.0
    ];
    buf.bufferData(new Float32Array(vertices));

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.vertexAttribPointer(vertPos, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(colorPos, 3, gl.FLOAT, false, 24, 12);

    var tick = function(){
    requestAnimationFrame(tick);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    tick();

}
