window._isMultipage = true;

$(function() {
	var queue = [];
	$('.right-half-screen').each(function(idx) {
		if (idx > 1)
			$(this).detach();
		queue.push(this);
	});
	
	setInterval(function() {
		var lastVisibleElem = queue.shift();
		console.log("Last visible, popped of queue: " + lastVisibleElem.id);
		var nextVisibleElem = queue[0];

		console.log("Next to be visible, now front of queue: " + lastVisibleElem.id);

		$(lastVisibleElem).animate({'bottom': '+=100vh', 'easing': 'easeInCirc'}, 2000, function() {
			$(lastVisibleElem).detach();
			$(lastVisibleElem).css('bottom', '0');
			if (queue.length == 1) {
				console.log("Only using 2 windows");
				$(lastVisibleElem).appendTo($('#right-half-outer'));
				queue.push(lastVisibleElem);
			} else {
				console.log("Appending: " + queue[1].id + " to bottom of screen");
				$(queue[1]).appendTo($('#right-half-outer'));

				console.log("Requeueing: " + lastVisibleElem.id);
				queue.push(lastVisibleElem);
			}
		});

		$(nextVisibleElem).animate({'bottom': '+=100vh', 'easing': 'easeInCirc'}, 2000, function() {
			$(nextVisibleElem).css('bottom', '0');
		});
	}, 1000 * 15);
});