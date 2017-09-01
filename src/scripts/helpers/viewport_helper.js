let jQuery = require('jquery');

jQuery.noConflict();
(function($){

  $(window).on('load resize scroll', function () {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowPos = $(window).scrollTop();
    $('#viewport-helper').html('Width: <strong>' + viewportWidth + '</strong>px <br>Height: <strong>' + viewportHeight + '</strong>px <br>Scroll: <strong>' + windowPos + '</strong>px');
  });

})(jQuery);