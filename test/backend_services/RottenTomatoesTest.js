var RottenTomatoes = require("../../javascripts/backend_services/RottenTomatoes");
var assert = require("assert");

if (typeof Array.isArray === 'undefined') {
	Array.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
}

describe('RottenTomatoes', function() {
	var _responseData;
	before(function(done) {
		this.timeout(10000);
		RottenTomatoes.getMovieData({
			success: function(responseData) {
				_responseData = responseData;
				done();
			},
			error: function() {
				throw "Error in 'before'";
			}
		});
	});
	describe('#getMovieData()', function() {
		it('should return an array', function() {
			assert(Array.isArray(_responseData));
		});
		it('should return an array with numMoviesToGet movie objects', function() {
			assert.equal(_responseData.length, RottenTomatoes.numMoviesToGet);
		});
		it('should return an array with elems that have the following keys:\n'+
			'\t\tfreshness\n'+
			'\t\taudienceRating\n'+
			'\t\tgenres\n'+
			'\t\tdatePublished\n'+
			'\t\tposterUrl', function() {
				for (var idx in _responseData) {
					var movieObj = _responseData[idx];
					assert.notEqual(movieObj.freshness, undefined);
					assert.notEqual(movieObj.audienceRating, undefined);
					assert.notEqual(movieObj.genres, undefined);
					assert.notEqual(movieObj.datePublished, undefined);
					assert.notEqual(movieObj.posterUrl, undefined);
				}
		});
	});
});