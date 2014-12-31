$(document).ready(function () {
    headerResize();

    var showNavigation = function (mode) {
        if ($(document).width() < 801) {
            $('#collapse-link').slideToggle(mode);
        }
    };

    $('.nav-toggle').click(function (e) {
        showNavigation('slow');
    });

    $('.page-content').click(function (e) {
        if ($('#collapse-link').css('display') == 'block') {
            showNavigation('slow');
        }
    });

    $('.back-to-top, .y-dwarrow-center').click(function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
        return false;
    });

    $("#signInForm").submit(function(event){
        event.preventDefault();
        checkUserName();
    });

    $('#loginButton').click(function(event){
        event.preventDefault();
        $('#loginBox').show();
    });

    $('.closeButton').click(function(event){
        event.preventDefault();
        $('#loginBox').hide();
    });
});

$(window).resize(function () {
    headerResize();
});
$(window).scroll(function () {
    var headerHeight = $(".header-wrapper").height();
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

var checkUserName = function(){
    const LOGIN_ENDPOINT = "http://api.1self.co";

    var username = $('#oneselfUsername').val(),

    url = LOGIN_ENDPOINT + '/v1/user/' + username + "/exists";

    $.get(url)
        .done(function(){
            document.location.href = LOGIN_ENDPOINT + '/auth/github';
        })
        .error(function(){
            $('#signinErrorMessage').html("Please enter a valid 1self username");
        });
};