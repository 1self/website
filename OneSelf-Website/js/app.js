function showNavigation(mode) {
	$(document).ready(function() {
		if ($(document).width() < 801) {
			$('#collapse-link').slideToggle(mode);
		}
	});
}
$(document).ready(function() {
	headerResize();
});

$(window).resize(function() {
	headerResize();
});
$(window).scroll(function() {
	var headerHeight = $(".header-wrapper").height();
	console.log($(".page-content").scrollTop());
	if ($(window).scrollTop() < headerHeight) {
		$(".page-nav").removeClass("shrink");
	}
	else {
		$(".page-nav").addClass("shrink");

	}
});

function headerResize() {
	var headerHeight = $(".header-wrapper").height();
	$(".page-content").css("padding-top", headerHeight + "px");
}