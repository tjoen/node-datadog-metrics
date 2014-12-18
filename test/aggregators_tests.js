/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var chai = require('chai');
chai.use(require('chai-string'));

var should = chai.should();

var aggregators = require('../lib/aggregators');
var metrics = require('../lib/metrics');

describe('Aggregator', function() {
    it('should flush correctly when empty', function() {
        var agg = new aggregators.Aggregator();
        agg.flush().should.have.length(0);
    });

    it('should flush a single metric correctly', function() {
        var agg = new aggregators.Aggregator();
        agg.addPoint(metrics.Gauge, 'mykey', 23, ['mytag'], 'myhost');
        agg.flush().should.have.length(1);
    });

    it('should flush multiple metrics correctly', function() {
        var agg = new aggregators.Aggregator();
        agg.addPoint(metrics.Gauge, 'mykey', 23, ['mytag'], 'myhost');
        agg.addPoint(metrics.Gauge, 'mykey2', 42, ['mytag'], 'myhost');
        agg.flush().should.have.length(2);
    });

    it('should clear the buffer after flushing', function() {
        var agg = new aggregators.Aggregator();
        agg.addPoint(metrics.Gauge, 'mykey', 23, ['mytag'], 'myhost');
        agg.flush().should.have.length(1);
        agg.flush().should.have.length(0);
    });

    it('should update an existing metric correctly', function() {
        var agg = new aggregators.Aggregator();
        agg.addPoint(metrics.Counter, 'test.mykey', 2, ['mytag'], 'myhost');
        agg.addPoint(metrics.Counter, 'test.mykey', 3, ['mytag'], 'myhost');
        var f = agg.flush();
        f.should.have.length(1);
        f[0].should.have.deep.property('points[0][1]', 5);
    });
});

