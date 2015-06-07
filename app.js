var util = require('util');
var request = require('request');
var fs = require('fs');

var express  = require('express');
var port = 8082;

/* Services */
var jsonpService = require('./services/jsonpService');
var RottenTomatoes = require('./services/RottenTomatoes');
var PuppyGiphy = require('./services/PuppyGiphy');
var WallpaperBackgrounds = require('./services/WallpaperBackgrounds');
var Weather = require('./services/Weather');

/*
  ===========================================================================
            Setup Chromium to restart (to prevent OOM crashes)
  ===========================================================================
*/
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
app.get('/weather/conditions.jsonp', function(req, res) {
  jsonpService.provide(Weather.getCurrentConditions, "currentConditions", res);
});

app.get('/weather/forecast.jsonp', function(req, res) {
  jsonpService.provide(Weather.getTodaysForecast, "todaysForecast", res);
});

app.get('/background.jsonp', function(req, res) {
  jsonpService.provide(WallpaperBackgrounds.getRandomBackgroundUrl, "imageUrl", res);
});

app.get('/puppy.jsonp', function(req, res) {
  jsonpService.provide(PuppyGiphy.getRandomGifUrl, "imageUrl", res);
});

app.get('/movies.json', function(req, res) {
  jsonpService.provide(RottenTomatoes.getMovieData, "movies", res);
});