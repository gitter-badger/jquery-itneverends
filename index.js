var express = require('express');
var faker = require('faker');
var app = express();

var MAX = +process.env.MAX || 2000;
var MIN = +process.env.MIN || 1000;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(express.cookieParser());
app.use(express.session({secret: 'dffq3r3444ewdas1'}));

function initData () {
  'use strict';
  var rnd = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  var result = [];
  for (var i = 0; i < rnd;) {
    result.push({
      idx: ++i,
      name: faker.Name.findName(),
      email: faker.Internet.email()
    });
  }
  return result;
}

app.use('/randomize', function(req, res) {
  'use strict';
  req.session.dataStore = initData();
  res.json({'status': 'ok'});
});

app.use('/data', function(req, res) {
  'use strict';
  var pageNumber = +req.query.pageNumber || 1,
  pageSize = +req.query.pageSize || 15;

  if (!req.session.dataStore) {
    req.session.dataStore = initData();
  }
  res.json({
    'pageNumber': pageNumber,
    'pageSize': pageSize,
    'rows': req.session.dataStore.slice((pageNumber - 1) * pageSize, ((pageNumber - 1) * pageSize + pageSize)),
    'sortName': 'name',
    'sortOrder': 'asc',
    'total': req.session.dataStore.length
  });
});

app.listen(app.get('port'), function() {
  'use strict';
});
