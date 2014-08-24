/*global _:false */
/*
* jquery.itneverends
*
*
* Copyright (c) 2014 Oliver Sahner
* Licensed under the MIT license.
*/

(function ($) {
  var pluginName = 'itneverends';
  // avoid JSP Tag collision
  _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/gm,
    interpolate: /\{\{=(.+?)\}\}/gm,
    escape: /\{\{-(.+?)\}\}/gm
  };

  $[pluginName] = function (element, options) {
    var defaults = {
      url: '',
      distance: 15,
      delay: 200,
      loadOnInit: true,
      height: 'auto',
      listTemplate: [
      '{{ _.forEach(rows, function(row) { }}',
      '<li class="list-item">{{- row.name }}</li>',
      '{{ }); }}'
      ].join(''),
      loadingTemplate: '<div class="loading"><img src="img/ajax-loader.gif" /></li>',
      hasMoreFunc: function (data) { return  false;},
      reqParamsFunc: function (params) { return {}; },
      loadingDoneFunc: function (data) {}
    },
    plugin = this,
    updateInitiated = false,
    reqParams = {},
    $element = $(element),
    $listTemplate;

    plugin.settings = {};

    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options);

      $listTemplate = _.template(plugin.settings.listTemplate);
      // arrange element
      $element.wrap('<div class="itneverends-container"></div>').addClass('itneverends').css({height: plugin.settings.height});
      $element.after(plugin.settings.loadingTemplate);
      $element.on('scroll', throttledScrollHandler);
      if (plugin.settings.loadOnInit) {
        $element.trigger('scroll');
      }
    };

    plugin.options = function (newoptions) {
      if (typeof newoptions === 'object') {
        plugin.settings = $.extend({}, plugin.settings, newoptions);
        if (undefined !== newoptions.height) {
          $element.css({height: plugin.settings.height});
        }
        if (undefined !== newoptions.loadingTemplate) {
          $element.next().html(plugin.settings.loadingTemplate);
        }
        if (undefined !== newoptions.listTemplate) {
          $listTemplate = _.template(plugin.settings.listTemplate);
        }
        if (undefined !== newoptions.url) {
          plugin.reset();
        }
      }
    };

    plugin.reset = function () {
      var $loading = $element.next();
      $element.off('scroll', throttledScrollHandler);
      reqParams = {};
      $loading.css({opacity: 1});
      $element.children().animate({opacity: 0}, 100, function () {
        $element.html('');
        $element.on('scroll', throttledScrollHandler);
        $element.trigger('scroll');  
      });
    };

    var throttledScrollHandler = _.throttle(function () {
      if (updateInitiated) {
        return false;
      }
      var $el = $(this);
      if ($el.scrollTop() + $el.innerHeight() >= $el[0].scrollHeight - plugin.settings.distance) {
        var $loading = $element.next();
        $loading.css({opacity: 1});
        updateInitiated = true;
        reqParams = plugin.settings.reqParamsFunc(reqParams);
        $.ajax({
          data: reqParams,
          url: plugin.settings.url
        }).done(function (data) {
          if (data) {
            $el.append($listTemplate(data));
            var hasmore = plugin.settings.hasMoreFunc(data, reqParams);
            updateInitiated = false;
            $loading.css({opacity: 0});
            plugin.settings.loadingDoneFunc(data);
            if (!hasmore) {
              $el.off('scroll', throttledScrollHandler);
            } else if ($el.innerHeight() >= $el[0].scrollHeight) {
              $el.trigger('scroll');
            }
          }
        }).fail(function (msg) {
          updateInitiated = false;
          $loading.css({opacity: 0});
          $el.off('scroll', throttledScrollHandler);
        });
      }
    }, plugin.settings.delay, {leading: false});

    plugin.init();
  };

  $.fn[pluginName] = function () {
    var method,
    options = {};

    if (arguments.length === 1) {
      if (typeof arguments[0] === 'string') {
        method = arguments[0];
      } else {
        options = arguments[0];
      }
    } else if (arguments.length === 2) {
      method = arguments[0];
      options = arguments[1];
    }

    return this.each(function () {
      var $this = $(this),
      data = $this.data(pluginName);

      if (undefined === data) {
        var plugin = new $.itneverends(this, options);
        $this.data(pluginName, plugin);
      } else if (undefined !== method && undefined !== data[method]) {
        data[method](options);
      }
    });
  };
})(jQuery);