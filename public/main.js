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

		$(lastVisibleElem).animate({'bottom': '+=100vh'}, 2000, function() {
			$(lastVisibleElem).detach();
			$(lastVisibleElem).css('bottom', '0');
		});

		$(nextVisibleElem).animate({'bottom': '+=100vh'}, 2000, function() {
			$(nextVisibleElem).css('bottom', '0');
		});

		$(queue[1]).appendTo($('#right-half-outer'));

		queue.push(lastVisibleElem);
	}, 6000);
});