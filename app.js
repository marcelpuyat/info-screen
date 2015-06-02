var util = require('util');
var express  = require('express');
var gcal = require('./GoogleCalendar');
var request = require('request');

/*
  ===========================================================================
            Setup express + passportjs server for authentication
  ===========================================================================
*/

var app = express();
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' , cookie: {maxAge: 100000}}));
  app.use(passport.initialize());
  
  app.use(express.static(__dirname, 'public'));

  app.use("/styles",  express.static(__dirname + '/public'));
  app.use("/fonts",  express.static(__dirname + '/public/fonts'));
  app.use("/scripts", express.static(__dirname + '/public'));
  app.use("/vendor", express.static(__dirname + '/public/vendor'));
  app.use("/images",  express.static(__dirname + '/public/images'));
});

app.listen(8082);

passport.use(new GoogleStrategy({
    clientID: "823634938121-mnnaj9evapu5p3pim1985ekekjec4l72.apps.googleusercontent.com",
    clientSecret: "wDXSXhht05FmOPfwaAhDw8_F",
    callbackURL: "http://127.0.0.1:8082/auth/callback",
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'] 
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    return done(null, profile);
  }
));

// Needed because jsonp doesn't use same session
var accessToken;

app.get('/auth',
  passport.authenticate('google', { session: false }));

app.get('/auth/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  function(req, res) { 
    req.session.access_token = req.user.accessToken;
    accessToken = req.user.accessToken;
    res.redirect('/');
  });


/*
  ===========================================================================
                               Google Calendar
  ===========================================================================
*/

app.all('/', function(req, res){
  // if(!req.session.access_token) {
  //   return res.redirect('/auth');
  // }

  res.sendfile("screen.html");
});

app.get('/calendar.json', function(req, res) {

  var google_calendar = new gcal.GoogleCalendar(accessToken);

  google_calendar.calendarList.list(function(err, responseData) {
    if (err) {
      res.jsonp({error: "expired"});
      return;
    } else if (!req.query.minDateInSeconds || !req.query.maxDateInSeconds) {
      res.jsonp({error: "min/maxDateInSeconds are a required parameters"});
      return;
    }

    var minDate = new Date(parseInt(req.query.minDateInSeconds));
    var maxDate = new Date(parseInt(req.query.maxDateInSeconds));

    google_calendar.events.list(responseData.items[0].id, 
      {timeMin: minDate.toISOString(), timeMax: maxDate.toISOString(), orderBy: "startTime", singleEvents: true}, 
      function(err, eventList) {
        if (err) {res.jsonp({error: err}); return; }
        res.jsonp({events: eventList});
    });
  });
});

var onlyGetTopN = 20;
app.get('/background.json', function(req, res) {
  var randomPage = Math.floor(Math.random() * onlyGetTopN) + 1;
  request({url: 'http://wall.alphacoders.com/api1.0/get.php?auth=2d267ee4d7cb55dbcb060a9b1df09107&category_id=10&page='+randomPage},
    function(err, response, body) {
      if (err || response.statusCode != 200) {
        res.jsonp({error: err});
        return;
      }

      var wallpapers = JSON.parse(body).wallpapers;
      var randomIndex = Math.floor(Math.random() * wallpapers.length);
      res.jsonp({imageUrl: wallpapers[randomIndex].url});
    }
  );
});