module.exports.provide = function(serviceFn, resultObjName, res) {
	serviceFn({
		success: function(result) {
			var resultObj = {};
			resultObj[resultObjName] = result;
			res.jsonp(resultObj);
		},
		error: function(err) {
			res.jsonp({error: err});
		}
	});
};