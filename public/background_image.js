var elementsToChangeColor = [];

$(document).ready(function() {

	var bufferTime = 1000 * 15;
	var timeBewteenBackgrounds = 1000 * 30;

	var updateBackground = function() {
	    $.ajax({
	        url: 'http://localhost:8082/background.json',
	        dataType: 'jsonp',
	        type: 'GET',
	        jsonp: 'callback',
	        success: function(responseData) {
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
	}

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

	/* From: https://jsfiddle.net/s7Wx2/ */
	function getImageBrightness(loadedImgTag, callback) {
        var colorSum = 0;

        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = loadedImgTag.width;
        canvas.height = loadedImgTag.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(loadedImgTag,0,0);

        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        var r,g,b,avg;

          for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (loadedImgTag.width*loadedImgTag.height));
        callback(brightness);
    }
});