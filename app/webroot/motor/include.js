/**
 * Created by Mustapha on 10/21/2014.
 */

var req = {};


function onScriptLoadComplete(callbck)
{
    callbck();
}

function LoadJsFile(fileName, callBck)
{
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript' ;
    scriptTag.async = false;
    scriptTag.src = fileName;
    scriptTag.onreadystatechange = function(){
        debugger;
        if(this.readyState == 'complete') onScriptLoadComplete(callBck);
    }
    scriptTag.load = onScriptLoadComplete(callBck);

    var bodyTag = document.body;
    bodyTag.appendChild(scriptTag);
}

function ImportJsFiles(filesArr)
{
    if(Array.isArray(filesArr))
    {
        //debugger;
        var currentFile = undefined;
        if(  (currentFile = filesArr.pop()) != undefined )
        {
            LoadJsFile(currentFile, function(){
                if(filesArr.length > 0)
                    ImportJsFiles(filesArr);
            });
        }
    }
}


function ImportJsFilesWrapper()
{
    ImportJsFiles([
        "libs/jquery.min.js",
        "libs/modernizr.min.js",
        "libs/bootstrap/js/bootstrap.min.js",
        "libs/angular.min.js",
        //"libs/angular-route.min.js",
        "libs/angular-animate.min.js",
        "libs/angular-fontawesome.min.js", //may not be needed
        "libs/ui-bootstrap.min.js",
        "libs/d3.min.js",
        "libs/lodash.min.js",
        "libs/d3-tip.min.js",
        "libs/d3chartsizer.min.js",
        "motor/leaflet.js",
        "libs/d3map.js",
        "libs/prefixfree.min.js",
        "libs/jaydata.js",
        "libs/jaydata-angular.min.js",
        'libs/crossfilter.min.js',
        'libs/dc.min.js',
        'libs/angular-dc.js',
        "motor/colorBrewer.js",
        "motor/leaflet-heat.js",
        "motor/services.js",
        "motor/controllers.js",
        "motor/directives.js",
        "motor/filters.js",
        "motor/app.js"
    ]);
}


function ImportHTML(fileName, blReplace, callback)
{
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (req != undefined) {
        req.onreadystatechange = function() {downloadComplete(fileName, callback)};
        req.open("GET", fileName, true);
        req.send("");
    }
}

function downloadComplete(fileName, callback) {
    if (req.readyState == 4) { // only if req is "loaded"
        if (req.status == 200) { // only if "OK"
            document.getElementById("header").innerHTML = req.responseText;

            if(undefined != callback)
            {
                callback();
            }
        } else {
        }
    }
}


ImportHTML("include.html", true, function(){ImportJsFilesWrapper();});