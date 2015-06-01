$(document).ready(function() {
	
	var updateCalendar = function(hour) {

		var dateToFetch = new Date();
		var endOfNextDay = new Date();
		endOfNextDay.setDate(dateToFetch.getDate() + 1);
		endOfNextDay.setHours(23);
		endOfNextDay.setMinutes(59);
		$.ajax({
	        url: 'http://localhost:8082/calendar.json',
	        dataType: 'jsonp',
	        type: 'GET',
	        data: {minDateInSeconds: dateToFetch.getTime(), maxDateInSeconds: endOfNextDay.getTime()},
	        contentType: 'application/json; charset=utf-8',
	        jsonp: 'callback',
	        success: function(responseData) {
	        	// if (responseData.error == "expired") {
	        	// 	console.log("EXPIRED IN CLIENT CODE");
	        	// 	location.replace("http://localhost:8082/auth");
	        	// 	return;
	        	// }
	        	console.log("Events");
	        	console.dir(responseData);
	        }
	    });
	};

	
	updateCalendar();
});