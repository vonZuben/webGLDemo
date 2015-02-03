
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

    this.bufferData = function(data) {
        this.bindBuffer();
        this.gl.bufferData(this.target, data, this.usage);
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

    vertBuf = new glBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
}
