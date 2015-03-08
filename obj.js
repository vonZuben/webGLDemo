function objParser() {

    function element() {
        this.v = undefined;
        this.vt = undefined;
        this.vn = undefined;
    }

    this.parseVertices = function (file) {
        var vertexMatches = file.match(/^v( -?\d+(\.\d+)?){3}$/gm);

        if (!vertexMatches){
            console.log("no verticies in " + file.match(/^.*$/)[0]); // should print the first line of the obj file
            return;
        }

        this.fileVertices = vertexMatches.map(function (verts) {
            var vertex = verts.split(' ');
            vertex.shift(); // get rid og the v
            return vertex.map(function (v) {
                return Number(v);
            });
        });
    }

    this.parseNormals = function (file) {
        var normalMatches = file.match(/^vn( -?\d+(\.\d+)?){3}$/gm);

        if (!normalMatches){
            console.log("no normals in " + file.match(/^.*$/)[0]); // should print the first line of the obj file
            return;
        }

        this.fileNormals = normalMatches.map(function (normals) {
            var normal = normals.split(' ');
            normal.shift(); // get rid og the vn
            return normal.map(function (n) {
                return Number(n);
            });
        });
    }

    function parseFaces (file) {
        var faceMatches = file.match(/^f( (\/?\d*){1,3}){3}$/gm); // expect triangle faces

        if (!faceMatches){
            console.log("no faces in " + file.match(/^.*$/)[0]); // should print the first line of the obj file
            return;
        }

        this.faces = faceMatches.map(function (faceM) {
            var face = faceM.split(/[\s\/]+/);
            face.shift(); //get rid of the f

            face = face.map(function (f) {
                return Number(f) - 1;
            });

            var elem1 = new element;
            var elem2 = new element;
            var elem3 = new element;
            // check what face info is given ie. v1 v2 v3, v1/vt1 ..., v1/vt1/vn1... , v1//vn1
            if (face.length == 3) {                 // v1...
                elem1.v = face[0];
                elem2.v = face[1];
                elem3.v = face[2];
            }
            else if (face.length == 6) {            // v1/vt1 or v1//vn1
                elem1.v = face[0];
                elem2.v = face[2];
                elem3.v = face[4];
                if (/\/\//g.test(faceM) == true) {  // v1//vn1
                    elem1.vn = face[1];
                    elem2.vn = face[3];
                    elem3.vn = face[5];
                }
                else {                              // v1/vt
                    elem1.vt = face[1];
                    elem2.vt = face[3];
                    elem3.vt = face[5];
                }
            }
            else if (face.length == 9) {            // v1/vt/vn
                elem1.v = face[0];
                elem2.v = face[3];
                elem3.v = face[6];

                elem1.vt = face[1];
                elem2.vt = face[4];
                elem3.vt = face[7];

                elem1.vn = face[2];
                elem2.vn = face[5];
                elem3.vn = face[8];
            }

            return [ elem1, elem2, elem3 ];
        });
    }

    this.init = function (file) {
        parseFaces.call(this, file); // need faces to do anything
    }
}

// this expects everything to be triangulated
function glObj() {
    var parser = new objParser;
    var file = undefined;

    // al the object properties are defined as shown after initialization by the parser
    this.fileVertices = undefined; // array of vertices (3 element arrays) [ [ x, y, z] , ... ]
    this.fileNormals = undefined; // normals array like ^
    this.fileUVs = undefined; // texture coordinates [ [u, v], ... ]

    //indices to match verts, normal, and uvs
    // [ [ element1, element2, element3 ], ... ] | element = { v; vt; vn; };
    this.faces = undefined;

    this.init = function(infile) {
        file = infile;
        parser.init.call(this, file);
    }

    this.numVerts = function() {
        return this.faces.length * 3;
    }

    // generate glType arrays for buffers
    // generated based on the faces array so everything is aligned
    // eg. every array has the same number of elements and can be put
    // into one buffer for attributes

    this.vertexArray = function () { // Float32Array of vertices, must be multiple of 3
        if (!this.fileVertices) {
            parser.parseVertices.call(this, file);
        }

        var array = [];

        for (f in this.faces){
            for (v in this.faces[f]) {
                array = array.concat(this.fileVertices[this.faces[f][v].v]);
            }
        }

        return new Float32Array(array);
    }

    this.uvArray = function () { // Float32Array of uv coordinates, must be multiple of 2
        //if (!this.fileUVs) {
        //    parser.parse.call(this, file);
        //}
    }

    this.normalArray = function () { // Float32Array of normals as they are in the obj file, must be multiple of 3
        if (!this.fileNormals) {
            parser.parseNormals.call(this, file);
        }

        var array = [];

        for (f in this.faces){
            for (v in this.faces[f]) {
                array = array.concat(this.fileNormals[this.faces[f][v].vn]);
            }
        }

        return new Float32Array(array);
    }

    this.calcFlatNormals = function () { // generate flat normals for each vertex
    }

    this.calcSmoothNormals = function () { // generate smooth normals for each vertex
    }

    this.elements = function () {
        var elements = [];
        for (var i = 0; i < this.faces.length * 3; i += 1) {
            elements.push(i);
        }
        return new Uint16Array(elements);
    }
}
