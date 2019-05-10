/*global Person,Task*/
require('../can-map-validations');
require('can/compute/compute');
require('steal-qunit');

QUnit.module('can/map/validations', {
	beforeEach: function(assert) {
		can.Map.extend('Person', {}, {});
	}
});
QUnit.test('observe can validate, events, callbacks', 7, function(assert) {
	Person.validate('age', {
		message: 'it\'s a date type'
	}, function () {
		return !(this.date instanceof Date);
	});
	var task = new Person({
		age: 'bad'
	}),
		errors = task.errors();
	assert.ok(errors, 'There are errors');
	assert.equal(errors.age.length, 1, 'there is one error');
	assert.equal(errors.age[0], 'it\'s a date type', 'error message is right');
	task.bind('error', function (ev, attr, errs) {
		assert.ok(this === task, 'we get task back by binding');
		assert.ok(errs, 'There are errors');
		assert.equal(errs.age.length, 1, 'there is one error');
		assert.equal(errs.age[0], 'it\'s a date type', 'error message is right');
	});
	task.attr('age', 'blah');
	task.unbind('error');
	task.attr('age', 'blaher');
});
QUnit.test('validatesFormatOf', function(assert) {
	Person.validateFormatOf('thing', /\d-\d/);
	assert.ok(!new Person({
			thing: '1-2'
		})
		.errors(), 'no errors');
	var errors = new Person({
		thing: 'foobar'
	})
		.errors();
	assert.ok(errors, 'there are errors');
	assert.equal(errors.thing.length, 1, 'one error on thing');
	assert.equal(errors.thing[0], 'is invalid', 'basic message');
	Person.validateFormatOf('otherThing', /\d/, {
		message: 'not a digit'
	});
	var errors2 = new Person({
		thing: '1-2',
		otherThing: 'a'
	})
		.errors();
	assert.equal(errors2.otherThing[0], 'not a digit', 'can supply a custom message');
	assert.ok(!new Person({
			thing: '1-2',
			otherThing: null
		})
		.errors(), 'can handle null');
	assert.ok(!new Person({
			thing: '1-2'
		})
		.errors(), 'can handle undefiend');
});
QUnit.test('validatesInclusionOf', function(assert) {
	Person.validateInclusionOf('thing', [
		'yes',
		'no',
		'maybe'
	]);
	assert.ok(!new Person({
			thing: 'yes'
		})
		.errors(), 'no errors');
	var errors = new Person({
		thing: 'foobar'
	})
		.errors();
	assert.ok(errors, 'there are errors');
	assert.equal(errors.thing.length, 1, 'one error on thing');
	assert.equal(errors.thing[0], 'is not a valid option (perhaps out of range)', 'basic message');
	Person.validateInclusionOf('otherThing', [
		'yes',
		'no',
		'maybe'
	], {
		message: 'not a valid option'
	});
	var errors2 = new Person({
		thing: 'yes',
		otherThing: 'maybe not'
	})
		.errors();
	assert.equal(errors2.otherThing[0], 'not a valid option', 'can supply a custom message');
});
QUnit.test('validatesLengthOf', function(assert) {
	Person.validateLengthOf('undefinedValue', 0, 5);
	Person.validateLengthOf('nullValue', 0, 5);
	Person.validateLengthOf('thing', 2, 5);
	assert.ok(!new Person({
			thing: 'yes',
			nullValue: null
		})
		.errors(), 'no errors');
	var errors = new Person({
		thing: 'foobar'
	})
		.errors();
	assert.ok(errors, 'there are errors');
	assert.equal(errors.thing.length, 1, 'one error on thing');
	assert.equal(errors.thing[0], 'is too long (max=5)', 'basic message');
	Person.validateLengthOf('otherThing', 2, 5, {
		message: 'invalid length'
	});
	var errors2 = new Person({
		thing: 'yes',
		otherThing: 'too long'
	})
		.errors();
	assert.equal(errors2.otherThing[0], 'invalid length', 'can supply a custom message');
	Person.validateLengthOf('undefinedValue2', 1, 5);
	Person.validateLengthOf('nullValue2', 1, 5);
	var errors3 = new Person({
		thing: 'yes',
		nullValue2: null
	})
		.errors();
	assert.equal(errors3.undefinedValue2.length, 1, 'can handle undefined');
	assert.equal(errors3.nullValue2.length, 1, 'can handle null');
});
QUnit.test('validatesPresenceOf', function(assert) {
	can.Map.extend('Task', {
		init: function () {
			this.validatePresenceOf('dueDate');
		}
	}, {});
	//test for undefined
	var task = new Task(),
		errors = task.errors();
	assert.ok(errors);
	assert.ok(errors.dueDate);
	assert.equal(errors.dueDate[0], 'can\'t be empty', 'right message');
	//test for null
	task = new Task({
		dueDate: null
	});
	errors = task.errors();
	assert.ok(errors);
	assert.ok(errors.dueDate);
	assert.equal(errors.dueDate[0], 'can\'t be empty', 'right message');
	//test for ""
	task = new Task({
		dueDate: ''
	});
	errors = task.errors();
	assert.ok(errors);
	assert.ok(errors.dueDate);
	assert.equal(errors.dueDate[0], 'can\'t be empty', 'right message');
	//Affirmative test
	task = new Task({
		dueDate: 'yes'
	});
	errors = task.errors();
	assert.ok(!errors, 'no errors ' + typeof errors);
	can.Map.extend('Task', {
		init: function () {
			this.validatePresenceOf('dueDate', {
				message: 'You must have a dueDate'
			});
		}
	}, {});
	task = new Task({
		dueDate: 'yes'
	});
	errors = task.errors();
	assert.ok(!errors, 'no errors ' + typeof errors);
});
QUnit.test('validatesPresenceOf with numbers and a 0 value', function(assert) {
	can.Map.extend('Person', {
		attributes: {
			age: 'number'
		}
	});
	Person.validatePresenceOf('age');
	var person = new Person();
	var errors = person.errors();
	assert.ok(errors);
	assert.ok(errors.age);
	assert.equal(errors.age[0], 'can\'t be empty', 'A new Person with no age generates errors.');
	//test for null
	person = new Person({
		age: null
	});
	errors = person.errors();
	assert.ok(errors);
	assert.ok(errors.age);
	assert.equal(errors.age[0], 'can\'t be empty', 'A new Person with null age generates errors.');
	//test for ""
	person = new Person({
		age: ''
	});
	errors = person.errors();
	assert.ok(errors);
	assert.ok(errors.age);
	assert.equal(errors.age[0], 'can\'t be empty', 'A new Person with an empty string age generates errors.');
	//Affirmative test
	person = new Person({
		age: 12
	});
	errors = person.errors();
	assert.ok(!errors, 'A new Person with a valid >0 age doesn\'t generate errors.');
	//Affirmative test with 0
	person = new Person({
		age: 0
	});
	errors = person.errors();
	assert.ok(!errors, 'A new Person with a valid 0 age doesn\'t generate errors');
});
QUnit.test('validatesRangeOf', function(assert) {
	Person.validateRangeOf('thing', 2, 5);
	Person.validateRangeOf('nullValue', 0, 5);
	Person.validateRangeOf('undefinedValue', 0, 5);
	assert.ok(!new Person({
			thing: 4,
			nullValue: null
		})
		.errors(), 'no errors');
	var errors = new Person({
		thing: 6
	})
		.errors();
	assert.ok(errors, 'there are errors');
	assert.equal(errors.thing.length, 1, 'one error on thing');
	assert.equal(errors.thing[0], 'is out of range [2,5]', 'basic message');
	Person.validateRangeOf('otherThing', 2, 5, {
		message: 'value out of range'
	});
	var errors2 = new Person({
		thing: 4,
		otherThing: 6
	})
		.errors();
	assert.equal(errors2.otherThing[0], 'value out of range', 'can supply a custom message');
	Person.validateRangeOf('nullValue2', 1, 5);
	Person.validateRangeOf('undefinedValue2', 1, 5);
	var errors3 = new Person({
		thing: 2,
		nullValue2: null
	})
		.errors();
	assert.equal(errors3.nullValue2.length, 1, 'one error on nullValue2');
	assert.equal(errors3.undefinedValue2.length, 1, 'one error on undefinedValue2');
});
QUnit.test('validatesNumericalityOf', function(assert) {
	Person.validatesNumericalityOf(['foo']);
	var errors;
	errors = new Person({
		foo: 0
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: 1
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: 1.5
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: -1.5
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: '1'
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: '1.5'
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: '.5'
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: '-1.5'
	})
		.errors();
	assert.ok(!errors, 'no errors');
	errors = new Person({
		foo: ' '
	})
		.errors();
	assert.equal(errors.foo.length, 1, 'one error on foo');
	errors = new Person({
		foo: '1f'
	})
		.errors();
	assert.equal(errors.foo.length, 1, 'one error on foo');
	errors = new Person({
		foo: 'f1'
	})
		.errors();
	assert.equal(errors.foo.length, 1, 'one error on foo');
	errors = new Person({
		foo: '1.5.5'
	})
		.errors();
	assert.equal(errors.foo.length, 1, 'one error on foo');
	errors = new Person({
		foo: '\t\t'
	})
		.errors();
	assert.equal(errors.foo.length, 1, 'one error on foo');
	errors = new Person({
		foo: '\n\r'
	})
		.errors();
	assert.equal(errors.foo.length, 1, 'one error on foo');
});
QUnit.test('Validate with compute (#410)', function(assert) {
	assert.expect(4);
	Person.validate('age', {
		message: 'it\'s a date type'
	}, function () {
		return !(this.date instanceof Date);
	});
	var task = new Person({
		age: 20
	}),
		errors = can.compute(function () {
			return task.errors();
		});
	errors.bind('change', function (ev, errorObj) {
		assert.equal(errorObj.age.length, 1, 'there is one error');
		assert.equal(errorObj.age.length, 1, 'there is one error');
	});
	task.attr('age', 'bad');
	task.attr('age', 'still bad');
});
QUnit.test('Validate undefined property', function(assert) {
	new can.Map().errors( "foo" );
	assert.ok(true, "does not throw" );
});
