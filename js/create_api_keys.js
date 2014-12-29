$(document).ready(function(){
    const API_HOST = "http://api-staging.1self.co";

    var create_api_keys = function(){
        var appEmail = $('#appEmail').val(),

        params = {
            appEmail: appEmail.trim()
        };

        $('.btn-api-key').hide();

        $.post(API_HOST + "/v1/app", params)
            .done(function(message){
                $('#create_key_message').html(message);
                $('#create_key_message').addClass('alert-success');
            })
            .error(function(){
                $('#create_key_message').html("Sorry, something went wrong, please try again later");
                $('#create_key_message').addClass('alert-danger');
            })
            .always(function() {
                $('#create_key_message').show();
            });
    };
    $("#createAppForm").submit(function(event){
        event.preventDefault();
        create_api_keys();
    });
});
