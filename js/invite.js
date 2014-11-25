var cacheEmail = function(){
	localStorage.signupEmail = $('#mce-EMAIL')[0].value;
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function(){
	return;
	// enable this when api is launched

	console.log("ready");
	var referrer = getParameterByName("referrer");
	if(typeof(referrer) == "undefined" || referrer === "")
		return;

	localStorage.referrer = referrer;
});