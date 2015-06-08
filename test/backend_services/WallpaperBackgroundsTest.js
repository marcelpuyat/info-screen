var WallpaperBackgrounds = require("../../javascripts/backend_services/WallpaperBackgrounds");
var validUrl = require('valid-url');

var assert = require("assert");
describe('WallpaperBackgrounds', function() {
  describe('#getRandomBackgroundUrl()', function(done) {
    it('should return a uri', function(done) {
    	this.timeout(5000);
    	WallpaperBackgrounds.getRandomBackgroundUrl({
    		success: function(responseData) {
	    		assert(validUrl.is_uri(responseData), "Return val must be a url");
	    		done();
	    	},
	    	error: function(err) {
	    		assert.fail("not have an throw error", "threw an error", err, ", but ");
	    		done();
	    	}
	    });
    });
  });
});