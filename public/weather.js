$(document).ready(function() {
	var state = "CA";
	var city = "San Mateo";
	var minsPerCall = 5;

	var updateTemperatureColors = function() {
		$('.temp-number').each(function() {
			$(this).css('color', 'rgba(232, 232, 232, 0.85'); // First, reset
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

	updateTemperatureColors();

	var updateWeatherDisplay = function() {

		$.ajax({
	        url: 'http://api.wunderground.com/api/95e93303e496f7c9/forecast/q/'+state+'/'+encodeURIComponent(city)+'/.json',
	        dataType: 'jsonp',
	        success: function(responseData) {
	            var forecastObject = responseData.forecast.simpleforecast.forecastday[0];
	            var windMph = forecastObject.avewind.mph;
	            var highFahrenheitAsString = forecastObject.high.fahrenheit;
	            var lowFahrenheitAsString = forecastObject.low.fahrenheit;
	            var conditionsIconUrl = forecastObject.icon_url;
	            var probOfRain = forecastObject.pop;
	            var forecastAsSimpleText = responseData.forecast.txt_forecast.forecastday[0].fcttext.split(".")[0];

	            $("#high-text").text(highFahrenheitAsString + "\xB0");
	            $("#low-text").text(lowFahrenheitAsString + "\xB0");
	            $("#wind-text").text(windMph);
	            $("chance-of-rain-text").text(probOfRain);
	            $("forecast-text").text(forecastAsSimpleText);
	            $("conditions-icon").attr("src", conditionsIconUrl);

	            updateTemperatureColors();

	            console.log(windMph, highFahrenheitAsString, lowFahrenheitAsString, conditionsIconUrl, probOfRain, forecastAsSimpleText);
	        }
	    });

	    $.ajax({
	    	url: 'http://api.wunderground.com/api/95e93303e496f7c9/conditions/q/'+state+'/'+encodeURIComponent(city)+'.json',
	    	dataType: 'jsonp',
	        success: function(responseData) {
	        	var currTempFahrenheit = responseData.current_observation.feelslike_f;
	        	$("#current-temp-text").text(Math.floor(currTempFahrenheit) + "\xB0");
	        	updateTemperatureColors();
	        	console.log("Feels like: " + currTempFahrenheit);
	        }
	    });
	};

	setInterval(function(){ updateWeatherDisplay(new Date().getHours()) }, 1000 * 60 * minsPerCall); // Limit is 500 calls a day.

	updateWeatherDisplay();

});