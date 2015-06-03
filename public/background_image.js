$(document).ready(function() {

	var bufferTime = 1000 * 5;
	var timeBewteenBackgrounds = 1000 * 10;

	var waitForNextBackground = function() {
		setTimeout(updateBackground, timeBewteenBackgrounds);
	};

	var animateBgAndWaitForNextBackground = function() {
		animateBg(waitForNextBackground);
	};

	var updateBackground = function() {
	    $.ajax({
	        url: 'http://localhost:8082/background.json',
	        dataType: 'jsonp',
	        type: 'GET',
	        jsonp: 'callback',
	        success: handleBackgroundResponse
	    });
	};

	setTimeout(updateBackground, timeBewteenBackgrounds);

	function handleBackgroundResponse(responseData) {
		if (responseData.error) {return;}
    	document.getElementById('new').style.backgroundImage = "url("+responseData.imageUrl+")";
    	setTimeout(animateBgAndWaitForNextBackground, bufferTime);
    	responseData = null;
	}

	/* https://jsfiddle.net/9GwNG/3/ */
	function animateBg(callback) {
		$("#old").animate({'opacity':0.0},2000, swapOldAndNewBg);
		$("#new").animate({'opacity':1.0},2000, callback);
	}

	function swapOldAndNewBg() {
		var oldBgElem = $("#old");
		var newBgElem = $("#new");

		oldBgElem.style.backgroundImage = null;

		// Change old bg to be the next new one (so we reuse the DOM element)
		newBgElem.attr("id", "temp");
		oldBgElem.attr("id", "new");
		newBgElem.attr("id", "old");
	}
});