$(document).ready(function() {
    executeOnLoadTasks();
});

function executeOnLoadTasks() { 
    var integrationsJSON = getIntegrationsInCategories();

    renderIntegrationsList(integrationsJSON);
}

function renderIntegrationsList(integrationsJSON) {
    console.log(integrationsJSON);

    var $integrationsContent = $('.integrations-content');
    var $sectionTemplate = $('.integrations-section.template');
    var $smallServiceTemplate = $('.section-content-collapse .service-container.template');
    var $integrationCardTemplate = $('.integration-card.template');

    integrationsJSON.forEach(function (category) {
        var $categorySection = buildCategorySection(category, $sectionTemplate, $smallServiceTemplate, $integrationCardTemplate);
        $integrationsContent.append($categorySection);

        $categorySection.click(function() {
            var $clickedSection = $(this);
            $clickedSection.find('.section-content-collapse').slideToggle();
            $clickedSection.find('.section-content-expand').slideToggle();
        });
    });
}

function toggleExpansion(element) {
    console.log(element);
}

function buildCategorySection(category, $sectionTemplate, $smallServiceTemplate, $integrationCardTemplate) {
    var $section = $sectionTemplate.clone();
    $section.removeClass('template');

    $section.find('.section-header').text(category.category);

    category.integrations.forEach(function (integration) {
        var $collapseItem = buildServiceCollapseItem(integration, $smallServiceTemplate);
        var $card = buildIntegrationCard(integration, $integrationCardTemplate);
        // console.log($section.find('.section-content-collapse'), $card);
        $section.find('.section-content-collapse').append($collapseItem);
        $section.find('.section-content-expand').append($card);
    });

    return $section;
}

function buildServiceCollapseItem(integration, $smallServiceTemplate) {
    var $element = $smallServiceTemplate.clone();
    $element.removeClass('template');
    $element.find('.service').addClass(integration.identifier);
    return $element;
}

function buildIntegrationCard(integration, $integrationCardTemplate) {
    var $card = $integrationCardTemplate.clone();
    $card.removeClass('template');
    $card.addClass('flex');
    $card.find('.service').addClass(integration.identifier);
    console.log($card.find('.content p'));
    $card.find('.content p').text(integration.shortDescription);
    return $card;
}



// function assignCardHandlers ($li) {
//     $li.find(".more, .more-back").click(function() {
//         $li.find(".card-container").toggleClass("hover");
//         $li.find(".back").toggleClass("iefix");
//         // $li.find(".back .headline").on('mousedown', function() { return false; });
//         // $li.find(".back .headline").on('touchstart', function() { return false; });
//         // $li.find(".back").on('touchstart', function() { return false; });
//      });

//     $li.find(".more-back").click(function() {
//         showFlickButtons();
//         $li.find(".front .chart-container").show();
//         sendGAEvent('flipped-to-front', username + "#" + $li.attr('cardId'), $li.attr('cardIndex'));
//      });

//     $li.find(".more").click(function() {
//         hideFlickButtons();
//         $li.find(".front .chart-container").hide();
//         sendGAEvent('flipped-to-back',  username + "#" + $li.attr('cardId'), $li.attr('cardIndex'));
//      });
// }

// function injectCardData (cardData, $card) {
//     var colour = getPrimaryColour(cardData.dataSource);

// 	createCardText(cardData);

//     // var $headlineText = $card.find(".headline-text");
//     // $headlineText.prepend(cardData.cardText);

//     $card.find(".headline-comparitor").append(cardData.cardText.comparitor);
//     $card.find(".headline-description").append(cardData.cardText.description);
    
//     var $headlineInfo = $card.find(".headline-info");
//     if (cardData.cardText.extraInfo) {
//         var $infoLink = $card.find(".headline-info a");
//         $infoLink.text(cardData.cardText.extraInfo.text);
//         $infoLink.attr('href', cardData.cardText.extraInfo.link);
//         $infoLink.css("color", colour);

//         $headlineInfo.css("color", colour);
//         $headlineInfo.show();
//                 // <span class="infoLink" style="color:{{colour}}"><i class="fa fa-info-circle"></i> <a style="color:{{colour}}" onclick="logInfoClick(this);" href="https://www.rescuetime.com/dashboard/for/the/day/of/{{cardDate}}" target="_blank"></a></span>
//     } else {
//         $headlineInfo.hide();
//     }

//     var $eventDate = $card.find(".event-date");
//     $eventDate.text(dateRangetext(cardData.type, cardData.startRange, cardData.endRange));

//     var $headline = $card.find(".headline");
// 	$headline.addClass(cardData.dataSource);

//     var $cardMenu = $card.find(".card-menu");
//     $cardMenu.addClass(cardData.dataSource);

// }

// function createCard (cardData) {
// 	var $card; 

// 	if (cardData.type ==="date") {
// 		$card = $(".card-template.date-card").clone();
//         $card.find('.event-date').text(dateRangetext(cardData.type, cardData.cardDate));

// 	} else if (cardData.type === "top10" || cardData.type === "bottom10") {
// 		$card = $(".card-template.top-ten-card").clone();
// 		injectCardData(cardData, $card);
// 	}

// 	$card.removeClass("card-template");

//     var $back = $card.find('.back');

//     if ($back.length > 0) {
//         var bodyHeight = $('body').height(); 
//         $back.height(bodyHeight);
//     }

// 	return $card;
// }