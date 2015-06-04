$(document).ready(function() {
	var state = "CA";
	var city = "Stanford";
	var minsPerForecastCall = 10;
	var minsPerCurrTempCall = 5;

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

	// Ajax calls only modify the cache. Then we use the cache to populate DOM when the
	// temperature page is added to the DOM
	var cachedData = {};

	var updateTemperatureColors = function() {
		$('.temp-number').each(function() {
			var red = 228;
			var green = 228;
			var blue = 228;
			var alpha = 0.87;

			var temp = parseInt($(this).text());
			if (temp > 75) {
				var redEmphasis = ((temp - 75) * 6) + 10;
				if (redEmphasis > 160) redEmphasis = 160;
				$(this).css('color', 'rgba('+red+','+(green-redEmphasis)+','+(blue-redEmphasis)+','+alpha+')');
			} else if (temp < 70) {
				var blueEmphasis = (70 - temp) * 4;
				if (blueEmphasis > 180) blueEmphasis = 180;
				$(this).css('color', 'rgba('+(red-blueEmphasis)+','+(green-blueEmphasis)+','+blue+','+alpha+')');
			} else {
				$(this).css('color', 'rgba(228, 200, 174, ' + alpha + ')');
			}
		});
	};

	var updateForecastData = function(callback) {
		$.ajax({
	        url: 'http://api.wunderground.com/api/95e93303e496f7c9/forecast/q/'+state+'/'+encodeURIComponent(city)+'/.json',
	        dataType: 'jsonp',
	        success: function(responseData) {
	            var forecastObject = responseData.forecast.simpleforecast.forecastday[0];
	            if (!forecastObject) return;
	            cachedData.windMph = forecastObject.avewind.mph;
	            cachedData.high = forecastObject.high.fahrenheit;
	            cachedData.low = forecastObject.low.fahrenheit;
	            cachedData.icon = forecastObject.icon_url;
	            cachedData.probOfRain = forecastObject.pop;
	            if (callback) {
	            	callback();
	            }
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
	        	if (! responseData.current_observation) return;
	        	cachedData.currTemp = responseData.current_observation.feelslike_f;
	        	cachedData.conditions = responseData.current_observation.icon;
	        	if (callback) {
	        		callback();
	        	}
	        }
	    });
	};

	var updateDisplay = function() {
		$("#high-text").html(cachedData.high + "<span class='small-degree'>\xB0</span>");
        $("#low-text").html(cachedData.low + "<span class='small-degree'>\xB0</span>");
        $("#wind-text").text(cachedData.windMph + " ");
        var mphText = $('<span />').attr('class', 'small-weather-label').html('mph');
        $("#wind-text").append(mphText);
        $("#chance-of-rain-text").text(cachedData.probOfRain + "% ");
        var rainText = $('<span />').attr('class', 'small-weather-label').html('rain');
        $("#chance-of-rain-text").append(rainText);
        var imgSrc = getIconForConditions(cachedData.conditions);
        $("#conditions-icon").attr("src", imgSrc);
        $("#current-temp-text").html(Math.floor(cachedData.currTemp) + "<span class='big-degree'>\xB0</span>");
        updateTemperatureColors();
	};

	if (_isMultipage) {
		// Update elem values when weather window is inserted
		$(document).on('DOMNodeInserted', function(e) {
		    if (e.target.id == 'weather') {
		    	updateDisplay();
		    }
		});

		// Only ajax calls are on time interval (not the display updating.)
		setInterval(updateForecastData, 1000 * 60 * minsPerForecastCall);
		setInterval(updateCurrTemp, 1000 * 60 * minsPerCurrTempCall);
	} else {
		// Single page. Update display on time interval
		setInterval(updateDisplayAfterAllAjax, 1000 * 60 * minsPerForecastCall);
	}

	// First update
	updateDisplayAfterAllAjax();

	function getIconForConditions(conditions) {
		var defaultIcon = conditionsToDayIconMap[conditions];
		var currHour = new Date().getHours();
		if (nightTimeVersionOfIcon[defaultIcon] && (currHour < 5 || currHour > 19)) {
			return nightTimeVersionOfIcon[defaultIcon];
		}
		return defaultIcon;
	}

	function updateDisplayAfterAllAjax() {
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
	}

});