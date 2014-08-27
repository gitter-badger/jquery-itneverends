(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#itneverends', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
      this.url = 'test.json';
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.itneverends({url: this.url}), this.elems, 'should be chainable');
    var count = this.elems.children().length;
    console.log(count);
  });

  test('reload data', function() {
    expect(1);
    var orig = this.elems;
    strictEqual(this.elems.itneverends('reload'), orig, 'should be reloadable');
  });

  test('set options', function() {
    expect(2);
    var count = this.elems.children().length;
    strictEqual(this.elems.itneverends('options', {url: 'test2.json'}).data('itneverends').settings.url, 'test2.json', 'does accept new url');
    strictEqual(this.elems.children().length, count, 'Count:' + count);
  });

}(jQuery));
