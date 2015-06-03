var elementsToChangeColor = [];

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
	        success: function(responseData) {
	        	document.getElementById('new').style.backgroundImage = "url("+responseData.imageUrl+")";
	        	setTimeout(animateBgAndWaitForNextBackground, bufferTime);
	        }
	    });
	};

	setTimeout(updateBackground, timeBewteenBackgrounds);

	/* https://jsfiddle.net/9GwNG/3/ */
	function animateBg(callback) {
		$("#old").animate({'opacity':0.0},2000, function() {
			$("#new").attr("id", "temp");
			$("#old").attr("id", "new");
			$("#temp").attr("id", "old");
		});
		$("#new").animate({'opacity':1.0},2000, function() {
			callback();
		});
	}
});