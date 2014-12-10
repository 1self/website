$(document).ready(function () {
    //return;
    // enable this when api is launched

    $(".copy-link").hide();
    var zc_client = new ZeroClipboard(document.getElementById('copy-button'));
    zc_client.on('ready', function (r_event) {
        $(".copy-link").show();
    });

    var referralCode;
    if (typeof localStorage.signupEmail === "undefined") {
        if (typeof localStorage.referralCode !== "undefined") {
            referralCode = localStorage.referralCode;
        }
        else {
            // referralCode = "x";
            return;
        }
    }
    else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://signup.1self.co", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({
            email: localStorage.signupEmail,
            referredBy: localStorage.referrer
        }));

        var response = JSON.parse(xmlhttp.response);
        referralCode = response.referralCode;
        localStorage.referralCode = referralCode;

        delete localStorage.signupEmail;
    }

    var shareTitle = "Check out 1self";
    var shareCaption = "Join 1self!";
    var shareLink = "http://www.1self.co?referrer=" + referralCode;
    var shareText = "1self is the new platform that lets me collect, compare, correlate and comment on my big data to live a smarter life";

    $('#shareLink').text(shareLink);

    var twitter_share_link = "https://twitter.com/intent/tweet?text=" + shareText + " \n" + shareLink;

    $("#share_twitter").attr("href", twitter_share_link);
    $("#share_twitter").attr("target", "_blank");

    var urlEncodedLineBreak = "%0D%0A";

    var emailText = "mailto:?subject=" + shareTitle + "&body=" + shareText + urlEncodedLineBreak + urlEncodedLineBreak + shareLink;

    $("#share_email").attr("href", emailText);
    $("#share_email").attr("target", "_blank");

    var fbShareLink = "http://www.facebook.com/dialog/feed?app_id=743829829032520&link=" + shareLink + "&picture=http://www.1self.co/images/hero.png&name=" + encodeURIComponent(shareTitle) + "&caption=" + encodeURIComponent(shareCaption) + "&description=" + encodeURIComponent(shareText) + "&message=" + encodeURIComponent(shareText) + "&redirect_uri=http://www.1self.co";

    window.fbs_click = function () {
        window.open(fbShareLink);
        // FB.ui({
        //     method: 'feed',
        //     link: 'http://www.1self.co',
        //     caption: shareCaption,
        //     app_id: "743829829032520",
        //     picture: "http://www.1self.co/images/hero.png",
        //     name: shareTitle,
        //     description: shareText,
        //     message: shareText,
        //     redirect_uri: 'http://www.1self.co/'
        // }, function(response){});
        // return false; 
    };

    $("#share_facebook").click(window.fbs_click);

});
