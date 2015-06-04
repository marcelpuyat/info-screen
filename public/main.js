window._isMultipage = false;

$(function() {
	var queue = [];
	$('.right-half-screen').each(function(idx) {
		if (idx > 1)
			$(this).detach();
		queue.push(this);
	});

	setTimeout(function() {
		location.reload(true);
	}, 1000 * 60 * 5);
	
	// _isMultipage = setInterval(function() {
	// 	var lastVisibleElem = queue.shift();
	// 	var nextVisibleElem = queue[0];

	// 	$(lastVisibleElem).animate({'bottom': '+=100vh', 'easing': 'easeInCirc'}, 2000, function() {
	// 		$(lastVisibleElem).detach();
	// 		$(lastVisibleElem).css('bottom', '0');
	// 	});

	// 	$(nextVisibleElem).animate({'bottom': '+=100vh', 'easing': 'easeInCirc'}, 2000, function() {
	// 		$(nextVisibleElem).css('bottom', '0');
	// 	});

	// 	$(queue[1]).appendTo($('#right-half-outer'));

	// 	queue.push(lastVisibleElem);
	// }, 6000);
});