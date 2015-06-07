var request = require('request');

var puppy_url = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=25";
var tags = ["puppy+yawn", "puppy", "cute+puppy", "cute+dog", "sleepy+dog"];
var tagIds = {"puppy+yawn": 0, "puppy": 1, "cute+puppy": 2, "cute+dog": 3, "sleepy+dog": 4};
var countMap = {
    "puppy+yawn": 20,
    "puppy": 3500,
    "cute+puppy": 800,
    "cute+dog": 1400,
    "sleepy+dog": 50
};

/* Create probability array */
var totalCount = 0;
for (var prop in countMap) {
    if (countMap.hasOwnProperty(prop)) {
        totalCount += countMap[prop];
    }
}
var probabilityArray = [];
for (var prop2 in countMap) {
    if (countMap.hasOwnProperty(prop2)) {
        probabilityArray[tagIds[prop2]] = countMap[prop2] / totalCount;
    }
}

module.exports.getRandomGifUrl = function(callbacks) {
    var term = getRandomTerm();
    var picNum = getRandomInt(0, countMap[term]-1);
    var pageNum = Math.floor(picNum / 25);
    var numPicInPage = picNum % 25;
    request({url: puppy_url + "&q="+term+"&offset="+pageNum},
        function(err, response, body) {
            if (err || response.statusCode != 200) {
                callbacks.error(err);
                return;
            }
            try {
                callbacks.success(JSON.parse(body).data[numPicInPage].images.original.url);
            } catch(jsonErr) {
                callbacks.error(jsonErr);
            }
        }
        );
};

/* Helpers */

function getRandomTerm() {
    var num = Math.random(),
    s = 0,
    lastIndex = probabilityArray.length - 1;

    for (var i = 0; i < lastIndex; ++i) {
        s += probabilityArray[i];
        if (num < s) {
            return tags[i];
        }
    }

    return tags[lastIndex];
}

/**
* Returns a random integer between min (inclusive) and max (inclusive)
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}