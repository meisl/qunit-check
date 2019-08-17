(function () {
	'use strict';
	const undefined = void(0);

	const { module, test, skip, todo } = QUnit;

	const { objectType } = QUnit;

	module("new-assertions", hooks => {
		var assert_wellBehaved;
		
		hooks.beforeEach(assert => {
			const Assert = assert.constructor;
			
			function __assert_wellBehaved(assert, assertion, options, args) {
				check.assert.object(assert, "arg assert must be object, not " + objectType(assert));
				check.assert.function(assertion, "arg 'assertion' must be function, not " + objectType(assertion));
				check.assert.maybe.object(options, "arg 'options', must be object or undefined, not " + objectType(options));
				check.assert.array(args);
				
				const opts = Object.assign({
						atLeast: 1,
						//atMost: 
					}, options || {});

				const calls = [];
				const orig = assert.pushResult;
				assert.pushResult = function (...args) {
					const call = {
						args,
						thisValue: this
					};
					calls.push(call);
					// actually do NOT pass over to original pushResult
					
					// try {
						// return call.returned = orig.apply(this, args);
					// } catch (err) {
						// call.threw = err;
						// // throw err;
					// }
				};
				console.log(opts);
				assertion.apply(assert, args);
				
				assert.pushResult = orig;

				if ('atLeast' in opts) {
					const msg = "it should have called pushResult at least " + opts.atLeast + " times";
					if (opts.atLeast > calls.length) {
						assert.ok(false, msg + ' - actual: ' + calls.length);
					} else {
						assert.ok(true, msg);
					}
				}
				calls.forEach((call, idx) => {
					const i = `@ call #1: ${idx + 1}`;
					assert.strictEqual(call.thisValue, assert,
						i + 'it should have called pushResult with the assert object as "this"');
					assert.equal(call.args.length, 1,
						i + 'it should have called pushResult with 1 arg');
					var result = call.args[0];
					assert.equal(objectType(result), 'object',
						i + 'it should have called pushResult with an object arg');
					assert.ok(check.nonEmptyObject(result),
						i + 'it should have called pushResult with a non-empty object arg');
					assert.ok(check.boolean(result.result),
						i + 'the result object should have a boolean property "result"');
					assert.ok(check.string(result.message) || check.undefined(result.message), 
						i + 'result object should have a property "message" either a string or undefined'
					);
					assert.ok('actual' in result, i + 'result object should have a property "actual"');
					assert.ok('expected' in result, i + 'result object should have a property "expected"');
				});
				return calls;
			}
			assert_wellBehaved = __assert_wellBehaved.bind(null, assert);
			console.log(assert_wellBehaved);
		}); // end beforeEach hook
		
		module("neither", hooks => {
			test("is a method on assert object", assert => {
				assert.equal(objectType(assert.neither), 'function');
			});
			test("invalid args", assert => {
				assert.throws(() => assert.neither(), TypeError, "no args");
				assert.throws(() => assert.neither(23), "just 1 arg");
				assert.throws(() => assert.neither(23, null), "2nd arg null");
			});
			test("it calls .pushResult on 'this'", assert => {
				var args, call, assertionOut;
				
				args = [1, [2, 3]];
				[call] = assert_wellBehaved(assert.neither, { atLeast: 1, atMost: 1 }, args);
				assertionOut = call.args[0]; // remember: call.args is what *it* passed to pushResult
				assert.equal(assertionOut.result, true, 'assert.neither should succeed on args ' + args);

				args = [2, [2, 3]];
				[call] = assert_wellBehaved(assert.neither, { atLeast: 1, atMost: 1 }, args);
				assertionOut = call.args[0]; // remember: call.args is what *it* passed to pushResult
				assert.equal(assertionOut.result, false, 'assert.neither should fail on args ' + args);
			});
			todo("with empty expected array", assert => {
				var thisVal;
				assert.foo = function () { thisVal = this; }
				
				
			});
		}); // end module "neither"
		
	}); // end module "new-assertions"

}());


