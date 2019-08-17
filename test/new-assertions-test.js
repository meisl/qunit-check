(function () {
	'use strict';
	const undefined = void(0);

	const { module, test, skip, todo } = QUnit;

	const { objectType } = QUnit;

	module("new-assertions", hooks => {
		var assert_wellBehaved,
			assert_pass,
			assert_fail;
		
		hooks.beforeEach(assert => {
			const Assert = assert.constructor;
			
			function __assert_pass(assert, assertion, options, args) {
				const calls = __assert_wellBehaved(assert, assertion, options, args);
				calls.forEach((call, idx) => {
					const i = `@ call #${idx + 1}: `;
					const assertionOut = call.args[0]; // remember: args is what the assertion passed to pushResult
					check.assert.nonEmptyObject(assertionOut);
					if (assertionOut.result) {
						assert.strictEqual(assertionOut.result, true, i + "should pass with args " + args);
					} else {
						assert.deepEqual(assertionOut.result, { result: true },
							i + "should pass with args " + args + '\n' + QUnit.dump.parse(assertionOut));
					}
				});
			}
			
			function __assert_fail(assert, assertion, options, args) {
				const calls = __assert_wellBehaved(assert, assertion, options, args);
				calls.forEach((call, idx) => {
					const i = `@ call #${idx + 1}: `;
					const assertionOut = call.args[0]; // remember: args is what the assertion passed to pushResult
					check.assert.nonEmptyObject(assertionOut);
					if (!assertionOut.result) {
						assert.strictEqual(assertionOut.result, false, i + "should fail with args " + args);
					} else {
						assert.deepEqual(assertionOut.result, { result: false },
							i + "should fail with args " + args + '\n' + QUnit.dump.parse(assertionOut));
					}
				});
			}

			function __assert_wellBehaved(assert, assertion, options, args) {
				check.assert.instance(assert, Assert, "arg assert must be a QUnit Assert, not " + objectType(assert));
				check.assert.function(assertion, "arg 'assertion' must be function, not " + objectType(assertion));
				check.assert.maybe.object(options, "arg 'options', must be object or undefined, not " + objectType(options));
				check.assert.array(args);
				
				const opts = Object.assign({
						atLeast: 1,
						atMost: 1,
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
					if (calls.length < opts.atLeast) {
						assert.ok(false, msg + ' - actual: ' + calls.length);
					} else {
						assert.ok(true, msg);
					}
				}

				if ('atMost' in opts) {
					const msg = "it should have called pushResult at most " + opts.atLeast + " times";
					if (calls.length > opts.atMost) {
						assert.ok(false, msg + ' - actual: ' + calls.length);
					} else {
						assert.ok(true, msg);
					}
				}
				
				calls.forEach((call, idx) => {
					const i = `@ call #${idx + 1}: `;
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
			assert_pass = __assert_pass.bind(null, assert);
			assert_fail = __assert_fail.bind(null, assert);
		}); // end beforeEach hook
		
		
		
		module("assert.neither", hooks => {
			test("is a method on assert object", assert => {
				assert.equal(objectType(assert.neither), 'function');
			});
			test("invalid args", assert => {
				assert.throws(() => assert.neither(), TypeError, "no args");
				assert.throws(() => assert.neither(23), TypeError, "missing 'expected'");
				assert.throws(() => assert.neither(23, null), TypeError, "arg 'expected' null");
			});
			test("some numbers", assert => {
				var args, call, assertionOut;
				
				assert_pass(assert.neither, {}, [1, [2, 3]]);
				assert_fail(assert.neither, {}, [3, [2, 3]]);
				
			});
			test("comparing NaN", assert => {
				assert_pass(assert.neither, {}, [NaN, [null, undefined, "foo", 23, new Number(42)]]);
				assert_fail(assert.neither, {}, [NaN, [NaN]]);
				assert_fail(assert.neither, {}, [new Number(NaN), [new Number(NaN)]]);
			});
			todo("NaN vs new Number(NaN)", assert => {
				assert_pass(assert.neither, {}, [NaN, [new Number(NaN)]]);
				assert_pass(assert.neither, {}, [new Number(NaN), [NaN]]);
			});
			
			todo("weird values", assert => {
				class C { constructor() { this.pi = 4 } };
				assert_pass(assert.neither, {}, [NaN,
					[null, undefined, new Number(NaN), new String('foo'), new Boolean(false), new Set(), new C()]]);
				assert_pass(assert.neither, {}, [new Number(NaN), [null, new Number(NaN), undefined, 42, 23, , { foo: 'bar' }]]);
				assert_pass(assert.neither, {}, [new C(), [new C(), Object.create(null), { foo: 'bar' }]])
			});
			
			todo("with empty expected array", assert => {
				var thisVal;
				
				
			});
		}); // end module "neither"
		
	}); // end module "new-assertions"

}());


