$(document).ready(function() {
	var state = "CA";
	var city = "Stanford";
	var minsPerForecastCall = 10;
	var minsPerCurrTempCall = 5;

	// See https://developer.forecast.io/docs/v2#forecast_call
	var conditionsToIconMap = {
		"clear-day": "/images/weather/clear-day.png",
		"clear-night": "/images/weather/clear-night.png",
		"rain": "/images/weather/rain.png",
		"snow" : "/images/weather/snow.png",
		"sleet": "/images/weather/snow.png",
		"wind" : "/images/weather/wind.png",
		"fog": "/images/weather/fog.png",
		"cloudy": "/images/weather/fog.png",
		"partly-cloudy-day": "/images/weather/partly-cloudy-day.png",
		"partly-cloudy-night": "/images/weather/partly-cloudy-night.png",
		"thunderstorm": "/images/weather/thunderstorm.png",
		"hail": "/images/weather/snow.png",
		"tornado": "/images/weather/wind.png",
		"default": "images/weather/na.png"
	};

	// Ajax calls only modify the cache. Then we use the cache to populate DOM when the
	// temperature page is added to the DOM
	var cachedData = {};

	var updateTemperatureColors = function() {
		$('.temp-number').each(function() {
			$(this).css('color', 'rgba(228, 228, 228, 0.87'); // First, reset
			var colorStringSplit = $(this).css('color').split(',');
			var red = parseInt(colorStringSplit[0].match(/\d+$/)[0]);
			var green = parseInt(colorStringSplit[1].match(/\d+$/)[0]);
			var blue = parseInt(colorStringSplit[2].match(/\d+$/)[0]);
			var alpha = parseFloat(colorStringSplit[3]);

			var temp = parseInt($(this).text());
			if (temp > 75) {
				var redEmphasis = (temp - 75) * 6;
				if (redEmphasis > 160) redEmphasis = 160;
				$(this).css('color', 'rgba('+red+','+(green-redEmphasis)+','+(blue-redEmphasis)+','+alpha+')');
			} else if (temp < 70) {
				var blueEmphasis = (70 - temp) * 4;
				if (blueEmphasis > 180) blueEmphasis = 180;
				$(this).css('color', 'rgba('+(red-blueEmphasis)+','+(green-blueEmphasis)+','+blue+','+alpha+')');
			}
		});
	};

	var updateForecastData = function(callback) {
		$.ajax({
	        url: 'http://api.wunderground.com/api/95e93303e496f7c9/forecast/q/'+state+'/'+encodeURIComponent(city)+'/.json',
	        dataType: 'jsonp',
	        success: function(responseData) {
	            var forecastObject = responseData.forecast.simpleforecast.forecastday[0];
	            cachedData.windMph = forecastObject.avewind.mph;
	            cachedData.high = forecastObject.high.fahrenheit;
	            cachedData.low = forecastObject.low.fahrenheit;
	            cachedData.icon = forecastObject.icon_url;
	            cachedData.probOfRain = forecastObject.pop;
	            callback();
	        }
	    });
	};

	var updateCurrTemp = function(callback) {
		var wundergroundDone = false;
		var forecastIoDone = false;
		$.ajax({
	    	url: 'http://api.wunderground.com/api/95e93303e496f7c9/conditions/q/'+state+'/'+encodeURIComponent(city)+'.json',
	    	dataType: 'jsonp',
	        success: function(responseData) {
	        	cachedData.currTemp = responseData.current_observation.feelslike_f;
	        	wundergroundDone = true;
	            if (callback && wundergroundDone && forecastIoDone) {
	            	callback();
	            }
	        }
	    });

		$.ajax({
	    	// Coordinates here are hardcoded...
	    	url: 'https://api.forecast.io/forecast/35c8a075c7e126ef14a4632a706ebbaf/37.8267,-122.423',
	    	dataType: 'jsonp',
	    	success: function(responseData) {
	    		// See https://developer.forecast.io/docs/v2#forecast_call
	    		cachedData.conditions = responseData.currently.icon;
	    		forecastIoDone = true;
	    		if (callback && wundergroundDone && forecastIoDone) {
	            	callback();
	            }
	    	}
	    });
	};

	var updateDisplay = function() {
		$("#high-text").text(cachedData.high + "\xB0");
        $("#low-text").text(cachedData.low + "\xB0");
        $("#wind-text").text(cachedData.windMph + " ");
        var mphText = $('<span />').attr('class', 'small-weather-label').html('mph');
        $("#wind-text").append(mphText);
        $("#chance-of-rain-text").text(cachedData.probOfRain + "% ");
        var rainText = $('<span />').attr('class', 'small-weather-label').html('rain');
        $("#chance-of-rain-text").append(rainText);
        var imgSrc = conditionsToIconMap[cachedData.conditions] ? conditionsToIconMap[cachedData.conditions] : 
        	conditionsToIconMap.default;
        $("#conditions-icon").attr("src", imgSrc);
        console.log(conditionsToIconMap[cachedData.conditions]);
        $("#current-temp-text").text(Math.floor(cachedData.currTemp) + "\xB0");
        updateTemperatureColors();
	}

	// Update elem values when weather window is inserted
	$(document).on('DOMNodeInserted', function(e) {
	    if (e.target.id == 'weather') {
	    	updateDisplay();
	    }
	});

	// First update
	var forecastUpdateDone = false;
	var currTempUpdateDone = false;
	updateForecastData(function() {
		forecastUpdateDone = true;
		if (forecastUpdateDone && currTempUpdateDone) {
			updateDisplay();
		}
	});
	updateCurrTemp(function() {
		currTempUpdateDone = true;
		if (forecastUpdateDone && currTempUpdateDone) {
			updateDisplay();
		}
	});

	setInterval(updateForecastData, 1000 * 60 * minsPerForecastCall);
	setInterval(updateCurrTemp, 1000 * 60 * minsPerCurrTempCall);

});