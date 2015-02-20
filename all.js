function loadAllDemos() {
    var req = new XMLHttpRequest;

    var loadIframes = function () {
        var lst = [];
        var reg = /^.*\.html/gm;
        var found;
        while (found = reg.exec(req.responseText)) {
            lst.push(found[0]);
        }

        var bdy = document.getElementById("main");
        for (page in lst) {
            var ifr = document.createElement('iframe');
            ifr.src = lst[page];
            ifr.style.border = "none";
            ifr.style.width = "1000px";
            ifr.style.height = "600px";
            bdy.appendChild(ifr);
        }
    };

    req.open("GET", "demoList.txt", true);
    req.onload = loadIframes;
    req.send();

}
