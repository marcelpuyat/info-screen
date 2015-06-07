$(function() {
	var moviesCache = [];

	var updateMoviesCache = function(callback) {
		console.log("Updating movie cache: " + new Date());
		$.ajax({
	        url: "http://localhost:8082/movies.jsonp",
	        dataType: 'jsonp',
	        success: function(responseData) {
	        	if (responseData.error) {console.error(responseData.error); return; }
	        	moviesCache = responseData.movies;
	        	if (callback) {
	        		callback();
	        	}
	        }
	    });
	};

	var updateMoviesDisplay = function() {
		console.log("Updating movies display");
		$("#movies").children().each(function(idx, movieBlock) {
			$(movieBlock).find(".movie-poster").attr("src", moviesCache[idx].posterUrl);
			$(movieBlock).find(".movie-title").text(moviesCache[idx].title);
			$(movieBlock).find(".genre").text(moviesCache[idx].genres[0]);
			$(movieBlock).find(".freshness-rating").text(moviesCache[idx].freshness + "%");
			var tomatoImg = "/images/movies/rotten_tomatoes_" + (parseInt(moviesCache[idx].freshness) < 60 ? 
				"rotten" : "fresh") + ".png";
			$(movieBlock).find(".tomato-icon").attr("src", tomatoImg);
			$(movieBlock).find(".audience-rating").text(moviesCache[idx].audienceRating + "%");
		});
	};

	if (window._isMultipage) {
		updateMoviesCache();
		// Update elem values when weather window is inserted
		$(document).on('DOMNodeInserted', function(e) {
		    if (e.target.id == 'movies') {
		    	updateMoviesDisplay();
		    }
		});
	} else {
		updateMoviesCache(function() {
			updateMoviesDisplay();
		});
		window._newDayListeners.push(updateMoviesDisplay);
	}

	window._newDayListeners.push(updateMoviesCache);
});