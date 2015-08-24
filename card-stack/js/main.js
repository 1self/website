  $(document).keydown(function (e) {
      var keyCode = e.keyCode || e.which,
      arrow = {left: 37, up: 38, right: 39, down: 40 };

      switch (keyCode) {
          case arrow.left:
              $('.previous').trigger('click');
          break;
          case arrow.right:
              $('.next').trigger('click');
          break;
          case arrow.down:
              $('.topOfMain .more').trigger('click');
          break;
          case arrow.up:
              $('.topOfMain .more-back').trigger('click');
          break;
          default: return; // allow other keys to be handled
      }
      e.preventDefault();
      // prevent default action (eg. page moving up/down)
      // but consider accessibility (eg. user may want to use keys to choose a radio button)
  });   
// Menu

(function() {
  $(".flyout-btn").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".overlay").toggleClass("open");
    $(".flyout").find("a").removeClass();
    
    return $(".flyout").removeClass("flyout-init fade").toggleClass("expand");
  });

  $(".flyout").find("a").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".flyout").removeClass("expand").addClass("fade");
    return $(this).addClass("clicked");
  });

  $(".share").find("a").click(function() {
    return $(this).addClass("clicked");
  });

  $(".more, .more-back").click(function() {
    $(".card-container").toggleClass("hover");
    $(".back").toggleClass("iefix");
  });

  $(".share").click(function() {
    $(".flyout-btn").toggleClass("btn-rotate");
    $(".share-buttons-wrap").toggleClass("hide zoomIn");
    $(".overlay").toggleClass("open");
  });

  $('.removed-from-deck').delay(1000).remove();

  $(".flyout").find("a").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    }, 550);

  
});  

}).call(this);





