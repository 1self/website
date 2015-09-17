var deferred; // = $.Deferred();

function getCards() {

    deferred = $.Deferred();

    var url;

    if (offline) {
        url = "offline_json/offline.json";
    } else {
        // Get the ajax requests out of the way early because they
        // are typically longest to complete

        var minStdDev = getQSParam().minStdDev;
        var maxStdDev = getQSParam().maxStdDev;

        url = API_HOST + '/v1/users/';
        url += username + '/cards';
        url += '?extraFiltering=true';
        url += minStdDev ? '&minStdDev=' + minStdDev : '';
        url += maxStdDev ? '&maxStdDev=' + maxStdDev : '';
    }

    console.log(url);

    $.getJSON(url,
            function() {
                console.log("accessed api for cards");
            })
        .done(function(data) {

            console.log('card data', data);
            // window.cardData = data;
            deferred.resolve(data);
        })
        .fail(function(data) {
            console.log('error getting cards', data);

        });
}

// $(function() {
//     getCards();

// });

function getIntegrationsInCategories() {
    var integrationJSON = [];

    integrationJSON.push(integrationCatTemplate('Productivity', ['RescueTime', 'Visit Counter', 'GitHub']));
    integrationJSON.push(integrationCatTemplate('Social', ['Twitter', 'Instagram', 'Foursquare', 'Hacker News', 'last.fm']));
    integrationJSON.push(integrationCatTemplate('Fitness', ['Google Fit', 'Strava']));
    integrationJSON.push(integrationCatTemplate('Software Development', ['GitHub', 'Sublime', 'Intelli J', 'Visual Studio', 'StackOverflow']));

    return integrationJSON;
}

function integrationCatTemplate(categoryName, integrations) {
    var catTemplate = {
        category: categoryName,
        integrations: []
    };

    for (var i = 0; i < integrations.length; i++) {
        catTemplate.integrations.push(integrationTemplate(integrations[i], false));
    }

    return catTemplate;
}

function integrationTemplate(serviceName, hasConnected) {
    return {
        serviceName: serviceName,
        identifier: formatIdentifier(serviceName),
        shortDescription: "blah blah shortDescription",
        longDescription: "blah blah longDescription. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus lorem et mollis tempus. Vivamus at semper augue.. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus lorem et mollis tempus. Vivamus at semper augue.. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus lorem et mollis tempus. Vivamus at semper augue.",
        hasConnected: hasConnected
    };
}

function formatIdentifier(serviceName) {
    var identifier = serviceName.toLowerCase();
    identifier = identifier.replace('.', '');
    identifier = identifier.replace(' ', '');
    return identifier;
}





