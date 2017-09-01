let jQuery = require('jquery');

jQuery.noConflict();
(function($){

  $(document).ready(function() {

    const testModule = function (str) {
      console.log(str);
    };

    testModule('Module init');

  });

})(jQuery);
