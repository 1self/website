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

    var shareTitle = "1self -  Every data bit about you in one place";
    var shareCaption = "Share and win";
    var shareLink = "http://www.1self.co?referrer=" + response.referralCode;
    var shareText = "Refer 3 people and get 1self free for a year";
    

    $('#referral').append("<p>"+shareText+"</p>");

    $('#referral').append("<p><div id='share-link-copy-area'>"+ "<a href='"+shareLink+"'>" + shareLink +"</a></div></p>");

    $('#referral').append("<p>");

    $("#referral").append("<img src='/images/twitter-image.png' /> <a class='share-link' href='https://twitter.com/intent/tweet?text="+ shareText +" \n"+ shareLink +"'>Share on Twitter</a>");

    $('#referral').append("<span style='margin-left:25px;'></span>");

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

    var fbShare = "<img src='/images/facebook-image.png' /> <a rel='nofollow' class='share-link' href='javascript://' onclick='return fbs_click()' target='_blank'>Share on Facebook</a>";    

    $("#referral").append(fbShare);

    $('#referral').append("</p>");

    $("#referral").append("<br> <br />");
});
