var path = require('path');
/*
===========================================================================
Setup Chromium to restart (to prevent OOM crashes)
===========================================================================
*/
var fs = require('fs');

try {
    if (fs.lstatSync('/usr/bin/chromium').isFile()) {
        var exec = require('child_process').exec;
        console.log("Starting Chromium");
        exec('chromium --kiosk localhost:'+port);
        setInterval(function() {
            console.log("Killing Chromium");
            exec('killall chromium', function() {
                console.log("Restarting Chromium");
                exec('chromium --kiosk localhost:'+port);
            });
        }, 1000 * 60 * 60);
    } else {
        printNoChromiumWarning();
    }
} catch(err) {
    printNoChromiumWarning();
    console.error("\tError: " + err);
}
function printNoChromiumWarning() {
    console.log("WARNING: Could not find Chromium at /usr/bin/chromium."+
        " Will be vulnerable to OOM crashes.");
}

/*
===========================================================================
Setup express server
===========================================================================
*/
var express  = require('express');
var port = 8082;
var app = express();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'marcelpi'}));

// Dont let files outside public be accessible
app.use(express.static(__dirname, 'public'));

// Use ejs templates as views
app.set('views', require('path').join(__dirname, 'views'));
app.set('view engine', 'ejs');  

app.listen(port);

app.get('/', function(req, res){
    res.render("layouts/main");
});

/*
===========================================================================
JSONP endpoints for front-end to call
===========================================================================
*/

function requireService(serviceName) {
    return require('./javascripts/backend_services/'+serviceName);
}
var RottenTomatoes = requireService('RottenTomatoes');
var PuppyGiphy = requireService('PuppyGiphy');
var WallpaperBackgrounds = requireService('WallpaperBackgrounds');
var Weather = requireService('Weather');

addJsonpRoute('/weather/conditions.jsonp', Weather.getCurrentConditions, "currentConditions");
addJsonpRoute('/weather/forecast.jsonp', Weather.getTodaysForecast, "todaysForecast");
addJsonpRoute('/background.jsonp', WallpaperBackgrounds.getRandomBackgroundUrl, "imageUrl");
addJsonpRoute('/puppy.jsonp', PuppyGiphy.getRandomGifUrl, "imageUrl");
addJsonpRoute('/movies.jsonp', RottenTomatoes.getMovieData, "movies");

function addJsonpRoute(route, serviceFn, resultObjName) {
    app.get(route, function(req, res) {
        serviceFn({
            success: function(result) {
                var resultObj = {};
                resultObj[resultObjName] = result;
                res.jsonp(resultObj);
            },
            error: function(err) {
                res.jsonp({error: err});
            }
        });
    });
}