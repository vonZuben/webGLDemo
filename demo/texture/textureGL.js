
function textureGL(canvas) {

    var gl = initGL(canvas);

    // resource loader
    var loader = new glResourceMgr;

    // shader vars
    var shdrPrgm;
    var fragSrc = new Object;
    var vertSrc = new Object;
    loader.loadFile("frag.fs", fragSrc);
    loader.loadFile("vert.vs", vertSrc);

    //texture vars
    var img = new Image;
    var tex = new glTexture(gl, gl.TEXTURE_2D, gl.LINEAR, gl.LINEAR);
    loader.loadImage("ryukoFace.png", img);

    //buffer vars
    var buf = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    var bufdata = [
        // pic 1
        -1.0,  1.0,  0.0,   0.0, 0.0,
        -1.0, -1.0,  0.0,   0.0, 0.54,
         2.56,  1.0,  0.0,  0.97, 0.0,
         2.56, -1.0,  0.0,  0.97, 0.54,
        // pic 2
        -1.0,  1.0,  0.0,   0.0, 0.56,
        -1.0, -1.0,  0.0,   0.0, 1.0,
        2.52,  1.0,  0.0,   0.79, 0.56,
        2.52, -1.0,  0.0,   0.79, 1.0
             ];
    buf.bufferData(new Float32Array(bufdata));

    // uniforms
    var perspec = mat4.create();
    mat4.perspective(45, gl.width / gl.height, 0.1, 100, perspec);

    var translate = mat4.create();
    mat4.identity(translate);
    mat4.translate(translate, [ -1.0, 0.0, -5.0 ]);

    var tUniLoc;

    var r = 0.0;
    function draw() {
        requestAnimationFrame(draw);
        gl.clear(gl.COLOR_BUFFER_BIT);

        mat4.identity(translate);
        mat4.translate(translate, [ -1.5, 1.0, -5.0 ]);
        mat4.rotateY(translate, r);
        gl.uniformMatrix4fv(tUniLoc, false, translate);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        mat4.identity(translate);
        mat4.translate(translate, [ -0.5, -1.0, -5.0 ]);
        mat4.rotateY(translate, 3.14 + r);
        gl.uniformMatrix4fv(tUniLoc, false, translate);
        gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);

        r += 0.01
    }
    // using one resource manager in this simple example,
    // could use more than one to be more efficient in more complex example
    loader.onReady = function() {
        // shdr ready
        shdrPrgm = new glShaderProgram(gl, vertSrc.text, fragSrc.text);
        shdrPrgm.initPrgm();
        shdrPrgm.usePrgm();

        buf.bindBuffer();
        gl.vertexAttribPointer(shdrPrgm.enableVAA("pos"), 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(shdrPrgm.enableVAA("tpos"), 2, gl.FLOAT, false, 20, 12);
        gl.uniformMatrix4fv(shdrPrgm.getuLoc("perspec"), false, perspec);
        tUniLoc = shdrPrgm.getuLoc("translate");

        // texture ready
        gl.activeTexture(gl.TEXTURE0);
        tex.texImage2D(0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        tex.setParams();
        gl.uniform1i(shdrPrgm.getuLoc("samp"), 0);

        //gl.enable(gl.CULL_FACE);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        draw();
    }

    loader.run();

}
