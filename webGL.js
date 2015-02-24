
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
    this.texData2D = function (level, infmt, width, height, brdr, fmt, type, data) {
        this.bindTexture();
        this.gl.texImage2D(this.target, level, infmt, width, height, brdr, fmt, type, data);
    }

    this.texImage2D = function (level, infmt, fmt, type, image) {
        this.bindTexture();
        this.gl.texImage2D(this.target, level, infmt, fmt, type, image);
    }

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
function glShaderProgram(gl){
    this.prgm = gl.createProgram();
    this.gl = gl;
    this.vertSrc = undefined;
    this.fragSrc = undefined;
    this.vertShdr = gl.createShader(gl.VERTEX_SHADER);
    this.fragShdr = gl.createShader(gl.FRAGMENT_SHADER);

    this.initPrgm = function (vertSrc, fragSrc) {
        this.vertSrc = vertSrc;
        this.fragSrc = fragSrc;

        var good = true;

        this.gl.shaderSource(this.vertShdr, this.vertSrc);
        this.gl.shaderSource(this.fragShdr, this.fragSrc);

        this.gl.compileShader(this.vertShdr);
        this.gl.compileShader(this.fragShdr);

        if (!this.gl.getShaderParameter(this.vertShdr, gl.COMPILE_STATUS)) {
            console.log(this.gl.getShaderInfoLog(this.vertShdr));
            good = false;
        }
        if (!this.gl.getShaderParameter(this.fragShdr, gl.COMPILE_STATUS)) {
            console.log(this.gl.getShaderInfoLog(this.fragShdr));
            good = false;
        }

        this.gl.attachShader(this.prgm, this.vertShdr);
        this.gl.attachShader(this.prgm, this.fragShdr);
        this.gl.linkProgram(this.prgm);

        if (!this.gl.getProgramParameter(this.prgm, gl.LINK_STATUS)) {
            console.log(this.gl.getProgramInfoLog(this.prgm))
            good = false;
        }
        return good;
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
        this.gl.enableVertexAttribArray(att);
        return att;
    }

    //uniform is the string name of a uniform in the program
    this.getuLoc = function (uniform) {
        return this.gl.getUniformLocation(this.prgm, uniform);
    }
}

function glObj() {
    this.vertArrayList = [];
    this.elemArrayList = [];

    this.parseOBJ = function (file) {
        var vertexMatches = file.match(/^v( -?\d+(\.\d+)?){3}$/gm);

        var verticies = vertexMatches.map(function (verts) {
            var vertex = verts.split(' ');
            vertex.shift(); // get rid og the v
            return vertex.map(function (v) {
                return Number(v);
            });
        });

        for (v in verticies) {
            this.vertArrayList = this.vertArrayList.concat(verticies[v]);
        }

        var elementMatches = file.match(/^f( \d+)+$/gm);

        var elements = elementMatches.map(function (elems) {
            var element = elems.split(' ');
            element.shift();
            return element.map(function (e) {
                return Number(e) - 1;
            });
        });

        for (e in elements) {
            this.elemArrayList = this.elemArrayList.concat(elements[e]);
        }
    }
}

function glResourceMgr() {
    var waiting = 0;
    var ready = 0;
    var runreq = false;
    this.onReady = undefined;

    function addReady(){
        ready += 1;
        if (runreq) {
            this.run();
        }
    }

    this.run = function () {
        if (ready == waiting) {
            this.onReady();
        }
        else {
            runreq = true;
        }
    };

    this.loadImage = function (img, into) {
        var caller = this;
        waiting += 1;
        into.onload = function () {
            addReady.call(caller);
        }
        into.src = img;
    };

    // file is the URL of the file to load, and into is an Object to store the loaded file into
    this.loadFile = function (file, into) {
        var caller = this;
        var req = new XMLHttpRequest;
        waiting += 1;
        req.onload = function () {
            //if (req.readyState == 4) {
                into.text = req.responseText;
                addReady.call(caller);
            //}
        };
        req.open("GET", file, true);
        req.send();
    };
}

// set up the WebGL context
function initGL(canvas) {
    var canv = document.getElementById(canvas);

    var gl = canv.getContext("experimental-webgl");

    if (gl == null){
        alert("no webgl suport");
        return null;
    }

    gl.width = canv.width;
    gl.height = canv.height;
    return gl;
}
