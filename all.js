const demoList = "demoList.txt";
function loadDemoList(func) {
    var req = new XMLHttpRequest;
    req.open("GET", demoList, true);
    req.onload = func;
    req.send();
    return req;
}

function parseList(func) {
    var lst = [];
    var req = loadDemoList(
            function () {
                var reg = /^.*\.html/gm;
                var found;
                while (found = reg.exec(req.responseText)) {
                    lst.push(found[0]);
                }
                func(lst);
            });
    return lst;
}

function loadDemosIframes(id) {
    var bdy = document.getElementById(id);
    var list = document.createElement('ul');
    var lst = parseList(
            function (lst) {
                for (page in lst) {
                    var ifr = document.createElement('iframe');
                    var listItem = document.createElement('li');
                    ifr.src = lst[page];
                    ifr.style.border = "none";
                    ifr.style.width = "1000px";
                    ifr.style.height = "600px";
                    listItem.appendChild(ifr);
                    list.appendChild(listItem);
                }
                bdy.appendChild(list);
            });
}

function loadDemoLinks(id) {
    var bdy = document.getElementById(id);

    var list = document.createElement('ul');

    var lst = parseList(
            function (lst) {
                for (page in lst) {
                    var atag = document.createElement('a');
                    var listItem = document.createElement('li');
                    atag.href = lst[page];
                    atag.innerHTML = lst[page];
                    listItem.appendChild(atag);
                    list.appendChild(listItem);
                }
                bdy.appendChild(list);
            });
}
