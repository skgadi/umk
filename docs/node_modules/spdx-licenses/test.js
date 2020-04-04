'use strict';
var assert = require('assert');
var spdxLic = require('./index');
var is = require('is2');

describe('SPDX Licenses', function() {
    it('has a version number', function(){
        var ver = spdxLic.version;
        assert.ok(is.nonEmptyStr(ver));
    });

    it('returns false for an invalid id', function(){
        var license = spdxLic.spdx();
        assert.ok(license === false);
        license = spdxLic.spdx('');
        assert.ok(license === false);
        license = spdxLic.spdx(null);
        assert.ok(license === false);
        license = spdxLic.spdx('argle');
        assert.ok(license === false);
        license = spdxLic.spdx(true);
        assert.ok(license === false);
        license = spdxLic.spdx(0);
        assert.ok(license === false);
    });

    it('returns an object for a valid id', function() {
        var license = spdxLic.spdx('MIT');
        assert.ok(is.nonEmptyObj(license));
        assert.ok(license.name === 'MIT License');
        assert.ok(license.id === 'MIT');
        assert.ok(license.OSIApproved === true);

        license = spdxLic.spdx('NOSL');
        assert.ok(is.nonEmptyObj(license));
        assert.ok(license.name === 'Netizen Open Source License');
        assert.ok(license.id === 'NOSL');
        assert.ok(license.OSIApproved === false);
    });
});
