$(document).ready(function() {
    executeOnLoadTasks();
});

function executeOnLoadTasks() { 

    var service = getQSParam().service;

    if (!service || service === "") {
        window.location.href = 'integrations.html';
        return false;
    }

    var onGotData = function(integrationJSON) {
        if (!integrationJSON) {
            window.location.href = 'integrations.html';
            return false;
        }
        renderIntegrationDetail(integrationJSON);
    };

    getIntegrationsInCategories(onGotData, service);

    $('.back-button').click(function() {
        window.history.back();
        return false;
    });

}

function renderIntegrationDetail(integrationJSON) {

    var $integrationDetail = $('.integration-detail');

    $('.page-title').text('Connect ' + integrationJSON.serviceName);

    $integrationDetail.addClass(integrationJSON.identifier);
    $integrationDetail.find('.service').addClass(integrationJSON.identifier);
    $integrationDetail.find('.serivce-short-description').text(integrationJSON.shortDescription);
    $integrationDetail.find('.integration-detail-bottom p').text(integrationJSON.longDescription);
}
