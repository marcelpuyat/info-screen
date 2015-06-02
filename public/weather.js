$(document).ready(function() {
	var state = "CA";
	var city = "San Mateo";
	var minsPerForecastCall = 10;
	var minsPerCurrTempCall = 5;

	var cachedData = {};

	var updateTemperatureColors = function() {
		$('.temp-number').each(function() {
			$(this).css('color', 'rgba(228, 228, 228, 0.90'); // First, reset
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
	            if (callback) {
	            	callback();
	            }
	        }
	    });
	};

	var updateCurrTemp = function(callback) {
		$.ajax({
	    	url: 'http://api.wunderground.com/api/95e93303e496f7c9/conditions/q/'+state+'/'+encodeURIComponent(city)+'.json',
	    	dataType: 'jsonp',
	        success: function(responseData) {
	        	cachedData.currTemp = responseData.current_observation.feelslike_f;
	        	if (callback) {
	        		callback();
	        	}
	        }
	    });
	};

	var updateDisplay = function() {
		$("#high-text").text(cachedData.high + "\xB0");
        $("#low-text").text(cachedData.low + "\xB0");
        $("#wind-text").text(cachedData.windMph);
        $("chance-of-rain-text").text(cachedData.probOfRain);
        $("conditions-icon").attr("src", cachedData.icon);
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