var request = require('request');
var state = "CA";
var city = "Stanford";

// See http://www.wunderground.com/weather/api/d/docs?d=resources/phrase-glossary
var conditionsToDayIconMap = {
	"clear": "/images/weather/clear-day.png",
	"sunny": "/images/weather/clear-day.png",
	"rain": "/images/weather/rain.png",
	"chancerain": "/images/weather/chance-rain-day.png",
	"snow" : "/images/weather/snow.png",
	"chanceflurries" : "/images/weather/snow.png",
	"flurries" : "/images/weather/snow.png",
	"sleet": "/images/weather/snow.png",
	"chancesleet": "/images/weather/snow.png",
	"chancesnow": "/images/weather/snow.png",
	"wind" : "/images/weather/wind.png",
	"fog": "/images/weather/fog.png",
	"hazy": "/images/weather/hazy.png",
	"cloudy": "/images/weather/cloudy.png",
	"mostlycloudy": "/images/weather/mostly-cloudy-day.png",
	"partlycloudy": "/images/weather/partly-cloudy-day.png",
	"partlysunny": "/images/weather/mostly-cloudy-day.png",
	"mostlysunny": "/images/weather/mostly-sunny.png",
	"tstorms": "/images/weather/thunderstorm.png",
	"chancetstorms": "/images/weather/thunderstorm.png",
	"hail": "/images/weather/snow.png",
	"tornado": "/images/weather/wind.png",
	"unknown": "/images/weather/na.png",
	"default": "/images/weather/na.png"
};

var nightTimeVersionOfIcon = {
	"/images/weather/clear-day.png": "/images/weather/clear-night.png",
	"/images/weather/partly-cloudy-day.png": "/images/weather/partly-cloudy-night.png",
	"/images/weather/mostly-cloudy-day.png": "/images/weather/mostly-cloudy-night.png",
	"/images/weather/chance-rain-day.png": "/images/weather/chance-rain-night.png",
	"/images/weather/chance-tstorms-day.png": "/images/weather/chance-tstorms-night.png"
};

function getIconForConditions(conditions) {
	var defaultIcon = conditionsToDayIconMap[conditions];
	var currHour = new Date().getHours();
	if (nightTimeVersionOfIcon[defaultIcon] && (currHour < 5 || currHour > 19)) {
		return nightTimeVersionOfIcon[defaultIcon];
	}
	return defaultIcon;
}

module.exports.getCurrentConditions = function(callbacks) {
	request({url: 'http://api.wunderground.com/api/95e93303e496f7c9/conditions/q/'+state+'/'+encodeURIComponent(city)+'.json'},
		function(err, response, body) {
			if (err || response.statusCode != 200) {
		        callbacks.error(err);
		        return;
		    }
		    try {
			    var bodyAsJson = JSON.parse(body);
			    callbacks.success({currTemp: bodyAsJson.current_observation.feelslike_f,
			    		conditionsIcon: getIconForConditions(bodyAsJson.current_observation.icon)});
			} catch (jsonErr) {
				callbacks.error(jsonErr);
			}
		}
	);
};

module.exports.getTodaysForecast = function(callbacks) {
	request({url: 'http://api.wunderground.com/api/95e93303e496f7c9/forecast/q/'+state+'/'+encodeURIComponent(city)+'/.json'},
        function(err, response, body) {
        	if (err || response.statusCode != 200) {
		        callbacks.error(err);
		        return;
		    }
		    try {
		    	var todaysForecastObj = JSON.parse(body).forecast.simpleforecast.forecastday[0];
		    	callbacks.success({
		    		windMph: todaysForecastObj.avewind.mph,
		    		probOfRain: todaysForecastObj.pop,
		    		high: todaysForecastObj.high.fahrenheit,
		    		low: todaysForecastObj.low.fahrenheit
		    	});
        	} catch(jsonErr) {
        		callbacks.error(jsonErr);
        	}
        }
	);
};