function toggleOverlay(navElement, colourIndex) {
    var overlayContainer = $(navElement).parent().parent();
    overlayContainer.toggleClass("nav-open nav-open-" + colourIndex);
    var cardBackContainer = overlayContainer.children('.cardBackContainer');
    cardBackContainer.toggleClass("hide fadeIn");
    console.log(cardBackContainer);
}

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

document.addEventListener('DOMContentLoaded', function() {
    var stack;

    var getColour = function(idx) {
        var colourArray = ['#dd2649', '#00a2d4', '#e93d31', '#f2ae1c', '#61b346', '#cf4b9a', '#367ec0', '#00ad87'];
        return colourArray[idx % colourArray.length];
    };

    var getCards = function(callback) {

        var apiURL = 'http://api-staging.1self.co/v1/users/ed/cards';
        var jqxhr = $.getJSON(apiURL,
                function() {
                    console.log("accessed api for cards");
                })
            .done(function(data) {

                console.log('card data', data);
                callback(data);
            })
            .fail(function(data) {
                console.log('error getting cards', data);

            });
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


    var buildCardHtml = function(cardData, colourIndex) {

        var generatedDate = moment(cardData.generatedDate);
        cardData.colourIndex = colourIndex;

        var html = '<input id="hidCard_' + cardData.id + '" class="cardData" type="hidden" value="' + encodeURIComponent(JSON.stringify(cardData)) + '">';
        html += '<div class="cardContainer">';

        switch (cardData.type) {
            case 'date':
                html += '<div class="cardHeader" style="background-color: ' + getColour(colourIndex) + ';"><p></p></div>';
                html += '<div class="cardBackContainer hide">test</div>';
                html += '<div class="cardFullText" style="background-color: ' + getColour(colourIndex) + ';"><p>' + stripAtDetail(generatedDate.calendar()) + '</p></div>';
                html += '<div class="cardNav" style="background-color: ' + getColour(colourIndex) + ';"><p></p>';
                html += '<div class="nav-toggle" style="background-color: ' + getColour(colourIndex) + ';" onclick="toggleOverlay(this,' + colourIndex + ');">';
                html += '<div class="icon"><img src="img/more-icon.png"></div></div>';
                html += '</div>';
                break;
            case 'top10':

                createCardText(cardData);

                html += '<div class="cardHeader" style="background-color: ' + getColour(colourIndex) + ';"><p>' + dateRangetext(cardData.startRange, cardData.endRange) + '</p></div>';
                html += '<div class="cardBackContainer hide">test</div>';
                html += '<div class="cardMedia"></div>';
                html += '<div class="cardText"><p>' + cardData.cardText + '</p></div>';
                html += '<div class="cardNav" style="background-color: ' + getColour(colourIndex) + ';"><p>Created: ' + generatedDate.format('lll') + '</p>';
                html += '<div class="nav-toggle" style="background-color: ' + getColour(colourIndex) + ';" onclick="toggleOverlay(this,' + colourIndex + ');">';
                html += '<div class="icon"><img src="img/more-icon.png"></div></div>';
                html += '</div>';
                break;
            default:
                html += '<div class="cardHeader" style="background-color: ' + getColour(colourIndex) + ';"><p>' + dateRangetext(cardData.startRange, cardData.endRange) + '</p></div>';
                html += '<div class="cardBackContainer hide">test</div>';
                html += '<div class="cardMedia"><iframe class="thumbnailFrame" src="' + cardData.thumbnailMedia + '" scrolling="no"></iframe></div>';
                html += '<div class="cardText"><p>' + cardData.cardText + '</p></div>';
                html += '<div class="cardNav" style="background-color: ' + getColour(colourIndex) + ';"><p>Created: ' + generatedDate.format('lll') + '</p>';
                html += '<div class="nav-toggle" style="background-color: ' + getColour(colourIndex) + ';" onclick="toggleOverlay(this,' + colourIndex + ');">';
                html += '<div class="icon"><img src="img/more-icon.png"></div></div>';
                html += '</div>';
        }
        html += '</div>';
        return html;
    };

    var renderThumbnailMedia = function(cardLi) {
        var cardData = $(cardLi).find('.cardData');
        cardData = decodeURIComponent(cardData.val());
        cardData = JSON.parse(cardData);

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
        getCards(function(cardsArray) {
            if (cardsArray.length === 0) {
                $('.buttonsRow').hide();
            } else {
                $('.buttonsRow').show();
                $('.stackBase div').empty();
                $('.stackBase div').text('All done');
                cardsArray.reverse();
                var lastLi = null;
                cardsArray.forEach(function(element, index, array) {
                    var colourIndex = index;
                    var li = document.createElement('li');
                    li.innerHTML = buildCardHtml(element, colourIndex);
                    $(li).css({
                        'border-color': getColour(colourIndex),
                        'overflow': 'hidden'
                    });
                    $(li).attr('id', 'card_' + index);
                    $('.stack').append(li);
                    stack.createCard(li);
                    lastLi = li;
                });
                markCardUnique($('.stack li:last')[0], 'topOfMain');
                deckComplete();
            }
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
    }

    stack.throwOutNext = function() {
        var cardLi = $('.stack .topOfMain')[0];
        bringToTop(cardLi);
        var card = stack.getCard(cardLi);
        cardLi.thrownY = getRandomInt(-100, 100);
        cardLi.thrownX = 1;
        card.throwOut(cardLi.thrownX, cardLi.thrownY);
    }

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

    function deckComplete() {
        $cardList = $('.stack li');
        $cardList.on('mousedown', function(e) {
            var id = '#' + this.id;
            var idx = discardPile.indexOf(id);
            if (idx > -1) {
                moveToLast(discardPile, idx);
                markCardUnique($(id), 'topOfDiscard');
            }
        });
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
