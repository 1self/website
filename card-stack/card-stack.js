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
            console.log('returned cardsArray', cardsArray);
            if (cardsArray.length === 0) {
                $('.buttonsRow').hide();
            } else {
                $('.buttonsRow').show();
                $('.stackBase div').empty();
                $('.stackBase div').text('All done');
                cardsArray.reverse();
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
                    stack.inCards.push(li);
                    stack.createCard(li);
                });
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

    stack.throwOutNext = function() {
        // alert('throw out');?
        if (stack.inCards.length > 0) {
            var cardLi = stack.inCards.pop();
            bringToTop(cardLi);
            var card = stack.getCard(cardLi);
            cardLi.thrownY = getRandomInt(-100, 100);
            cardLi.thrownX = 1;
            card.throwOut(cardLi.thrownX, cardLi.thrownY);
        }
        console.log('inside stack.throwOutNext', stack.inCards);
    };

    stack.throwInLast = function() {
        // alert('throw in');
        console.log('inside stack.throwInLast');
        if (stack.outCards.length > 0) {
            var cardLi = stack.outCards.pop();
            var card = stack.getCard(cardLi);
            bringToTop(cardLi);
            card.throwIn(cardLi.thrownX, cardLi.thrownY);
        }
    };
    stack.outCards = [];
    stack.inCards = [];
    window.stack = stack;
    buildStack(stack);
    console.log(stack);

    stack.on('throwout', function(e) {
        stack.outCards.push(e.target);
        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');
        e.target.classList.remove('in-deck');
        if (stack.inCards.length > 0) {
            console.log('render card', stack.inCards[stack.inCards.length - 1]);
            renderThumbnailMedia(stack.inCards[stack.inCards.length - 1]);
        }
    });

    stack.on('throwin', function(e) {
        console.log('inside throwin');
        stack.inCards.push(e.target);
        console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');
        console.log("stack after throwin", stack);

        e.target.classList.add('in-deck');
    });
});
