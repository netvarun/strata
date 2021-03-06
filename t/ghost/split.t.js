#!/usr/bin/env node

require('./proof')(4, function (step, Strata, tmp, deepEqual, serialize, gather, load, objectify) {
    var strata = new Strata({ directory: tmp, leafSize: 3, branchSize: 3 }), fs = require('fs')
    step(function () {
        serialize(__dirname + '/fixtures/split.before.json', tmp, step())
    }, function () {
        strata.open(step())
    }, function () {
        strata.mutator('d', step())
    }, function (cursor) {
        step(function () {
            cursor.remove(cursor.index, step())
        }, function () {
            cursor.indexOf('g', step())
        }, function (index) {
            cursor.insert('g', 'g', ~index, step())
        }, function () {
            cursor.indexOf('h', step())
        }, function (index) {
            cursor.insert('h', 'h', ~index, step())
        }, function () {
            cursor.unlock()
            gather(step, strata)
        })
    }, function (records) {
        deepEqual(records, [ 'a', 'b', 'c', 'e', 'f', 'g', 'h' ], 'records')
        objectify(tmp, step())
        load(__dirname + '/fixtures/split.after.json', step())
    }, function (actual, expected) {
        deepEqual(actual, expected, 'after tree')
        strata.balance(step())
    }, function () {
        gather(step, strata)
    }, function (records) {
        deepEqual(records, [ 'a', 'b', 'c', 'e', 'f', 'g', 'h' ], 'balanced records')
        objectify(tmp, step())
        load(__dirname + '/fixtures/split.balanced.json', step())
    }, function (actual, expected) {
        deepEqual(actual, expected, 'after balance')
        strata.close(step())
    })
})
