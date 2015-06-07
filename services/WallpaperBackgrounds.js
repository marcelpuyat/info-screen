var request = require('request');

var onlyGetTopNRatedPages = 20;

module.exports.getRandomBackgroundUrl = function(callbacks) {
  var randomPage = Math.floor(Math.random() * onlyGetTopNRatedPages) + 1;
  request({url: 'http://wall.alphacoders.com/api1.0/get.php?auth=2d267ee4d7cb55dbcb060a9b1df09107&category_id=10&page='+randomPage},
    function(err, response, body) {
      if (err || response.statusCode != 200) {
        callbacks.error(err);
        return;
      }
      try {
        var wallpapers = JSON.parse(body).wallpapers;
        var randomIndex = Math.floor(Math.random() * wallpapers.length);
        callbacks.success(wallpapers[randomIndex].url);
      } catch (jsonErr) {
        callbacks.error(jsonErr);
      }
    }
  );
};
