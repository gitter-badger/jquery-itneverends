/*global _:false */
/*
* jquery.itneverends
*
*
* Copyright (c) 2014 Oliver Sahner
* Licensed under the MIT license.
*/

(function ($, _) {
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
      throttleDelay: 200,
      loadOnInit: true,
      height: 'auto',
      listTemplate: [
      '{{ _.forEach(rows, function(row) { }}',
      '<li class="list-item">{{- row.name }}</li>',
      '{{ }); }}'
      ].join(''),
      loadingTemplate: '<div class="loading"><img src="img/ajax-loader.gif" /></li>',
      hasMore: function (data) { return  false;},
      requestParams: function (params) { return {}; },
      loadingDone: function (data) {}
    },
    plugin = this,
    updateInitiated = false,
    reqParams = {},
    $element = $(element),
    _listTemplate;

    plugin.settings = {};

    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options);

      _listTemplate = _.template(plugin.settings.listTemplate);
      // arrange element
      $element.wrap('<div class="itneverends-container"></div>').addClass('itneverends').css({height: plugin.settings.height});
      $element.after(plugin.settings.loadingTemplate);
      $element.on('scroll', throttledScrollHandler);
      if (plugin.settings.loadOnInit) {
        $element.trigger('scroll');
      }
    };

    plugin.options = function (newoptions) {
      var needsReset = false;
      if (typeof newoptions === 'object') {
        plugin.settings = $.extend({}, plugin.settings, newoptions);
        if (undefined !== newoptions.height) {
          $element.css({height: plugin.settings.height});
        }
        if (undefined !== newoptions.loadingTemplate) {
          $element.next().html(plugin.settings.loadingTemplate);
        }
        if (undefined !== newoptions.listTemplate) {
          _listTemplate = _.template(plugin.settings.listTemplate);
          needsReset = true;
        }
        if (undefined !== newoptions.url) {
          needsReset = true;
        }
        
        if (needsReset) {
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
        reqParams = plugin.settings.requestParams(reqParams);
        $.ajax({
          data: reqParams,
          url: plugin.settings.url
        }).done(function (data) {
          if (data) {
            $el.append(_listTemplate(data));
            var hasmore = plugin.settings.hasMore(data, reqParams);
            updateInitiated = false;
            $loading.css({opacity: 0});
            plugin.settings.loadingDone(data);
            if (!hasmore) {
              $el.off('scroll', throttledScrollHandler);
            } else if ($el.innerHeight() >= $el[0].scrollHeight) {
              $el.trigger('scroll');
            }
          }
        }).fail(function (jqXHR, status, msg) {
          updateInitiated = false;
          $loading.css({opacity: 0});
          plugin.settings.loadingDone(msg);
          $el.off('scroll', throttledScrollHandler);
        });
      }
    }, plugin.settings.throttleDelay, {leading: false});

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
})(jQuery, _);