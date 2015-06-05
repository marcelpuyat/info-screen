(function() {

	var Crawler = require("crawler");
	var rottenTomatoesUrl = "http://www.rottentomatoes.com";
	var numMoviesToGet = 3;

	module.exports.getMovieData = function(movieDataCb) {
		var moviePathToTitleMap = {};
		var movies = [];

		var movieCrawler = new Crawler({
			maxConnections: numMoviesToGet,
			userAgent: 'Mozilla/5.0',
			callback: function(error, result, $) {
				var movieTitle = moviePathToTitleMap[result.request.uri.path];
				var newMovieData = {title: movieTitle, genres: []};
				movies.push(newMovieData);

				// Freshness
				$("#all-critics-numbers #tomato_meter_link [itemprop='ratingValue']").each(function(index, freshnessRatingSpan) {
					var freshness = freshnessRatingSpan.children[0].data;
					newMovieData.freshness = freshness;
				});
				// Audience score
				$(".audience-score [itemprop='ratingValue']").each(function(index, audienceRatingSpan) {
					var audienceRating = audienceRatingSpan.children[0].data;
					newMovieData.audienceRating = audienceRating;
				});
				// Genre
				$(".movie_info .info [itemprop='genre']").each(function(index, genreSpan) {
					var genre = genreSpan.children[0].data;
					newMovieData.genres.push(genre);
				});
				// Date published
				$(".movie_info .info [itemprop='datePublished']").each(function(index, datePublishedSpan) {
					var datePublished = datePublishedSpan.attribs.content; // Formatted as: YYYY-MM-DD
					newMovieData.datePublished = datePublished;
				});
				// Poster image
				$("#topSection img.posterImage").each(function(index, posterImg) {
					var imgSrc = posterImg.attribs.src;
					newMovieData.posterUrl = imgSrc;
				});
			},
			onDrain: function() {
				movieDataCb(movies);
			}
		});

		var topMovies = new Crawler({
		  maxConnections : 1,

		  callback : function (error, result, $) {

		    $('#Top-Box-Office a').each(function(index, aTag) {
		    	if (index < numMoviesToGet) {
		    		var movieTitle = aTag.children[0].data; // Depends on RottenTomatoes a tags using relative paths 
		    		moviePathToTitleMap[aTag.attribs.href] = movieTitle;
		    		movieCrawler.queue(rottenTomatoesUrl + aTag.attribs.href);
		    	}
		    });
		  }
		});

		topMovies.queue(rottenTomatoesUrl);
	}
})();