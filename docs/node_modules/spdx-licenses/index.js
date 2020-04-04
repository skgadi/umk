/**
 * @fileOverview A simple module to determine if a license id is a valid SPDX
 * license and if it is, get the full name and a flag indicating if the license
 * is OSI approved.
 *
 * Each license entry has the following information:
 *  name - The full name of the license, e.g. "Academic Free License v3.0"
 *  id - The abbreviated id you used to acquire the license, e.g. "AFL-3.0"
 *  OSIApproved - A boolean flag that is true when the license is OSI approved.
 *
 *  "MIT": {
 *      "name": "MIT License",
 *      "id": "MIT",
 *      "OSIApproved": true
 *  }
 */

'use strict';
var is = require('is2');
var spdx = require('./spdx');
var debug = require('debug')('spdx-licenses');
var inspect = require('util').inspect;

/**
 * The version of the SPDX License List from https://spdx.org/licenses/
 */
exports.version = '1.19';

/**
 * Get info on a license for a given license id. And, if not a valid SPDX
 * license id, return false.
 * @param {String} id The SPDX license id, e.g. "MIT", "Apache-2.0", etc.
 * @return {Object|Boolean} Returns an object with the info on the licese or false if there is no such license id.
 */
exports.spdx = function(id) {
    if (!is.nonEmptyStr(id))  {
        debug('Bad value for parameter "id" on spdx: '+inspect(id));
        return false;
    }

    var info = spdx[id];
    if (!is.nonEmptyObj(info))
        return false;

    return info;
};
