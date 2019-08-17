(function (global) {
	'use strict';

	const QUnit = global.QUnit;
	const check = global.check; // check-type.js
	
	check.assert.object(QUnit, 'no QUnit');
	check.assert.object(QUnit.assert, 'no QUnit.assert!?');
	
	QUnit.assert.neither = function (actual, expected, message) {
		check.assert.array(expected, "need an array as 'expected' argument");
		const strictEq = (a, b) => (QUnit.objectType(a) === 'nan') ? QUnit.equiv(a, b) : a === b;
		const result = !expected.reduce((acc, v) => acc || strictEq(actual, v), false);
		this.pushResult({
			result,
			actual,
			expected,
			message,
			negative: true
		});
	}
	
}(function() { return this; }()));
