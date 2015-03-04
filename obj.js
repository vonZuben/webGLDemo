function objParser() {

    function element() {
        this.v = undefined;
        this.vt = undefined;
        this.vn = undefined;
    }

   function parseVertices(file) {
        var vertexMatches = file.match(/^v( -?\d+(\.\d+)?){3}$/gm);

        this.verticies = vertexMatches.map(function (verts) {
            var vertex = verts.split(' ');
            vertex.shift(); // get rid og the v
            return vertex.map(function (v) {
                return Number(v);
            });
        });
    }

    function parseNormals(file) {
        var normalMatches = file.match(/^vn( -?\d+(\.\d+)?){3}$/gm);

        this.normals = normalMatches.map(function (normals) {
            var normal = normals.split(' ');
            normal.shift(); // get rid og the vn
            return normal.map(function (n) {
                return Number(n);
            });
        });
    }

    function parseFaces(file) {
        var faceMatches = file.match(/^f( (\/?\d*){1,3}){3}$/gm); // expect triangle faces

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

    this.parse = function (file) {
        parseVertices.call(this, file);
        parseNormals.call(this, file);
        parseFaces.call(this, file);
    }
}

// this expects everything to be triangulated
function glObj() {
    var parser = new objParser;

    this.vertices = []; // array of vertices (3 element arrays) [ [ x, y, z] , ... ]
    this.normals = []; // normals array like ^
    this.uvs = []; // texture coordinates [ [u, v], ... ]

    //indices to match verts, normal, and uvs
    // [ [ element1, element2, element3 ], ... ] | element = { v; vt; vn; };
    this.faces = [];

    this.parse = function(file) {
        parser.parse.call(this, file);
    }

    // building arrays with the face indicies in order. This means that the element array buffer
    // needs to be an incremental sequence eg 0, 1, 2, ... n

    this.vertexArray = function () { // return the vertices a tightly packed vertex array
        var vArray = [];
        for (f in this.faces){
            for (vi in this.faces[f]) {
                vArray = vArray.concat(this.verticies[this.faces[f][vi].v]);
            }
        }
        return new Float32Array(vArray);
    }

    this.vertnormArray = function () { // return tightly packed vertex with normals
        var vnArray = [];
        for (f in this.faces){
            for (vi in this.faces[f]) {
                vnArray = vnArray.concat(this.verticies[this.faces[f][vi].v]);
                vnArray = vnArray.concat(this.normals[this.faces[f][vi].vn]);
            }
        }
        return new Float32Array(vnArray);
    }

    this.numVerts = function() {
        return this.faces.length * 3;
    }

    this.vertexIndices = function () {
        var elements = [];
        for (var i = 0; i < this.faces.length * 3; i += 1) {
            elements.push(i);
        }
        return new Uint16Array(elements);
    }
}
