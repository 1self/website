function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function stripHash(stringToStrip) {
    return stringToStrip.replace('#', '');
}

function stripAtDetail(stringToStrip) {
    stringArr = stringToStrip.split(' at ');
    return stringArr[0];
}

function slideLeft(eventElement) {
    var $cardBackContainer = $(eventElement).parent().parent();
    $cardBackContainer.find('.cardBack-1').addClass('slideOutLeft');
    $cardBackContainer.find('.cardBack-2').addClass('slideInLeft');
}

function slideRight(eventElement) {
    var $cardBackContainer = $(eventElement).parent().parent().parent();
    $cardBackContainer.find('.cardBack-1').removeClass('slideOutLeft');
    $cardBackContainer.find('.cardBack-2').removeClass('slideInLeft');
}

// $('.cardBack-2').ready(function() {
//     var $cardBacks = $('.cardBack-2');
//     for (var i in $cardBacks) { 
//         $cardBacks[i].position().left = $('.stack').width() + $('.stack').position().left;
//     }
// });

var deferred = $.Deferred();

var offline = false;

if (offline) {
    var data = [ /*{"id":"55795df83049b6306d2543db","type":"date","generatedDate":"2015-06-11T10:07:52.837Z"},*/ {
        "id": "55795df83049b6306d2543dc",
        "type": "top10",
        "thumbnailMedia": "chart.html",
        "startRange": "2015-06-10",
        "endRange": "2015-06-10",
        "objectTags": ["computer", "git", "github", "software", "source control"],
        "actionTags": ["commit"],
        "position": 48,
        "properties": {
            "line-additions": 104
        },
        "generatedDate": "2015-06-11T10:07:52.880Z",
        "chart": "/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/line-additions/.json"
    }, {
        "id": "55795df83049b6306d2543dd",
        "type": "top10",
        "thumbnailMedia": "chart.html",
        "startRange": "2015-06-10",
        "endRange": "2015-06-10",
        "objectTags": ["computer", "git", "github", "software", "source control"],
        "actionTags": ["commit"],
        "position": 44,
        "properties": {
            "line-changes": 196
        },
        "generatedDate": "2015-06-11T10:07:52.894Z",
        "chart": "/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/line-changes/.json"
    }, {
        "id": "55795df83049b6306d2543de",
        "type": "top10",
        "thumbnailMedia": "chart.html",
        "startRange": "2015-06-10",
        "endRange": "2015-06-10",
        "objectTags": ["computer", "git", "github", "software", "source control"],
        "actionTags": ["commit"],
        "position": 29,
        "properties": {
            "line-deletions": 92
        },
        "generatedDate": "2015-06-11T10:07:52.907Z",
        "chart": "/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/line-deletions/.json"
    }, {
        "id": "55795df83049b6306d2543df",
        "type": "top10",
        "thumbnailMedia": "chart.html",
        "startRange": "2015-06-10",
        "endRange": "2015-06-10",
        "objectTags": ["computer", "control", "software", "source"],
        "actionTags": ["github", "push"],
        "position": 21,
        "properties": {
            "pushId": 2072678999
        },
        "generatedDate": "2015-06-11T10:07:52.913Z",
        "chart": "/v1/users/ed/rollups/day/computer,control,software,source/github,push/sum/pushId/.json"
    }, {
        "id": "55795df83049b6306d2543e0",
        "type": "top10",
        "thumbnailMedia": "chart.html",
        "startRange": "2015-06-10",
        "endRange": "2015-06-10",
        "objectTags": ["computer", "git", "github", "software", "source control"],
        "actionTags": ["commit"],
        "position": 24,
        "properties": {
            "pushId": 4145353520
        },
        "generatedDate": "2015-06-11T10:07:52.926Z",
        "chart": "/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/pushId/.json"
    }, {
        "id": "55795df83049b6306d2543e1",
        "type": "top10",
        "thumbnailMedia": "chart.html",
        "startRange": "2015-06-10",
        "endRange": "2015-06-10",
        "objectTags": ["computer", "git", "github", "software", "source control"],
        "actionTags": ["commit"],
        "position": 31,
        "properties": {
            "file-changes": 14
        },
        "generatedDate": "2015-06-11T10:07:52.939Z",
        "chart": "/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/file-changes/.json"
    }];
    deferred.resolve(data);
} else {
    // Get the ajax requests out of the way early because they
    // are typically longest to complete
     
    var username = getQSParam().user;
    if (!username) username = "ed";

    $.getJSON('https://api-staging.1self.co/v1/users/' + username + '/cards',
            function() {
                console.log("accessed api for cards");
            })
        .done(function(data) {

            console.log('card data', data);
            window.cardData = data;
            deferred.resolve(data);
        })
        .fail(function(data) {
            console.log('error getting cards', data);

        });
}

$(function() {
    var stack;

    var getColour = function(idx) {
        var colourArray = ['#dd2649', '#00a2d4', '#e93d31', '#f2ae1c', '#61b346', '#cf4b9a', '#367ec0', '#00ad87'];
        return colourArray[idx % colourArray.length];
    };

    var dateRangetext = function(startRange, endRange) {
        var rangeText;
        var now = moment();

        if (startRange === endRange) {
            // single moment
            startRange = moment(startRange);
            rangeText = startRange.calendar(); //'Yesterday';
        } else {
            // range of time
            startRange = moment(startRange);
            endRange = moment(endRange);
            rangeText = startRange.format('lll') + ' - ' + endRange.format('lll');
        }

        return rangeText;
    };

    var displayTags = function(tagArray) {
        var returnString = '';

        for (var i in tagArray) {
            returnString += tagArray[i] + " ";
        }

        return returnString.trim();
    };

    String.prototype.supplant = function(o) {
        return this.replace(
            /\{\{([^{}]*)\}\}/g,
            function(a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };

    var createComparitorText = function(position, type) {
        var comparitorText = '';

        comparitorText = (type === "top10" ? "most" : "fewest");

        var positionText = '';

        if (position > 0) {
            position = (position + 1) + '';
            if (position.length > 1 && (position.substring(position.length - 2) === '11' || position.substring(position.length - 2) === '12' || position.substring(position.length - 2) === '13'))
                positionText = position + "th ";

            else if (position.charAt(position.length - 1) === '1')
                positionText = position + "st ";
            
            else if (position.charAt(position.length - 1) === '2')
                positionText = position + "nd ";
            
            else if (position.charAt(position.length - 1) === '3')
                positionText = position + "rd ";
            
            else
                positionText = position + "th ";
        }

        comparitorText = positionText + comparitorText;
    
        return comparitorText;
    };

    var pluralise = function(stringArray) {
        var toReturn = [];
        for (var i in stringArray) {
            var plural;
            if (stringArray[i] === "push")
                plural = "es";
            else
                plural = "s";
            toReturn.push(stringArray[i] + plural);
        }
        return toReturn;
    };

    var pastParticiple = function(stringArray) {
        var toReturn = [];
        for (var i in stringArray) {
            var pp;
            if (stringArray[i] === "commit")
                pp = "ted";
            else
                pp = "s";
            toReturn.push(stringArray[i] + pp);
        }
        return toReturn;
    };

    var unhyphenate = function(toUnhyphenate) {
        return toUnhyphenate.replace('-', ' ');
    };

    // "properties": {
    //     "sum": {
    //         "artist-name": {
    //             "John Talabot": {
    //                 "#": 1
    //             }
    //         }
    //     }
    // }


    var buildPropertiesText = function(propertiesObject) {
        var returnString = '';
        var objectKey = Object.keys(propertiesObject)[0];
        var counter = 0;

        while (objectKey && objectKey !== "#" && counter < 3) {
            returnString += unhyphenate(objectKey);
            propertiesObject = propertiesObject[objectKey];
            objectKey = Object.keys(propertiesObject)[0];
            if (objectKey && objectKey !== "#") {
                returnString += ": ";
            }
            counter++;
        }

        return returnString;
    };

    // TODO: add cards from big list
    // Fix manual dragging
    // Sort out charts

    var createCardText = function(cardData) {
        if (!cardData.cardText) {
            var cardText = '';

            if (cardData.type === "top10" || cardData.type === "bottom10") {
                var template1 = '<b>{{eventDate}}</b><br>Your {{comparitor}} {{action_pl}} in {{eventPeriod}} {{comparisonPeriod}}'; // e.g. [Yesterday]: your [fewest] [commit]s in [a day] [ever]
                var template2 = '<b>{{eventDate}}</b><br>Your {{comparitor}} {{action_pp}} {{property}} in {{eventPeriod}} {{comparisonPeriod}}'; // [Yesterday]: your [most] [commit]ted [file changes] in [a day] [ever]
                var template3 = '<b>{{eventDate}}</b><br>Your {{comparitor}} {{objects}} {{action_pl}} in {{eventPeriod}} {{comparisonPeriod}}'; // [Yesterday]: your [fewest] [music track] [listen]s in [a day] [ever]
                var template4 = '<b>{{eventDate}}</b><br>Your {{comparitor}} {{action_pl}} to {{property}} in {{eventPeriod}} {{comparisonPeriod}}'; // [Yesterday]: your [6th] [fewest] [listen]s [to Royksopp] in [a day] [ever]

                var supplantObject = {
                    eventDate: stripAtDetail(dateRangetext(cardData.startRange, cardData.endRange)),
                    comparitor: createComparitorText(cardData.position, cardData.type),
                    eventPeriod: "a day",
                    comparisonPeriod: "ever"
                };

                if (cardData.actionTags[0] === "commit" || cardData.actionTags[1] === "push") {
                    if (cardData.properties.sum['#']) {
                        supplantObject.action_pl = displayTags(pluralise(cardData.actionTags));
                        cardText = template1.supplant(supplantObject);
                    } else {
                        supplantObject.action_pp = displayTags(pastParticiple(cardData.actionTags));
                        supplantObject.property = buildPropertiesText(cardData.properties.sum);
                        cardText = template2.supplant(supplantObject);
                    }
                } else if (cardData.actionTags[0] === "listen") {
                    if (cardData.properties.sum['#']) {
                        supplantObject.action_pl = displayTags(pluralise(cardData.actionTags));
                        supplantObject.objects = displayTags(cardData.objectTags);
                        cardText = template3.supplant(supplantObject);
                    } else {
                        supplantObject.action_pl = displayTags(pluralise(cardData.actionTags));
                        supplantObject.property = buildPropertiesText(cardData.properties.sum);
                        cardText = template4.supplant(supplantObject);
                    }
                }

                cardText = cardText.supplant(supplantObject);
            }

            if (cardText === '') cardText = "Couldn't create friendly message";
            cardData.cardText = cardText;
        }
    };

    var flipButtonTemplate = [
        , '  <div class="share-button" style="background-color: {{colour}};">'
        , '    <div class="icon-button"><i class="fa fa-share-alt fa-2x"></i></div>'
        , '  </div>'
        , '  <div class="flip-toggle" style="background-color: {{colour}};">'
        , '    <div class="icon-button icon-{{action}}"><img src="img/{{action}}-icon.png" /></div>'
        , '  </div>'
    ].join('');

    // var shareButtonTemplate = [
    // ].join('');

    var cardBackContentTemplate = [
        , '<div class="cardBack-1">'
        , '  <div class="cardHeader" style="background-color: {{colour}};"><p>{{headerText}}</p></div>'
        , '  <div class="cardBackMain">big chart goes here</div>'
        , '  <div class="cardBackAction" onclick="slideLeft(this)"><div class="actionText">Explore &gt;</div></div>'
        , '</div>'
        , '<div class="cardBack-2">'
        , '  <div class="cardHeader" style="background-color: {{colour}};"><p class="backButton" onclick="slideRight(this)">{{headerText2}}</p></div>'
        , '  <div class="cardBackMain">Next bit of info goes here</div>'
        , '</div>'
        , '{{shareContainer}}'
    ].join('');

    var shareContainerTemplate = [
        , '<div class="share-container {{shareContainerClasses}} hide" style="background-color: {{colour}};">'
        , '  <div class="social-share-button"><div class="innerButton">Share to Twitter</div></div>'
        , '  <div class="social-share-button"><div class="innerButton">Share to Facebook</div></div>'
        , '</div>'
    ].join('');


    var buildCardHtml = function(cardData, colourIndex) {

        // function cardHtml(template, supplantObject, overrides) {
        //     return template.supplant({
        //         cardContent: htmlTemplate.supplant($.extend({
        //             flipButton: flipButtonTemplate.supplant({
        //                 colour: overrides.colour || supplantObject.colour,
        //                 action: "more"
        //             })
        //         }, supplantObject, overrides))
        //     });
        // }

        var generatedDate = moment(cardData.generatedDate);
        cardData.colourIndex = colourIndex;

        var colour = getColour(colourIndex);
        var supplantObject = {
            headerText: '',
            cardNavText: '',
            colour: colour,
            colourIndex: colourIndex,
        };


        var html = '<input id="hidCard_{{id}}" class="cardData" type="hidden" value="{{inputValue}}" />';
        html += '<div class="cardContainer cardContainer-front">{{cardFrontContent}}</div>';
        html += '<div class="cardContainer cardContainer-back">';
        html += '  {{cardBackContent}}';
        html += '{{cardNav}}</div>';

        html = html.supplant({
            id: cardData.id,
            inputValue: encodeURIComponent(JSON.stringify(cardData)),
            cardBackContent: cardBackContentTemplate.supplant({
                colour: colour,
                headerText: 'testy',
                headerText2: '&lt; back',
                shareContainer: shareContainerTemplate.supplant({
                    colour: colour,
                    shareContainerClasses: 'share-container-back'
                })
            }),
            cardNav: flipButtonTemplate.supplant({
                colour: colour,
                action: 'close'
            })
        });

        switch (cardData.type) {
            case 'date':
                var dateNow = stripAtDetail(generatedDate.calendar());

                html = html.supplant({
                    cardFrontContent: '<div class="cardFullText" style="background-color: {{colour}};"><p>{{dateNow}}</p></div>'.supplant({
                        dateNow: dateNow,
                        colour: colour
                    })
                });
                break;
            case 'top10':

                createCardText(cardData);

                var frontContent = [
                    , '<div class="cardHeader" style="background-color: {{colour}};"><p>{{headerText}}</p></div>'
                    , '<div class="cardContentContainer"><div class="cardMedia"></div><div class="cardText"><p>{{data}}</p></div></div>'
                    , '{{shareContainer}}'
                    , '<div class="cardNav" style="background-color: {{colour}};">'
                    , '  <p>{{cardNavText}}</p>'
                    , '  {{flipButton}}'
                    , '</div>'
                ].join('');

                html = html.supplant({
                    cardFrontContent: frontContent.supplant({
                        data: cardData.cardText || 'undefined',
                        flipButton: flipButtonTemplate.supplant({
                            colour: colour,
                            action: "more"
                        }),
                        cardNavText: "",
                        colour: colour,
                        headerText: 'Top 10: ' + createComparitorText(cardData.position, cardData.type) + ' out of xxx',
                        shareContainer: shareContainerTemplate.supplant({
                            colour: colour,
                            shareContainerClasses: 'share-container-front'
                        })
                    })
                });
                break;
            case 'bottom10':

                createCardText(cardData);

                var frontContent = [
                    , '<div class="cardHeader" style="background-color: {{colour}};"><p>{{headerText}}</p></div>'
                    , '<div class="cardContentContainer"><div class="cardMedia"></div><div class="cardText"><p>{{data}}</p></div></div>'
                    , '{{shareContainer}}'
                    , '<div class="cardNav" style="background-color: {{colour}};">'
                    , '  <p>{{cardNavText}}</p>'
                    , '  {{flipButton}}'
                    , '</div>'
                ].join('');

                html = html.supplant({
                    cardFrontContent: frontContent.supplant({
                        data: cardData.cardText || 'undefined',
                        flipButton: flipButtonTemplate.supplant({
                            colour: colour,
                            action: "more"
                        }),
                        cardNavText: "",
                        colour: colour,
                        headerText: 'Bottom 10: ' + createComparitorText(cardData.position, cardData.type) + ' of xxx',
                        shareContainer: shareContainerTemplate.supplant({
                            colour: colour,
                            shareContainerClasses: 'share-container-front'
                        })
                    })
                });
                break;
        }
        return html;
    };

    var renderThumbnailMedia = function(cardLi) {
        // console.log('renderThumbnailMedia', cardLi);
        var cardData = $(cardLi).find('.cardData');
        cardData = decodeURIComponent(cardData.val());
        cardData = JSON.parse(cardData);
        // console.log('cardDataJSON', cardData);

        if (cardData.thumbnailMedia) {
            // console.log('rendering thumbnailMedia', cardData);
            var $cardMedia = $(cardLi).find('.cardMedia');
            $cardMedia.empty();
            var iFrameHtml = '<iframe class="thumbnailFrame" src="' + cardData.thumbnailMedia;
            iFrameHtml += '?lineColour=' + stripHash(getColour(cardData.colourIndex));
            iFrameHtml += '&dataSrc=' + cardData.chart + '" ';
            iFrameHtml += 'scrolling="no"></iframe>';
            $cardMedia.append(iFrameHtml);
        }
    };

    var discardPile = [];
    var $cardList = null;
    var addedCardsCount = 0;
    var cardsArrayGlobal;

    var buildStack = function(stack) {
        var numberOfCardsToShow = 10;
        var skip = 0;
        deferred.done(function(cardsArray) {
            cardsArrayGlobal = cardsArray;
            if (numberOfCardsToShow > cardsArray.length) {
                numberOfCardsToShow = cardsArray.length;
            }
            var lastLi = null;
            for (var i = numberOfCardsToShow + skip - 1; i >= skip; i--) {
                var element = cardsArray[i];
                var li = document.createElement('li');
                li.innerHTML = buildCardHtml(element, i);
                var $card = $(li).find('.cardContainer');
                $card.css({
                    'border-color': getColour(i)
                });
                $(li).attr('id', 'card_' + i);
                $(li).attr('cardId', element.id);
                $('.stack').append(li);
                stack.createCard(li);
                lastLi = li;
                if (i === skip) {
                    renderThumbnailMedia(li);
                }
                addedCardsCount++;
            }
            markCardUnique($('.stack li:last')[0], 'topOfMain');

            $cardList = $('.stack li');
            var $stack = $('.stack');

            $stack.on('mouseup', 'li', function(e) {
                var id = '#' + this.id;
                var idx = discardPile.indexOf(id);
                if (idx > -1) {
                    moveToLast(discardPile, idx);
                    markCardUnique($(id), 'topOfDiscard');
                }
            });

            $stack.on('click', '.flip-toggle', function(e) {
                var $container = $(this).parents('.cardContainer');
                $container.toggleClass('flip');
                $container.siblings().toggleClass('flip');
            });

            $stack.on('click', '.share-button', function(e) {
                var $container = $(this).parents('.cardContainer');
                $container.find('.share-container').toggleClass('hide');
            });
        });
    };

    var stackConfig = {
        throwOutConfidence: function(offset, element) {
            console.log('offset and element', offset, element.offsetWidth);
            console.log(Math.min(Math.abs(offset + 150) / element.offsetWidth, 1));
            return Math.min(Math.abs(offset + 150) / element.offsetWidth, 1);
        }
    };

    stack = gajus.Swing.Stack(stackConfig);

    function bringToTop(cardEl) {
        var $cardEl = $(cardEl);
        var cardElId = $cardEl.attr('id');
        var $cardUl = $cardEl.parent();
        $cardEl.detach();
        $cardUl.append(cardEl);
    }

    function moveToLast(arr, idx) {
        var lastIdx = arr.length - 1;
        var len = arr.length;
        var val = null;
        if (idx !== lastIdx) {
            val = arr[idx];
            for (var i = idx; i < len; ++i) {
                arr[i] = arr[i + 1];
            }
            arr[lastIdx] = val;
        }
    }

    stack.throwInLast = function() {
        var cardLi = $('.stack .topOfDiscard')[0];
        bringToTop(cardLi);
        var val = '#' + cardLi.id;
        var idx = discardPile.indexOf(val);
        var card = stack.getCard(cardLi);
        card.throwIn(cardLi.thrownX, cardLi.thrownY);
    };

    stack.throwOutNext = function() {
        var cardLi = $('.stack .topOfMain')[0];
        bringToTop(cardLi);
        var card = stack.getCard(cardLi);
        cardLi.thrownY = getRandomInt(-100, 100);
        cardLi.thrownX = 1;
        card.throwOut(cardLi.thrownX, cardLi.thrownY);
    };

    window.stack = stack;
    buildStack(stack);

    function markCardUnique(cardEl, label) {
        $('.stack li').removeClass(label);
        if (cardEl !== undefined) {
            // console.log('marking card', cardEl.id, label, cardEl);
            $(cardEl).addClass(label);
        }
    }

    stack.on('throwout', function(e) {
        markCardUnique($('.stack .topOfMain')[0], 'topOfMain');
        markCardUnique(e.target, 'topOfDiscard');
        discardPile.push('#' + e.target.id);
        var cardsOnDiscard = discardPile.length;
        markCardUnique($cardList[$cardList.length - 1 - cardsOnDiscard], 'topOfMain');
        renderThumbnailMedia($cardList[$cardList.length - 1 - cardsOnDiscard]);
        e.target.classList.remove('in-deck');
        console.log('thrown out', e.target.id, discardPile);
    });

    stack.on('throwin', function(e) {
        discardPile.pop();
        var cardEl = $(discardPile[discardPile.length - 1])[0];
        markCardUnique(e.target, 'topOfMain');
        markCardUnique(cardEl, 'topOfDiscard');

        e.target.classList.add('in-deck');
        console.log('thrown in', e.target.id, discardPile);
    });

});
