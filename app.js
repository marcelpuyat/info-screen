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
  console.log("WARNING: Could not find Chromium at /usr/bin/chromium."
    +" Will be vulnerable to OOM crashes.");
}

/*
  ===========================================================================
            Setup express server
  ===========================================================================
*/
var express  = require('express');
var port = 8082;
var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' , cookie: {maxAge: 100000}}));
  
  app.use(express.static(__dirname, 'public'));

  app.use("/styles",  express.static(__dirname + '/public'));
  app.use("/fonts",  express.static(__dirname + '/public/fonts'));
  app.use("/scripts", express.static(__dirname + '/public'));
  app.use("/vendor", express.static(__dirname + '/public/vendor'));
  app.use("/images",  express.static(__dirname + '/public/images'));
});

app.listen(port);

app.get('/', function(req, res){
  res.sendfile("screen.html");
});

/*
  ===========================================================================
            JSONP endpoints for front-end to call
  ===========================================================================
*/

var jsonpService = require('./services/jsonpService');
var RottenTomatoes = require('./services/RottenTomatoes');
var PuppyGiphy = require('./services/PuppyGiphy');
var WallpaperBackgrounds = require('./services/WallpaperBackgrounds');
var Weather = require('./services/Weather');

addJsonpRoute('/weather/conditions.jsonp', Weather.getCurrentConditions, "currentConditions");
addJsonpRoute('/weather/forecast.jsonp', Weather.getTodaysForecast, "todaysForecast");
addJsonpRoute('/background.jsonp', WallpaperBackgrounds.getRandomBackgroundUrl, "imageUrl");
addJsonpRoute('/puppy.jsonp', PuppyGiphy.getRandomGifUrl, "imageUrl");
addJsonpRoute('/movies.jsonp', RottenTomatoes.getMovieData, "movies");

function addJsonpRoute(route, serviceFn, responseObjName) {
  app.get(route, function(req, res) {
    jsonpService.provide(serviceFn, responseObjName, res);
  });
}