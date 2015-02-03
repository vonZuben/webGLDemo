
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

    //data is the data to put on the gpu, needs to be ArrayBuffer eg Float32Array
    this.bufferData = function(data) {
        this.bindBuffer();
        this.gl.bufferData(this.target, data, this.usage);
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
        this.gl.usePrgmogram(this.prgm);
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
    vertBuf = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);

    vs = document.getElementById("vertSrc").innerHTML;
    fs = document.getElementById("fragSrc").innerHTML;
    shdr = new glShaderProgram(gl, vs, fs);
}
