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
      loadOnInit: false,
      height: '400px',
      listTemplate: [
      '{{ _.forEach(rows, function(row) { }}',
      '<li class="list-item">{{- row.name }}</li>',
      '{{ }); }}'
      ].join(''),
      loadingTemplate: '<div class="loading"><img src="img/ajax-loader.gif" /></li>',
      hasMoreFunc: function (data) { return false;},
      reqParamsFunc: function (params) { return {}; }
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
        }).always(function (data) {
          if (data) {
            $el.append($listTemplate(data));
          }
          updateInitiated = false;
          $loading.css({opacity: 0});

          if ($el.innerHeight() >= $el[0].scrollHeight) {
            $el.trigger('scroll');
          }
          if (!plugin.settings.hasMoreFunc(data, reqParams)) {
            $el.off('scroll', throttledScrollHandler);
          }
        });
      }
    }, plugin.settings.delay, {leading: false});

    plugin.init();
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (undefined === $(this).data(pluginName)) {
        var plugin = new $.itneverends(this, options);
        $(this).data(pluginName, plugin);
      }
    });
  };
})(jQuery);

