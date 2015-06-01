// These listeners should not take too long to finish...
var newDayListeners = [];

$(document).ready(function() {
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	var weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu",
		"Fri", "Sat"
	];

	var updateDate = function() {
		var currDate = new Date();
		// Jump forward by 1 minute to make sure we're at next day
		currDate.setTime(currDate.getTime() + 1000 * 60);

		var month = monthNames[currDate.getMonth()];
		var date = currDate.getDate();
		var dayOfWeek = weekDayNames[currDate.getDay()];
		console.log(month, date, dayOfWeek);

		$("#date-text").text(month + " " + date);
		$("#day-text").text(dayOfWeek);

		// Call all new day listeners
		for (var i = 0; i < newDayListeners.length; i++) {
			newDayListeners[i]();
		}
	};

	var updateTime = function() {
		var currTime = new Date();

		var hourToDisplay = currTime.getHours() % 12;
		if (hourToDisplay == 0) hourToDisplay = 12;

		$("#time-text").text(pad(hourToDisplay, 2) + ":" + pad(currTime.getMinutes(), 2));
		$("#am-pm-text").text(currTime.getHours() < 12 ? "AM" : "PM");
	}

	var numMillisInMinute = 1000 * 60;
	var numMillisInDay = 1000 * 60 * 60 * 24;

	updateTime();
	updateDate();

	// Set interval loop for updating time
	var setTimerForTimeUpdate = function() {
		var currTime = new Date();
		var numMillisTilNextMinute = numMillisInMinute - (
			currTime.getSeconds() * 1000 +
			currTime.getMilliseconds()
		);
		setTimeout(function() {
			updateTime();
			setTimerForTimeUpdate();
		}, numMillisTilNextMinute);
	}
	setTimerForTimeUpdate();
	
	// Set interval loop for updating date
	var setTimerForDateUpdate = function() {
		var currDate = new Date();
		var numMillisTilStartOfNextDay = numMillisInDay - (
			currDate.getHours() * 1000 * 60 * 60 +
			currDate.getMinutes() * 1000 * 60 +
			currDate.getSeconds() * 1000 +
			currDate.getMilliseconds());
		setTimeout(function() {
			updateDate();
			setTimerForDateUpdate();
		}, numMillisTilStartOfNextDay);
	}
	setTimerForDateUpdate();

	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
});