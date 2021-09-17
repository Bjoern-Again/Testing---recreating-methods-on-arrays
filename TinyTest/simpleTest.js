/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */

 // build plurilize for success and failure 

var TinyTestHelper = {
    renderStats: function(tests, failures) {
            var numberOfTests = Object.keys(tests).length;
            var successes = numberOfTests - failures;
            var summaryString = 'Ran ' + numberOfTests + ' tests: ' 
                                + successes + ' successes, '
                                + failures + ' failures ';

            var summaryElement = document.createElement('h1');
            summaryElement.textContent = summaryString;
            document.body.appendChild(summaryElement);
    },
}; 

var TinyTest = {
    run: function(tests) {
        var failures = 0;
        for (var testName in tests) {
            var testAction = tests[testName];
            try {
                testAction.apply(this);
                console.log('%c' + testName,"color: green;");
            } catch (e) {
                failures++;
                console.groupCollapsed('%c' + testName,"color: red;");
                console.error(e.stack);
                console.groupEnd();
            }
        }
        // Gives document a chance to complete
        setTimeout(function() { 
            if (window.document && document.body) {
                document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
                TinyTestHelper.renderStats(tests, failures);
            }
        }, 0);
    },
    // fail method: fails test in the beginning optional add message 
    fail: function(msg) {
        throw new Error('fail(): ' + msg);
    },
    // checks if the value is true, if not throws error
    assert: function(value, msg) {
        if (!value) {
            throw new Error('assert(): ' + msg);
        }
    },
    // eq checks if two values are the same
    assertEquals: function(expected, actual) {
        if (expected != actual) {
            throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
        }
    },
    // 
    assertStrictEquals: function(expected, actual) {
        if (expected !== actual) {
            throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
        }
    },

};

var fail               = TinyTest.fail.bind(TinyTest),
    assert             = TinyTest.assert.bind(TinyTest),
    assertEquals       = TinyTest.assertEquals.bind(TinyTest),
    eq                 = TinyTest.assertEquals.bind(TinyTest), // alias for assertEquals
    assertStrictEquals = TinyTest.assertStrictEquals.bind(TinyTest),
    
    // the tests method is the test object in tinyTest and runs the run method

    tests              = TinyTest.run.bind(TinyTest);