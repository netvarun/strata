require('./proof')(1, function (step, Strata, tmp, serialize, equal) {
    var strata = new Strata({ directory: tmp, leafSize: 3, branchSize: 3, readLeafStartLength: 3 }),
            path = require('path')
    step(function () {
        serialize(path.join(__dirname, '/fixtures/split-race.before.json'), tmp, step())
    }, function () {
        strata.open(step())
    },[function () {
        strata.iterator('a', step())
    }, function (_, error) {
        equal(error.message, 'cannot find footer in last 3 bytes', 'cannot find footer')
    }])
})
