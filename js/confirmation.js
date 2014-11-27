$(document).ready(function(){
    //return;
    // enable this when api is launched

    console.log("ready");
    if(typeof localStorage.signupEmail === "undefined"){
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open("POST","http://signup.1self.co", false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        email: localStorage.signupEmail,
        referredBy: localStorage.referrer
    }));
    
    var response = JSON.parse(xmlhttp.response);
    localStorage.referralCode = response.referralCode;

    var shareLink = "http://www.1self.co?referrer=" + response.referralCode;
    var shareText = "Refer 3 people and get 1self free for a year";

    $('#referral').append("<p>refer 3 people and get 1self free for a year</p>");
    $('#referral').append("<p>"+ shareLink +"</p>");

    $('#referral').append("<p>");

    $("#referral").append("<img src='/images/twitter-image.png' /> <a class='share-link' href='https://twitter.com/intent/tweet?text="+ shareText +" \n"+ shareLink +"'>Share on Twitter</a>");

    $('#referral').append("<span style='margin-left:25px;'></span>");

    window.fbs_click = function() {
        window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(shareLink)+'&t='+encodeURIComponent(shareText),'sharer','toolbar=0,status=0,width=626,height=436'); return false;
    };

    var fbShare = "<img src='/images/facebook-image.png' /> <a rel='nofollow' class='share-link' href='javascript://' onclick='fbs_click()' target='_blank'>Share on Facebook</a>";

    $("#referral").append(fbShare);

    $('#referral').append("</p>");

    $("#referral").append("<br> <br />");

});
