var Weather = require("../../javascripts/backend_services/Weather");
var appRootPath = require('app-root-path').path;
var fs = require('fs');

var assert = require("assert");
describe('Weather', function() {
	describe('#getCurrentConditions()', function() {
		var _responseData;
		before(function(done) {
			this.timeout(5000);
			Weather.getCurrentConditions({
				success: function(responseData) {
					_responseData = responseData;
					done();
				},
				error: function() {
					throw "Error in before";
				}
			});
		});
		it('should return an object with currTemp key which is a number', function() {
			assert(isNumber(_responseData.currTemp));
		});
		it('should return an object with conditionsIcon key which is a local file', function() {
			assert(fs.existsSync(appRootPath + _responseData.conditionsIcon), "Conditions icon must be a local file that exists");
		});
	});
	describe('#getTodaysForecast()', function() {
		var _responseData;
		before(function(done) {
			this.timeout(5000);
			Weather.getTodaysForecast({
				success: function(responseData) {
					_responseData = responseData;
					done();
				},
				error: function() {
					throw "Error in before";
				}
			});
		});
		it('should return an object with windMph key which is a number', function() {
			assert(isNumber(_responseData.windMph));
		});
		it('should return an object with probOfRain key which is a number', function() {
			assert(isNumber(_responseData.probOfRain));
		});
		it('should return an object with high key which is a number', function() {
			assert(isNumber(_responseData.high));
		});
		it('should return an object with low key which is a number', function() {
			assert(isNumber(_responseData.low));
		});
	});
});

/* https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric */
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}