$(document).ready(function() {

	var updateBackground = function() {
	    $.ajax({
	        url: 'http://localhost:8082/background.json',
	        dataType: 'jsonp',
	        type: 'GET',
	        jsonp: 'callback',
	        success: function(responseData) {
	        	document.getElementById('new').style.backgroundImage = "url("+responseData.imageUrl+")";

	        	setTimeout(animateBg, 3000);
	        }
	    });
	}

	setInterval(updateBackground, 20000); // Change every hour

	/* https://jsfiddle.net/9GwNG/3/ */
	function animateBg(){
		$("#old").animate({'opacity':0.0},2000, function() {
			$("#new").attr("id", "temp");
			$("#old").attr("id", "new");
			$("#temp").attr("id", "old");
		});
		$("#new").animate({'opacity':1.0},2000);
	}
});