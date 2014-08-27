var test = require('tape'),
    interp = require('./');

test('interpolate', function(t) {
    t.equal(interp('#f00', '#0f0')(0), '#ff0000');
    t.equal(interp('#f00', '#0f0')(0.5), '#c9ab00');
    t.equal(interp('#f00', '#0f0')(1), '#00ff00');
    t.equal(interp('#ff0000', '#00ff00')(1), '#00ff00');
    t.end();
});
