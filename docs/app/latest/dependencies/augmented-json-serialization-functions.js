/*

Since the default implementations of the `JSON.stringify` and `JSON.parse` functions do not
support serialization of `Infinity`, `-Infinity`, `NaN`, RegExp instances or circular references
in objects, the following functions can be used when such support is required.

The value `undefined` has been left out given how objects already return the same when the
user tries to access a non-existent key. While there are situations where the presence of the
key itself matters, they are infrequent enough not to have warranted support.

Functions have also been left out as the regenerated versions (assuming it is possible to
regenerate them at all) will lose access to the original scope, and quite possibly malfunction.

*/

JSON.stringify2 = function(obj,replacer){
	if(typeof(reviver)!=="function") replacer = undefined;
	var reference = [], replace = {};
	(function(obj){
		if(typeof(obj)==="function" || obj===undefined) return;
		var i;
		// if this element is already in the reference array, return the index
		if((i=reference.indexOf(obj))!==-1) return i;
		// or else, push this element, and save the index, to be returned later
		else i = reference.push(obj)-1;
		// if this is an object (exceptions: RegExp & null)
		if(obj && typeof(obj)==="object" && !(obj instanceof RegExp)){
			var obj2 = Array.isArray(obj) ? new Array(obj.length) : {};
			// recursively process this object
			for(var key in obj)
				if(typeof(obj[key])!=="function" && obj[key]!==undefined)
					obj2[key] = arguments.callee(obj[key]);
			// mark the original object for replacement later
			replace[i] = obj2;
		}
		return i;
	})(obj);
	// replace the original objects in the reference array
	for(var i in replace) reference[i] = replace[i];
	return JSON.stringify(reference,function(key,value){
		value = ( replacer ? replacer(key,value) : value );
		if(typeof(value)==="string") return "S"+value;
		else if(value!==value) return "N"; // NaN
		else if(value===Infinity) return "I";
		else if(value===-Infinity) return "i";
		else if(value instanceof RegExp)
			return "R"+value.lastIndex+"/"+(value.ignoreCase?"i":"")+
				(value.global?"g":"")+(value.multiline?"m":"")+"/"+value.source;
		else return value;
	});
};

JSON.parse2 = function(obj_str,reviver){
	if(typeof(reviver)!=="function") reviver = undefined;
	var replace = {};
	var reference = JSON.parse(obj_str,function(key,value){
		var result;
		if(typeof(value)!=="string") result = value;
		else if(value[0]==="R"){
			var i = value.indexOf("/"), j = value.indexOf("/",i+1);
				k = new RegExp(value.substr(j+1), value.substr(i+1,j-i-1));
			k.lastIndex = parseInt(value.substr(1,i-1));
			result = k;
		} else if(value[0]==="i") result = -Infinity;
		else if(value[0]==="I") result = Infinity;
		else if(value[0]==="N") result = NaN;
		else if(value[0]==="S") result = value.substr(1);
		else throw new Error("Invalid Item");
		return ( reviver ? reviver(key,result) : result );
	});
	return (function(obj){
		// if the item is not an object or an array, return immediately
		if(!obj || typeof(obj)!=="object" || obj instanceof RegExp) return obj;
		var obj2 = Array.isArray(obj) ? new Array(obj.length) : {};
		// save a reference to new object corresponding to the index of the old one
		replace[reference.indexOf(obj)] = obj2;
		// if the item has not already been encountered, recursively process its components
		for(var key in obj) obj2[key] = replace[obj[key]] || arguments.callee(reference[obj[key]]);
		return obj2;
	})(reference[0]);
};