$(document).ready(function(){
    //return;
    // enable this when api is launched
    var referralCode;
    if(typeof localStorage.signupEmail === "undefined"){
        if(typeof localStorage.referralCode !== "undefined") {
            referralCode = localStorage.referralCode;
        }
        else {
            return;
        }
    }
    else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST","http://localhost:3000", false);
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

    var shareTitle = "1self -  Every data bit about you in one place";
    var shareCaption = "Share and win";
    var shareLink = "http://www.1self.co?referrer=" + referralCode;
    var shareText = "Refer 3 people and get 1self free for a year";

    $('#shareLink').text(shareLink);

    var twitter_share_link = "https://twitter.com/intent/tweet?text="+ shareText +" \n"+ shareLink;

    $("#share_twitter").attr("href", twitter_share_link);
    $("#share_twitter").attr("target", "_blank");

    var emailText = "mailto:?subject="+shareTitle+"&body="+ shareText +" "+ shareLink;

    $("#share_email").attr("href", emailText);

    var fbShareLink = "http://www.facebook.com/dialog/feed?display=popup&app_id=743829829032520&link="+shareLink+"&picture=http://www.1self.co/images/hero.png&name="+encodeURIComponent(shareTitle)+"&caption="+encodeURIComponent(shareCaption)+"&description="+encodeURIComponent(shareText)+"&message="+encodeURIComponent(shareText)+"&redirect_uri=http://www.1self.co";

    window.fbs_click = function() {
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
