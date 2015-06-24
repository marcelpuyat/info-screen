var request = require('request');
var state = "CA";
var city = "San Mateo";

// See http://www.wunderground.com/weather/api/d/docs?d=resources/phrase-glossary
var conditionsToDayIconMap = {
	"clear": "/assets/images/weather/clear-day.png",
	"sunny": "/assets/images/weather/clear-day.png",
	"rain": "/assets/images/weather/rain.png",
	"chancerain": "/assets/images/weather/chance-rain-day.png",
	"snow" : "/assets/images/weather/snow.png",
	"chanceflurries" : "/assets/images/weather/snow.png",
	"flurries" : "/assets/images/weather/snow.png",
	"sleet": "/assets/images/weather/snow.png",
	"chancesleet": "/assets/images/weather/snow.png",
	"chancesnow": "/assets/images/weather/snow.png",
	"wind" : "/assets/images/weather/wind.png",
	"fog": "/assets/images/weather/fog.png",
	"hazy": "/assets/images/weather/hazy.png",
	"cloudy": "/assets/images/weather/cloudy.png",
	"mostlycloudy": "/assets/images/weather/mostly-cloudy-day.png",
	"partlycloudy": "/assets/images/weather/partly-cloudy-day.png",
	"partlysunny": "/assets/images/weather/mostly-cloudy-day.png",
	"mostlysunny": "/assets/images/weather/mostly-sunny.png",
	"tstorms": "/assets/images/weather/thunderstorm.png",
	"chancetstorms": "/assets/images/weather/thunderstorm.png",
	"hail": "/assets/images/weather/snow.png",
	"tornado": "/assets/images/weather/wind.png",
	"unknown": "/assets/images/weather/na.png",
	"default": "/assets/images/weather/na.png"
};

var nightTimeVersionOfIcon = {
	"/assets/images/weather/clear-day.png": "/assets/images/weather/clear-night.png",
	"/assets/images/weather/partly-cloudy-day.png": "/assets/images/weather/partly-cloudy-night.png",
	"/assets/images/weather/mostly-cloudy-day.png": "/assets/images/weather/mostly-cloudy-night.png",
	"/assets/images/weather/chance-rain-day.png": "/assets/images/weather/chance-rain-night.png",
	"/assets/images/weather/chance-tstorms-day.png": "/assets/images/weather/chance-tstorms-night.png"
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
