var port = 8082;
var exec = require('child_process').exec;
/*
===========================================================================
Turn off monitor at night
*/
var numMillisInDay = 1000 * 60 * 60 * 24;
var turnOffMonitor = function() {
    exec("tvservice -o"); 
};
var turnOnMonitor = function() {
    exec('tvservice --explicit="CEA 16 HDMI"'); 
    exec('fbset -depth 8');
    exec('fbset -g 1920 1080 1920 1080 16');
};
var turnOffMonitorAtNight = function() {
    var currDate = new Date();
    var numMillisTilStartOfNextDay = numMillisInDay - (
        currDate.getHours() * 1000 * 60 * 60 +
        currDate.getMinutes() * 1000 * 60 +
        currDate.getSeconds() * 1000 +
        currDate.getMilliseconds()); 
    setTimeout(function() {
        turnOffMonitor();
        setTimeout(function() {
            turnOnMonitor();
            turnOffMonitorAtNight();
        }, 1000 * 60 * 8); // 8AM
    }, numMillisTilStartOfNextDay);
};
turnOffMonitorAtNight();

/*
===========================================================================
Setup express server
===========================================================================
*/
var express  = require('express');
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
console.log("Listening on port: " + port);

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

/*
===========================================================================
Setup Chromium to restart (to prevent OOM crashes)
===========================================================================
*/
var fs = require('fs');

try {
    if (fs.lstatSync('/usr/bin/chromium').isFile()) {
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
        printNoChromiumWarning("/usr/bin/chrome is not a valid file");
    }
} catch(err) {
    printNoChromiumWarning(err);
}

function printNoChromiumWarning(error) {
    console.error(error);
    console.log("WARNING: Could not find Chromium at /usr/bin/chromium."+
        " Will be vulnerable to OOM crashes.");
    console.log("Visit localhost:"+port+" on your choice of browser");
}
