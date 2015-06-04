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
		var nextVisibleElem = queue[0];

		$(lastVisibleElem).animate({'bottom': '+=100vh', 'easing': 'easeInCirc'}, 2000, function() {
			$(lastVisibleElem).detach();
			$(lastVisibleElem).css('bottom', '0');
			if (queue.length == 1) {
				$(lastVisibleElem).appendTo($('#right-half-outer'));
				queue.push(lastVisibleElem);
			}
		});

		$(nextVisibleElem).animate({'bottom': '+=100vh', 'easing': 'easeInCirc'}, 2000, function() {
			$(nextVisibleElem).css('bottom', '0');
		});

		if (queue.length > 2) {
			$(queue[1]).appendTo($('#right-half-outer'));

			queue.push(lastVisibleElem);
		}
	}, 1000 * 15);
	window._isMultipage = true;
});