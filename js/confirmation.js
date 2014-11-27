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

    $('#referral').append("<p>refer 3 people and get 1self free for a year</p>");
    $('#referral').append("<p>http://www.1self.co?referrer=" + response.referralCode + "</p>");
});
