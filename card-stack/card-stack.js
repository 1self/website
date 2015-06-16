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

var deferred = $.Deferred();

var offline = true;


if (offline) {
    var data = [/*{"id":"55795df83049b6306d2543db","type":"date","generatedDate":"2015-06-11T10:07:52.837Z"},*/{"id":"55795df83049b6306d2543dc","type":"top10","thumbnailMedia":"chart.html","startRange":"2015-06-10","endRange":"2015-06-10","objectTags":["computer","git","github","software","source control"],"actionTags":["commit"],"position":48,"properties":{"line-additions":104},"generatedDate":"2015-06-11T10:07:52.880Z","chart":"/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/line-additions/.json"},{"id":"55795df83049b6306d2543dd","type":"top10","thumbnailMedia":"chart.html","startRange":"2015-06-10","endRange":"2015-06-10","objectTags":["computer","git","github","software","source control"],"actionTags":["commit"],"position":44,"properties":{"line-changes":196},"generatedDate":"2015-06-11T10:07:52.894Z","chart":"/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/line-changes/.json"},{"id":"55795df83049b6306d2543de","type":"top10","thumbnailMedia":"chart.html","startRange":"2015-06-10","endRange":"2015-06-10","objectTags":["computer","git","github","software","source control"],"actionTags":["commit"],"position":29,"properties":{"line-deletions":92},"generatedDate":"2015-06-11T10:07:52.907Z","chart":"/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/line-deletions/.json"},{"id":"55795df83049b6306d2543df","type":"top10","thumbnailMedia":"chart.html","startRange":"2015-06-10","endRange":"2015-06-10","objectTags":["computer","control","software","source"],"actionTags":["github","push"],"position":21,"properties":{"pushId":2072678999},"generatedDate":"2015-06-11T10:07:52.913Z","chart":"/v1/users/ed/rollups/day/computer,control,software,source/github,push/sum/pushId/.json"},{"id":"55795df83049b6306d2543e0","type":"top10","thumbnailMedia":"chart.html","startRange":"2015-06-10","endRange":"2015-06-10","objectTags":["computer","git","github","software","source control"],"actionTags":["commit"],"position":24,"properties":{"pushId":4145353520},"generatedDate":"2015-06-11T10:07:52.926Z","chart":"/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/pushId/.json"},{"id":"55795df83049b6306d2543e1","type":"top10","thumbnailMedia":"chart.html","startRange":"2015-06-10","endRange":"2015-06-10","objectTags":["computer","git","github","software","source control"],"actionTags":["commit"],"position":31,"properties":{"file-changes":14},"generatedDate":"2015-06-11T10:07:52.939Z","chart":"/v1/users/ed/rollups/day/computer,git,github,software,source control/commit/sum/file-changes/.json"}];
    deferred.resolve(data);
} else {
// Get the ajax requests out of the way early because they
// are typically longest to complete
    $.getJSON('https://api-staging.1self.co/v1/users/ed/cards',
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

        return returnString;
    };

    var createCardText = function(cardData, type) {
        if (!cardData.cardText) {
            var cardText = '';
            switch (cardData.type) {
                case 'top10':
                    switch (cardData.position) {
                        case (0):
                            cardText += "Highest";
                            break;
                        case (1):
                            cardText += (cardData.position + 1) + "nd highest";
                            break;
                        case (2):
                            cardText += (cardData.position + 1) + "rd highest";
                            break;
                        default:
                            cardText += (cardData.position + 1) + "th highest";
                    }
                    cardText += " <i>" + displayTags(cardData.actionTags) + "</i> on <i>" + displayTags(cardData.objectTags) + '</i>';
                    break;
            }
            cardData.cardText = cardText;
        }
    };

    String.prototype.supplant = function (o) {
        return this.replace(
            /\{\{([^{}]*)\}\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };

    var htmlTemplate = [
        '<div class="cardHeader" style="background-color: {{colour}};"><p>{{headerText}}</p></div>'
      , '{{cardContent}}'
      , '<div class="cardNav" style="background-color: {{colour}};">'
      , '  <p>{{cardNavText}}</p>'
      , '  {{navButton}}'
      , '</div>'
    ].join('');
    
    var navTemplate = [
        '  <div class="nav-toggle" style="background-color: {{colour}};">'
      , '    <div class="icon icon-{{action}}"><img src="img/{{action}}-icon.png" /></div>'
      , '  </div>'
    ].join('');

    var cardBackContentTemplate = [
      , '<div class="cardBack-1">'
      , '  <div class="cardHeader" style="background-color: {{colour}};"><p>{{headerText}}</p></div>'
      , '  <div class="cardBackMain">big chart goes here</div>'
      , '  <div class="cardBackAction" onclick="slideLeft(this)"><p class="actionText">Explore &gt;</p></div>'
      , '</div>'
      , '<div class="cardBack-2">'
      , '  <div class="cardHeader" style="background-color: {{colour}};"><p class="backButton" onclick="slideRight(this)">{{headerText2}}</p></div>'
      , '  <div class="cardBackMain">Next bit of info goes here</div>'
      , '</div>'
    ].join('');

    
    var buildCardHtml = function(cardData, colourIndex) {

        function cardHtml(template, supplantObject, overrides) {
            return template.supplant({
                cardContent: htmlTemplate.supplant($.extend({
                    navButton: navTemplate.supplant({
                        colour: overrides.colour || supplantObject.colour,
                        action: "more"
                    })
                }, supplantObject, overrides))
            });
        }

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
            html += '<div class="cardContainer cardContainer-front">{{cardContent}}</div>';
            html += '<div class="cardContainer cardContainer-back">';
            html += '  {{cardBackContent}}';
            html += '{{cardNav}}</div>';

            html = html.supplant({
                id: cardData.id,
                inputValue: encodeURIComponent(JSON.stringify(cardData)),
                cardBackContent: cardBackContentTemplate.supplant({
                    colour: colour,
                    headerText: 'testy',
                    headerText2: '&lt; back'
                }),
                cardNav: navTemplate.supplant({
                    colour: colour,
                    action: 'close'
                })
            });


        switch (cardData.type) {
            case 'date':
                var dateNow = stripAtDetail(generatedDate.calendar());
                    
                html = cardHtml(html, supplantObject, {
                        cardContent: '<div class="cardFullText" style="background-color: {{colour}};"><p>{{dateNow}}</p></div>'.supplant({dateNow: dateNow, colour: colour})
                    });
                break;
            case 'top10':
                createCardText(cardData);
                html = cardHtml(html, supplantObject, {
                        headerText: dateRangetext(cardData.startRange, cardData.endRange),
                        cardContent: '<div class="cardContentContainer"><div class="cardMedia"></div><div class="cardText"><p>{{data}}</p></div></div>'.supplant({data: cardData.cardText || 'undefined'})
                    });
                break;
            default:
                html = cardHtml(html, supplantObject, {
                    headerText: dateRangetext(cardData.startRange, cardData.endRange),
                    cardNavText: 'Created: ' + generatedDate.format('lll'),
                    cardContent: '<div class="cardMedia"><iframe class="thumbnailFrame" src="{thumbnailUrl}" scrolling="no"></iframe></div><div class="cardText"><p>{data}</p></div>'.supplant({
                        thumbnailUrl: cardData.thumbnailMedia,
                        data: cardData.cardText || 'undefined'
                    })
                });
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

    var buildStack = function(stack) {
        deferred.done(function(cardsArray) {
            cardsArray.reverse();
            var lastLi = null;
            cardsArray.forEach(function(element, index, array) {
                var colourIndex = index;
                var li = document.createElement('li');
                li.innerHTML = buildCardHtml(element, colourIndex);
                var $card = $(li).find('.cardContainer');
                $card.css({
                    'border-color': getColour(colourIndex)
                });
                $(li).attr('id', 'card_' + index);
                $('.stack').append(li);
                stack.createCard(li);
                lastLi = li;
                renderThumbnailMedia(li);
            });
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

            $stack.on('mouseup', '.nav-toggle', function(e) {
                var $container = $(this).parents('.cardContainer');
                $container.toggleClass('flip');
                $container.siblings().toggleClass('flip');
            });
        });
    };

    var stackConfig = {
        throwOutConfidence: function (offset, element) {
            console.log('offset and element', offset, element.offsetWidth);
            console.log(Math.min(Math.abs(offset + 75) / element.offsetWidth, 1));
            return Math.min(Math.abs(offset + 75) / element.offsetWidth, 1);
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
        var lastIdx = arr.length -1;
        var len = arr.length;
        var val = null;
        if (idx !== lastIdx) {
            val = arr[idx];
            for (var i = idx; i < len; ++i) {
                arr[i] = arr[i+1];
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
        e.target.classList.remove('in-deck');
        console.log('thrown out', e.target.id, discardPile);
    });

    stack.on('throwin', function(e) {
        discardPile.pop();
        var cardEl = $(discardPile[discardPile.length -1])[0];
        markCardUnique(e.target, 'topOfMain');
        markCardUnique(cardEl, 'topOfDiscard');

        e.target.classList.add('in-deck');
        console.log('thrown in', e.target.id, discardPile);
    });

});
