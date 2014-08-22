# jquery.itneverends

jQuery Infinite Scrolling with JSON Data Feed

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/osahner/jquery-itneverends/master/dist/jquery.itneverends.min.js
[max]: https://raw.github.com/osahner/jquery-itneverends/master/dist/jquery.itneverends.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="lodash.js"></script>
<script src="dist/jquery.itneverends.min.js"></script>

<script id="itneverendsTemplate" type="text/x-template">
  {{ _.forEach(rows, function(row) { }}
    <li class="list-item">{{- row.name }}</li>
  {{ }); }}
</script>

<ul class="itneverends">
</ul>

<script>
jQuery(function($) {
  var reqParams = {
      pageNumber: 1,
      pageSize: 100,
      height: '400px',
      sortName: 'name',
      sortOrder: 'asc'
  };
  $('.itneverends').itneverends({
    url: '/some/json/datafeed',
    listTemplate: $('#itneverendsTemplate').html(),
    reqParamsFunc: function (params) {
      return {
        pageNumber: params.pageNumber ? ++params.pageNumber : reqParams.pageNumber,
        pageSize: params.pageSize || reqParams.pageSize,
        sortName: params.sortName || reqParams.sortName,
        sortOrder: params.sortOrder || reqParams.sortOrder
      };
    },
    hasMoreFunc: function (data, params) {
      return (data && params.pageNumber * params.pageSize < data.total);
    }
  });
});
</script>

```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
