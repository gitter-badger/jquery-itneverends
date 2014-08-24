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
  });

  test('public function', function() {
    expect(1);
    strictEqual(this.elems.itneverends('options', {url: 'test2.json'}).data('itneverends').settings.url, 'test2.json', 'does accept new option');
  });

}(jQuery));
