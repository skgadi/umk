spdx-licenses
=============

A simple module to determine if a license id is a valid SPDX license and if it
is, get the full name and a flag indicating if the license is OSI approved.

Each license entry has the following information:

* name - The full name of the license, e.g. &quot;Academic Free License v3.0&quot;
* id - The abbreviated id you used to acquire the license, e.g. &quot;AFL-3.0&quot;
* OSIApproved - A boolean flag that is true when the license is OSI approved.

An exmaple license follows:

```JSON
    "MIT": {
        "name": "MIT License",
        "id": "MIT",
        "OSIApproved": true
    }
```

## Example usage

```javascript
    var spdxLicenses = require('spdx-license');
    var target = 'LGPL-3.0+';
    var license = spdxLicenses.spdx(target);

    if (license) {
        console.log('We are working with the Software Package Data Exchange® '+
            'list version: ', spdxLicenses.version);
        console.log('The full name for "LGPL-3.0+" is: '+license.name);

        if (license.OSIApproved)
            console.log('The license is OSI approved.');
        else
            console.log('The license is not OSI approved.');
    } else {
        console.error('There is no such license as '+target);
    }
```

The above results in the following output:

    We are working with the Software Package Data Exchange® list version:  1.19
    The full name for "LGPL-3.0+" is: GNU Lesser General Public License v3.0 or later
    The license is OSDI approved.

### version
The version of the SPDX License List from https://spdx.org/licenses/ - This is 
a literal non-semver-compliant string, e.g. "1.19".

### spdx(id)
Get info on a license for a given license id. And, if not a valid SPDX license
id, return false.

#### Param:
* **String** *id* The SPDX license id, e.g. &quot;MIT&quot;, &quot;Apache-2.0&quot;, etc.

#### Returns:
* **Object|Boolean** Returns an object with the info on the licese or false if there is no such license id.

## License
The MIT License (MIT)

Copyright (c) 2014 Edmond Meinfelder

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
