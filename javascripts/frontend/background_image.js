var elementsToChangeColor = [];

$(document).ready(function() {

	var bufferTime = 1000 * 60 * 2;
	var timeBewteenBackgrounds = 1000 * 60 * 4;

	var updateBackground = function() {
	    $.ajax({
	        url: 'http://localhost:8082/background.jsonp',
	        dataType: 'jsonp',
	        type: 'GET',
	        jsonp: 'callback',
	        success: function(responseData) {
	        	if (responseData.error) { console.error(responseData.error); return; }
	        	document.getElementById('new').style.backgroundImage = "url("+responseData.imageUrl+")";

	        	setTimeout(function() {
	        		animateBg(function() {
	        			// Load next one after the buffer time is over.
		        		setTimeout(function() {
		        			updateBackground();
		        		}, timeBewteenBackgrounds);
	        		});
	        	}, bufferTime);
	        }
	    });
	};

	updateBackground();

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