$(document).ready(function () {
    headerResize();
    
    function showNavigation(mode) {
            if ($(document).width() < 801) {
                $('#collapse-link').slideToggle(mode);
            }
    }

    $('.mobile-only-nav').click(function(e){
        showNavigation('slow');
    });

    $('.page-content').click(function(e) {
    if ($('#collapse-link').css('display') == 'block') {
        showNavigation('slow');
    };
});

    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
        return false;
    })
});

$(window).resize(function () {
    headerResize();
});
$(window).scroll(function () {
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