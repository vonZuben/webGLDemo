
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
}
