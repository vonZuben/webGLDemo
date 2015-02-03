
// set up the WebGL context
function initGL(canvas) {
    var gl = canvas.getContext("experimental-webgl");
    return gl;
}

function main(){
    var canv = document.getElementById("canv");

    gl = initGL(canv);
}
