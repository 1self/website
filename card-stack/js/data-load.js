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

function getIntegrationsInCategories(callback, serviceIdentifier) {
    var integrationJSON = [];

    integrationJSON.push(integrationCatTemplate('Productivity', ['RescueTime', 'Visit Counter', 'GitHub']));
    integrationJSON.push(integrationCatTemplate('Social', ['Twitter', 'Instagram', 'Foursquare', 'Hacker News', 'last.fm']));
    integrationJSON.push(integrationCatTemplate('Fitness', ['Google Fit', 'Strava']));
    integrationJSON.push(integrationCatTemplate('Software Development', ['GitHub', 'Sublime', 'Intelli J', 'Visual Studio', 'StackOverflow']));

    if (!serviceIdentifier) {
        callback(integrationJSON);
    } else {
        var singleIntegrationJSON;
        integrationJSON.some(function (category) {
            category.integrations.forEach(function (integration) {
                if (integration.identifier === serviceIdentifier) {
                    singleIntegrationJSON = integration;
                    return singleIntegrationJSON; // break out of some loop if set
                }
            });
            return singleIntegrationJSON; // break out of some loop if set
        });
        callback(singleIntegrationJSON);
    }
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

    var identifier = formatIdentifier(serviceName);
    var descriptions = serviceDescriptions(identifier);

    return {
        serviceName: serviceName,
        identifier: identifier,
        shortDescription: descriptions.shortDescription,
        longDescription: descriptions.longDescription,
        instructions: descriptions.instructions,
        hasConnected: hasConnected
    };
}

function formatIdentifier(serviceName) {
    var identifier = serviceName.toLowerCase();
    identifier = identifier.replace('.', '');
    identifier = identifier.replace(' ', '');
    return identifier;
}

function serviceDescriptions(serviceIdentifier) {
    var returnDesc;
    var descriptions = [
        {   identifier: 'rescuetime',
            shortDescription: 'Find your ideal work-life balance and understand how you spend your computer time',
            longDescription: 'RescueTime is a popular app that helps improve your time management in order to stay more productive and happy at your computer.'
                                + '<br>RescueTime is developed independently to 1self by a seprate company.'
                                + '<br>By using the 1self RescueTime integration you&apos;ll be able to get even deeper insights into your digital behaviour.',
            instructions: '<b>I do not have a RescueTime account</b>'
                                + '<br>If you do not have a RescueTime account then you need to <a href="http://www.rescuetime.com" target="_blank">go to RescueTime.com</a> to register. '
                                + 'After registering be sure to download and install the RescueTime application. '
                                + 'Once complete, return to this page (we&apos;ll keep it open in this tab for you).'
                                + '<br><a href="http://www.rescuetime.com" target="_blank">Register at RescueTime</a>'
                                + '<br><br>'
                                + '<b>I have a RescueTime account</b>'
                                + '<br>Great! Just click the &quot;Connect&quot; button below.'
        },
        {   identifier: 'visitcounter',
            shortDescription: 'Find out how often and when you visit popular websites or others that you choose to track with this Chrome browser extension',
            longDescription: 'Visit Counter gives you amazing insights into your browsing behaviour. Find out which websites you visit most and when you visit them.'
                                + '<br>Visit Counter is developed by 1self. It will only log visits to the websites that you want logged and will entirely ignore all others.',
            instructions: 'Simply click the &quot;Connect&quot; button below to be taken to the Chrome web store where you can download and install the extension.'
        },
        {   identifier: 'github',
            shortDescription: 'Your coding activity visualized. See which hours of which days you&apos;re most active. Correlate your pushes with your IDE activity.',
            longDescription: 'Visit Counter gives you amazing insights into your browsing behaviour. Find out which websites you visit most and when you visit them.'
                                + '<br>Visit Counter is developed by 1self. It will only log visits to the websites that you want logged and will entirely ignore all others.',
            instructions: 'Simply click the &quot;Connect&quot; button below to be taken to the Chrome web store where you can download and install the extension.'
        }
    ];

    for (var i = 0; i < descriptions.length; i++) {
        if (descriptions[i].identifier === serviceIdentifier) {
            returnDesc = descriptions[i];
            break;
        }
    }

    if (!returnDesc) {
        returnDesc = {
            identifier: serviceIdentifier,
            shortDescription: "blah blah " + serviceIdentifier + " shortDescription",
            longDescription: "blah blah " + serviceIdentifier + "  longDescription. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus lorem et mollis tempus. Vivamus at semper augue.. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus lorem et mollis tempus. Vivamus at semper augue.. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus lorem et mollis tempus. Vivamus at semper augue.",
            instructions: "default instructions"
        };
    }

    return returnDesc;
}





