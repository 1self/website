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

    $("#joinForm").submit(function(event){
        event.preventDefault();
        checkUserNameValidity();
    });


    $('#joinButton').click(function(event){
        event.preventDefault();
        $('#joinBox').css('top', $(document).scrollTop() + 70 + "px");
        $('#joinBox').show();
    });

    $(".join_username_btn").click(function(event){
        event.preventDefault();
        var username = $(this).siblings(":text").val();
        $('#joinBox').css('top', $(document).scrollTop() + 70 + "px");
        $("#oneselfUsernameJoin").val(username);
        $('#joinBox').show();
        return false;
    });

    $('.closeButton').click(function(event){
        event.preventDefault();
        $('#loginBox').hide();
        $('#joinBox').hide();
    });

    $("#signup_go_back").click(function(event) {
        event.preventDefault();
        $("#signupWaitListForm").hide();
        $("#joinForm").show();
    });

    $("#signupWaitListFormLink").click(function(event){
        event.preventDefault();
        $("#signupWaitListForm").show();
        $("#joinForm").hide();
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
    const API_ENDPOINT = "https://app-staging.1self.co";
    var username = $('#oneselfUsername').val();
    var url = API_ENDPOINT + '/v1/user/' + username + "/exists";

    $.get(url)
        .done(function(){
            document.location.href = API_ENDPOINT + "/signup?intent=login&oneselfUsername=" + username;
        })
        .error(function(){
            $('#signinErrorMessage').html("Please enter a valid 1self username");
        });
};



var checkUserNameValidity = function(){
    const API_ENDPOINT = "https://app-staging.1self.co";
    var username = $('#oneselfUsernameJoin').val();
    $('#joinErrorMessage').html("");
    var re = /^[a-zA-Z0-9_]*$/;
    if (!re.test(username)) {
        $('#joinErrorMessage').html("Username needs to be just letters, numbers or underscore.");
    } else {
        var url = API_ENDPOINT + '/v1/user/' + username + "/exists";
        $.get(url)
            .done(function(){
                $('#joinErrorMessage').html("Ack. Sorry. That username is already taken!");
            })
            .error(function(){
                document.location.href = API_ENDPOINT + "/signup?intent=website_signup&oneselfUsername=" + username;
            });
    }

};
