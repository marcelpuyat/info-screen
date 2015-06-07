$(document).ready(function() {
	var minsPerForecastCall = 10;
	var minsPerCurrTempCall = 5;

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
	        url: 'http://localhost:8082/weather/forecast.json',
	        dataType: 'jsonp',
	        success: function(responseData) {
	        	console.dir(responseData);
	        	if (responseData.error) {console.error(responseData.error); return; }
	            cachedData.windMph = responseData.todaysForecast.windMph;
	            cachedData.high = responseData.todaysForecast.high;
	            cachedData.low = responseData.todaysForecast.low;
	            cachedData.probOfRain = responseData.todaysForecast.probOfRain;
	            if (callback) {
	            	callback();
	            }
	        }
	    });
	};

	var updateCurrTemp = function(callback) {
		$.ajax({
	    	url: 'http://localhost:8082/weather/conditions.json',
	    	dataType: 'jsonp',
	        success: function(responseData) {
	        	console.dir(responseData);
	        	if (responseData.error) {console.error(responseData.error); return; }
	        	cachedData.currTemp = responseData.currentConditions.currTemp;
	        	cachedData.conditionsIcon = responseData.currentConditions.conditionsIcon;
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
        $("#conditions-icon").attr("src", cachedData.conditionsIcon);
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