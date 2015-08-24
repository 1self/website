var cardsAdded = 0;
var $liTemplate = $(".li-template");
var globalCardsArray;

function buildStack (stack) {
    var numberOfCardsToShow = 3;
    var skip = 0;
    deferred.done(function(cardsArray) {
    	globalCardsArray = cardsArray;
    	console.log(cardsArray.length);

        $('.out-of-text').text(cardsArray.length);
        $('.card-number-text').text("1");

        if (numberOfCardsToShow > cardsArray.length) {
            numberOfCardsToShow = cardsArray.length;
        }

        // for (var i = numberOfCardsToShow + skip - 1; i >= skip; i--) {
        for (var i = 0; i < numberOfCardsToShow; i++) {
            var $li = addToStack($liTemplate, stack, cardsArray[i], i, (i === skip));
            
            if (i === skip) {
	          	markCardUnique($li[0], 'topOfMain');
	        	renderThumbnailMedia($li, cardsArray[i]);
            }
       	}

    });
}

function markCardUnique(cardEl, label) {
    $('.stack li').removeClass(label);
    if (cardEl !== undefined) {
        $(cardEl).addClass(label);
    }
}

function stripHash(stringToStrip) {
    return stringToStrip.replace('#', '');
}

function getColour(idx) {
    var colourArray = ['#dd2649', '#00a2d4', '#e93d31', '#f2ae1c', '#61b346', '#cf4b9a', '#367ec0', '#00ad87'];
    return "#000000";
    // return colourArray[idx % colourArray.length];
}

function getHighlightDates(cardData) {
    if (cardData.startRange === cardData.endRange) {
        return cardData.startRange;
    }
}

function sendToBottom($cardLi) {
	if ($cardLi) {
		var $cardUl = $cardLi.parent();
		$cardLi.detach();
		$cardUl.prepend($cardLi);
	}
}

function bringToTop(cardLi) {
	if (cardLi) {
		var $cardLi = $(cardLi);
		var $cardUl = $cardLi.parent();
		$cardLi.detach();
		$cardUl.append(cardLi);
	}
}

function addToStack ($liTemplate, stack, cardData, cardIndex, renderThumbnail) {
    
    setSourceElements(cardData);

	var $li = $liTemplate.clone();
	var liHtml = $li[0];
	var $card = createCard(cardData);
	$li.removeClass("li-template");
	liHtml.cardIndex = cardIndex;
	var $stack = $(".stack");

	$stack.prepend($li);
	console.log($li.find(".card-container"));
	$li.find(".card-container").append($card);
	$li.removeClass("card-hide");
	$card.removeClass("card-hide");
	assignCardHandlers($li);

    stack.createCard(liHtml);
    sendToBottom($li);
    cardsAdded++;
    liHtml.classList.add('in-deck');

    $li.find('.cardData').val(encodeURIComponent(JSON.stringify(cardData)));
    $li.attr('cardId', cardData.id);
    $li.attr('cardIndex', cardIndex);

    return $li;
}

function assignCardHandlers ($li) {
	$li.find(".more, .more-back").click(function() {
		$li.find(".card-container").toggleClass("hover");
		$li.find(".back").toggleClass("iefix");
 	 });
}

function injectCardData (cardData, $card) {
	createCardText(cardData, "green");

    var $headlineText = $card.find(".headline-text");
    $headlineText.prepend(cardData.cardText);

    var $eventDate = $card.find(".event-date");
    $eventDate.text(stripAtDetail(dateRangetext(cardData.startRange, cardData.endRange)));

    var $headline = $card.find(".headline");
	$headline.addClass(cardData.dataSource);
}

function createCard (cardData) {
	var $card; 

	if (cardData.type ==="date") {
        var cardDate = moment(cardData.cardDate);
		$card = $(".card-template.date-card").clone();
        $card.find('.event-date').text(stripAtDetail(cardDate.calendar()));

	} else if (cardData.type === "top10" || cardData.type === "bottom10") {
		$card = $(".card-template.top-ten-card").clone();
		injectCardData(cardData, $card);
	}

	$card.removeClass("card-template");
	return $card;
}


$(document).ready(function(){ 

    var stack;
    var discardPile = [];

    stack = gajus.Swing.Stack();

    stack.on('throwout', function (e) {

    	var $cardList = $(".stack li");

        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');
        e.target.classList.remove('in-deck');
        e.target.classList.add('removed-from-deck');
        discardPile.push(e.target);

        markCardUnique(e.target, 'topOfDiscard');
        e.target.thrownX = 1;
        e.target.thrownY = 78;
        var cardsOnDiscard = discardPile.length;

        if ($cardList.length - 1 - cardsOnDiscard >= 0) {
        	var newTop = $cardList[$cardList.length - 1 - cardsOnDiscard];
        	var $newTop = $(newTop);

            var cardData = $newTop.find('.cardData');
            cardData = decodeURIComponent(cardData.val());
            cardData = JSON.parse(cardData);

        	markCardUnique(newTop, 'topOfMain');
        	bringToTop(newTop);
            newTop.cardVisibleAt = (new Date()).getTime();
            renderThumbnailMedia($newTop, cardData);
        } else {
        	$('.stack li').removeClass('topOfMain');
        }

        var $cardNumText = $('.card-number-text');
        $cardNumText.text(parseInt($cardNumText.text()) + 1);
        
        // sendGAEvent('thrown-out-' + e.target.getAttribute('cardIndex'), e.target.getAttribute('cardId'), e.target.getAttribute('cardIndex'));

        var cardReloadCount = 0;
        markCardRead(username, e.target, cardReloadCount); // username is declared globally in index.html

        if (cardsAdded < globalCardsArray.length) {
        	addToStack($liTemplate, stack, globalCardsArray[cardsAdded], cardsAdded, false);
        }

    });

    stack.on('throwin', function(e) {
        discardPile.pop();
        var cardEl = $(discardPile[discardPile.length - 1])[0];
        markCardUnique(e.target, 'topOfMain');
        markCardUnique(cardEl, 'topOfDiscard');
        $(e.target).show();
    
        e.target.classList.add('in-deck');
        e.target.classList.remove('removed-from-deck');

        // move discarded cards back to top of stack to ensure ordering is correct
        var discards = $('.stack li.removed-from-deck').detach();
        $('.stack').append(discards);

        // bring the active card to the top in the li list so it can always be interacted with
        bringToTop(e.target);
        console.log('thrown in', e.target.id, discardPile);

        var cardsInDeck = $('.stack li.in-deck');

        console.log(cardsAdded);
        console.log(cardsInDeck[0]);

        if (cardsInDeck.length > 3) {

            var $cardNumText = $('.card-number-text');
            $cardNumText.text(parseInt($cardNumText.text()) - 1);

            cardsAdded--;
            var bottomLi = $('.stack li.in-deck')[0];
            var bottomCard = stack.getCard(bottomLi);
            bottomCard.destroy();
            $(bottomLi).remove();
        }

// http://stackoverflow.com/questions/2087510/callback-on-css-transition
// http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers

        // sendGAEvent('thrown-in-' + e.target.getAttribute('cardIndex'), e.target.getAttribute('cardId'), e.target.getAttribute('cardIndex'));
    });

	$(".next").click(function(){
	throwOutNext(stack);
	});

	$(".previous").click(function(){
	throwInPrevious(stack);
	});

	buildStack(stack);

});


function throwInPrevious(stack){
	var $cardToThrow = $(".topOfDiscard");
	var cardLi = $cardToThrow[0];

	if (cardLi) {
		var card = stack.getCard(cardLi);
		card.throwIn(cardLi.thrownX, cardLi.thrownY);
	}
}

function throwOutNext(stack){
	var $cardToThrow = $(".topOfMain");
	var cardLi = $cardToThrow[0];

	if (cardLi) {
	    var card = stack.getCard(cardLi);
	    cardLi.thrownY = getRandomInt(-100, 100);
	    cardLi.thrownX = 1;
	    card.throwOut(cardLi.thrownX, cardLi.thrownY);
	//     sendGAEvent('button-thrown-out-' + cardLi.getAttribute('cardIndex'), cardLi.getAttribute('cardId'), cardLi.getAttribute('cardIndex'));            
	// } else {
	//     $('.getMoreCardsBtn').addClass('standard-shadow');
	//     $('.getMoreCardsBtn').hide();
	//     $('.bottom-of-stack-container .loading').show();
	//     $('.bottom-of-stack-container h1').text('Loading cards...').removeClass("bottom-of-stack-large-text");
	//     $('.bottom-of-stack-container p').hide();
	//     $('.bottom-of-stack-container .tellMeAboutNewCardsBtn').hide();

	//     getCards();
	//     cardReloadCount++;
	//     setUpStack();
	//     buildStack(stack);

	//     sendGAEvent('get-more-cards');
	}
}