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

var deferred = $.Deferred();


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
      , '    <div class="icon"><img src="img/{{action}}-icon.png" /></div>'
      , '  </div>'
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


        var html = '<input id="hidCard_{{id}}" class="cardData" type="hidden" value="{{inputValue}}" /><div class="cardContainer cardContainer-front">{{cardContent}}</div><div class="cardContainer cardContainer-back">test{{cardNav}}</div>'.supplant({
            id: cardData.id,
            inputValue: encodeURIComponent(JSON.stringify(cardData)),
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
                        cardContent: '<div class="cardMedia"></div><div class="cardText"><p>{{data}}</p></div>'.supplant({data: cardData.cardText || 'undefined'})
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
        console.log('renderThumbnailMedia', cardLi);
        var cardData = $(cardLi).find('.cardData');
        cardData = decodeURIComponent(cardData.val());
        cardData = JSON.parse(cardData);
        console.log('cardDataJSON', cardData);

        if (cardData.thumbnailMedia) {
            console.log('rendering thumbnailMedia', cardData);
            var $cardMedia = $(cardLi).find('.cardMedia');
            $cardMedia.empty();
            var iFrameHtml = '<iframe class="thumbnailFrame" src="' + cardData.thumbnailMedia;
            iFrameHtml += '?lineColour=' + stripHash(getColour(cardData.colourIndex));
            iFrameHtml += '&dataSrc=' + cardData.chart + '" ';
            iFrameHtml += 'scrolling="no"></iframe>';
            $cardMedia.append(iFrameHtml);
        }
    };

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
            });
            markCardUnique($('.stack li:last')[0], 'topOfMain');

            $cardList = $('.stack li');

            $cardList.on('mousedown', function(e) {
                var id = '#' + this.id;
                var idx = discardPile.indexOf(id);
                if (idx > -1) {
                    moveToLast(discardPile, idx);
                    markCardUnique($(id), 'topOfDiscard');
                }
            });

            $('.nav-toggle').on('click', function(e) {
                var $container = $(this).parents('.cardContainer');
                $container.toggleClass('flip');
                $container.siblings().toggleClass('flip');
            });
        });
    };

    stack = gajus.Swing.Stack();

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
            console.log('marking card', cardEl.id, label, cardEl);
            $(cardEl).addClass(label);
        }
    }
    
    var discardPile = [];
    var $cardList = null;

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
        var cardEl = $(discardPile[discardPile.length -1])[0];
        markCardUnique(e.target, 'topOfMain');
        markCardUnique(cardEl, 'topOfDiscard');

        e.target.classList.add('in-deck');
        console.log('thrown in', e.target.id, discardPile);
    });

});
