
// takes gl context, draw target, and buffer usage parameter
function glBuffer(gl, target, usage) {
    this.buffPtr = gl.createBuffer();
    this.gl = gl;
    this.target = target;
    this.usage = usage;

    this.setTarget = function(target) { this.target = target; }
    this.setUsage = function(usage) { this.usage = usage; }

    this.bindBuffer = function() {
        gl.bindBuffer(this.target, this.buffPtr);
    }

    //data is the data to put on the gpu, needs to be ArrayBuffer eg Float32Array or the size to allocate
    this.bufferData = function(data) {
        this.bindBuffer();
        this.gl.bufferData(this.target, data, this.usage);
    }

    //data is the data to put on the gpu, needs to be ArrayBuffer eg Float32Array (offset is in bytes)
    this.bufferSubData = function(offset, data) {
        this.bindBuffer();
        this.gl.bufferSubData(this.target, offset, data);
    }

}

function glTexture(gl, target, minf, magf) {
    this.tex = gl.createTexture();
    this.gl = gl;
    this.target = target;
    this.minf = minf;
    this.magf = magf;

    this.bindTexture = function () {
        this.gl.bindTexture(this.target, this.tex);
    }

    // the documentation is in webGL quick reference card on Khronos website
    // this is just a object oriented implementation
    this.texImage2D = function (level, infmt, width, height, brdr, fmt, type, data) {
        this.bindTexture();
        this.gl.texImage2D(this.target, level, infmt, width, height, brdr, fmt, type, data);
    }

    //this.texImage2D = function (level, infmt, fmt, type, data) {
    //    this.bindTexture();
    //    this.gl.texImage2D(this.target, level, infmt, fmt, type, data);
    //}

    this.setParams = function () {
        this.bindTexture();
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minf);
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magf);
    }

    this.texParameteri = function (parm, val) {
        this.bindTexture();
        this.gl.texParameteri(this.target, parm, val);
    }
}

//takes gl context and a list of shader source strings to be compiled onto the program
function glShaderProgram(gl, vertSrc, fragSrc){
    this.prgm = gl.createProgram();
    this.gl = gl;
    this.vertSrc = vertSrc;
    this.fragSrc = fragSrc;
    this.vertShdr = gl.createShader(gl.VERTEX_SHADER);
    this.fragShdr = gl.createShader(gl.FRAGMENT_SHADER);

    this.initPrgm = function () {
        this.gl.shaderSource(this.vertShdr, this.vertSrc);
        this.gl.shaderSource(this.fragShdr, this.fragSrc);
        this.gl.compileShader(this.vertShdr);
        this.gl.compileShader(this.fragShdr);
        this.gl.attachShader(this.prgm, this.vertShdr);
        this.gl.attachShader(this.prgm, this.fragShdr);
        this.gl.linkProgram(this.prgm);
    }

    this.usePrgm = function () {
        this.gl.useProgram(this.prgm);
    }

    //attrib is string name of vertexAttribPointer in the program
    this.getAttLoc = function (attrib) {
        return this.gl.getAttribLocation(this.prgm, attrib);
    }

    //attrib is string name of vertexAttribPointer in the program
    this.enableVAA = function (attrib) {
        var att = this.getAttLoc(attrib);
        gl.enableVertexAttribArray(this.prgm, att);
        return att;
    }

    //uniform is the string name of a uniform in the program
    this.getuLoc = function (uniform) {
        return gl.getUniformLocation(this.prgm, uniform);
    }
}

function initBuffer(gl) {

}

// set up the WebGL context
function initGL(canvas) {
    var gl = canvas.getContext("experimental-webgl");

    if (gl == null){
        alert("no webgl suport");
        return null;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    return gl;
}

function main(){
    var canv = document.getElementById("canv");

    gl = initGL(canv);

    //testing

    //simpleGL(gl);
    //perspecGL(gl);
    animSimpleGL(gl);
}
