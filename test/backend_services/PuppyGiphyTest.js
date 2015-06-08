var PuppyGiphy = require("../../javascripts/backend_services/PuppyGiphy");
var validUrl = require('valid-url');

var assert = require("assert");
describe('PuppyGiphy', function() {
  describe('#getRandomGifUrl()', function(done) {
    it('should return a uri', function(done) {
    	this.timeout(5000);
    	PuppyGiphy.getRandomGifUrl({
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