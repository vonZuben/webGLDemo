function sLightGL(canvas) {

    var gl = initGL(canvas);

    var loader = new glResourceMgr;

    var obj = new glObj;
    var objFile = new Object;
    loader.loadFile("../resources/webGLdemo.obj", objFile);

    var shdr = new glShaderProgram(gl);
    var vsrc = new Object;
    var fsrc = new Object;
    loader.loadFile("vert.vs", vsrc);
    loader.loadFile("frag.fs", fsrc);

    var bufVert = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    var bufElem = new glBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);

    var draw = function () {
        requestAnimationFrame(draw);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.rotateY(rot, 0.01);
        mat4.rotateX(rot, 0.005);
        gl.uniformMatrix4fv(rotLoc, false, rot);
        gl.drawElements(gl.TRIANGLES, obj.numVerts(), gl.UNSIGNED_SHORT, 0);
    }

    var persp = mat4.create();
    mat4.perspective(45, gl.width / gl.height , 0.1, 100, persp);

    var trans = mat4.create();
    mat4.identity(trans);
    mat4.translate(trans, [ 0.0, 0.0, -6.0 ]);

    var rot = mat4.create();
    mat4.identity(rot);
    var rotLoc;

    loader.onReady = function () {
        // set up the shader program
        shdr.initPrgm(vsrc.text, fsrc.text);
        shdr.usePrgm();

        // load the buffers with the .obj file
        obj.init(objFile.text);

        // only have one buffer for each target so dont have to wory about which one is bound
        // bufferData call from glBuffer does it for me
        var verts = obj.vertexArray();
        var elements = obj.elements();
        bufVert.bufferData(verts);
        bufElem.bufferData(elements);

        gl.vertexAttribPointer(shdr.enableVAA("pos"), 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(shdr.getuLoc("persp"), false, persp);
        gl.uniformMatrix4fv(shdr.getuLoc("trans"), false, trans);
        rotLoc = shdr.getuLoc("rot");

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        bufVert.bindBuffer();
        draw();
    };

    loader.run();

}
