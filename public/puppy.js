$(function() {
	updatePuppyImg();

	if (window._isMultipage) {
		// Update elem values when weather window is inserted
		$(document).on('DOMNodeInserted', function(e) {
		    if (e.target.id == 'puppy') {
		    	updatePuppyImg();
		    }
		});
	} else {
		setInterval(updatePuppyImg, 1000 * 10);
	}



	function updatePuppyImg() {
		$.ajax({
	        url: "http://localhost:8082/puppy.json",
	        dataType: 'jsonp',
	        success: function(responseData) {
	        	if (responseData.error) {console.error(responseData.error); return; }
	        	$("#puppy-img").attr('src', responseData.imageUrl);
	        }
	    });
	}


});