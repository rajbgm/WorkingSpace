(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){
/**
 * Module dependencies.
 */
var os = require('os');
var lodashGet = require('lodash.get');
var lodashFlatten = require('lodash.flatten');
var lodashUniq = require('lodash.uniq');
var flatten = require('flat');

/**
 * Main function that converts json to csv.
 *
 * @param {Object} params Function parameters containing data, fields,
 * delimiter (default is ','), hasCSVColumnTitle (default is true)
 * and default value (default is '')
 * @param {Function} [callback] Callback function
 *   if error, returning error in call back.
 *   if csv is created successfully, returning csv output to callback.
 */
module.exports = function (params, callback) {
  var hasCallback = typeof callback === 'function';
  var err;

  try {
    checkParams(params);
  } catch (err) {
    if (hasCallback) {
      return process.nextTick(function () {
        callback(err);
      });
    } else {
      throw err;
    }
  }

  var titles = createColumnTitles(params);
  var csv = createColumnContent(params, titles);

  if (hasCallback) {
    return process.nextTick(function () {
      callback(null, csv);
    });
  } else {
    return csv;
  }
};


/**
 * Check passing params.
 *
 * Note that this modifies params.
 *
 * @param {Object} params Function parameters containing data, fields,
 * delimiter, default value, mark quotes and hasCSVColumnTitle
 */
function checkParams(params) {
  params.data = params.data || [];

  // if data is an Object, not in array [{}], then just create 1 item array.
  // So from now all data in array of object format.
  if (!Array.isArray(params.data)) {
    params.data = [params.data];
  }

  if (params.flatten) {
    params.data = params.data.map(flatten);
  }

  // Set params.fields default to first data element's keys
  if (!params.fields && (params.data.length === 0 || typeof params.data[0] !== 'object')) {
    throw new Error('params should include "fields" and/or non-empty "data" array of objects');
  }

  if (!params.fields) {
    var dataFields = params.data.map(function (item) {
      return Object.keys(item);
    });

    dataFields = lodashFlatten(dataFields);
    params.fields = lodashUniq(dataFields);
  }


  //#check fieldNames
  if (params.fieldNames && params.fieldNames.length !== params.fields.length) {
    throw new Error('fieldNames and fields should be of the same length, if fieldNames is provided.');
  }

  // Get fieldNames from fields
  params.fieldNames = params.fields.map(function (field, i) {
    if (params.fieldNames && typeof field === 'string') {
      return params.fieldNames[i];
    }
    return (typeof field === 'string') ? field : (field.label || field.value);
  });

  //#check delimiter
  params.del = params.del || ',';

  //#check end of line character
  params.eol = params.eol || '';

  //#check quotation mark
  params.quotes = typeof params.quotes === 'string' ? params.quotes : '"';

  //#check double quotes
  params.doubleQuotes = typeof params.doubleQuotes === 'string' ? params.doubleQuotes : Array(3).join(params.quotes);

  //#check default value
  params.defaultValue = params.defaultValue;

  //#check hasCSVColumnTitle, if it is not explicitly set to false then true.
  params.hasCSVColumnTitle = params.hasCSVColumnTitle !== false;

  //#check include empty rows, defaults to false
  params.includeEmptyRows = params.includeEmptyRows || false;
}

/**
 * Create the title row with all the provided fields as column headings
 *
 * @param {Object} params Function parameters containing data, fields and delimiter
 * @returns {String} titles as a string
 */
function createColumnTitles(params) {
  var str = '';

  //if CSV has column title, then create it
  if (params.hasCSVColumnTitle) {
    params.fieldNames.forEach(function (element) {
      if (str !== '') {
        str += params.del;
      }
      str += JSON.stringify(element).replace(/\"/g, params.quotes);
    });
  }

  return str;
}

/**
 * Replace the quotation marks of the field element if needed (can be a not string-like item)
 *
 * @param {string} stringifiedElement The field element after JSON.stringify()
 * @param {string} quotes The params.quotes value. At this point we know that is not equal to double (")
 */
function replaceQuotationMarks(stringifiedElement, quotes) {
  var lastCharIndex = stringifiedElement.length - 1;

  //check if it's an string-like element
  if (stringifiedElement[0] === '"' && stringifiedElement[lastCharIndex] === '"') {
    //split the stringified field element because Strings are immutable
    var splitElement = stringifiedElement.split('');

    //replace the quotation marks
    splitElement[0] = quotes;
    splitElement[lastCharIndex] = quotes;

    //join again
    stringifiedElement = splitElement.join('');
  }

  return stringifiedElement;
}

/**
 * Create the content column by column and row by row below the title
 *
 * @param {Object} params Function parameters containing data, fields and delimiter
 * @param {String} str Title row as a string
 * @returns {String} csv string
 */
function createColumnContent(params, str) {
  params.data.forEach(function (dataElement) {
    //if null do nothing, if empty object without includeEmptyRows do nothing
    if (dataElement && (Object.getOwnPropertyNames(dataElement).length > 0 || params.includeEmptyRows)) {
      var line = '';
      var eol = params.newLine || os.EOL || '\n';

      params.fields.forEach(function (fieldElement) {
        var val;
        var defaultValue = params.defaultValue;
        if (typeof fieldElement === 'object' && 'default' in fieldElement) {
          defaultValue = fieldElement.default;
        }

        if (fieldElement && (typeof fieldElement === 'string' || typeof fieldElement.value === 'string')) {
          var path = (typeof fieldElement === 'string') ? fieldElement : fieldElement.value;
          val = lodashGet(dataElement, path, defaultValue);
        } else if (fieldElement && typeof fieldElement.value === 'function') {
          val = fieldElement.value(dataElement);
        }

        if (val === null || val === undefined){
          val = defaultValue;
        }

        if (val !== undefined) {
          var stringifiedElement = JSON.stringify(val);

          if (typeof val === 'object') stringifiedElement = JSON.stringify(stringifiedElement);

          if (params.quotes !== '"') {
            stringifiedElement = replaceQuotationMarks(stringifiedElement, params.quotes);
          }

          //JSON.stringify('\\') results in a string with two backslash
          //characters in it. I.e. '\\\\'.
          stringifiedElement = stringifiedElement.replace(/\\\\/g, '\\');

          if (params.excelStrings && typeof val === 'string') {
            stringifiedElement = '"="' + stringifiedElement + '""';
          }

          line += stringifiedElement;
        }

        line += params.del;
      });

      //remove last delimeter
      line = line.substring(0, line.length - 1);
      //Replace single quotes with double quotes. Single quotes are preceeded by
      //a backslash. Be careful not to remove backslash content from the string.
      line = line.split('\\\\').map(function (portion) {
        return portion.replace(/\\"/g, params.doubleQuotes);
      }).join('\\\\');
      //Remove the final excess backslashes from the stringified value.
      line = line.replace(/\\\\/g, '\\');
      //If header exists, add it, otherwise, print only content
      if (str !== '') {
        str += eol + line + params.eol;
      } else {
        str = line + params.eol;
      }
    }
  });

  return str;
}

}).call(this,require('_process'))
},{"_process":2,"flat":4,"lodash.flatten":6,"lodash.get":7,"lodash.uniq":8,"os":1}],4:[function(require,module,exports){
var isBuffer = require('is-buffer')

var flat = module.exports = flatten
flatten.flatten = flatten
flatten.unflatten = unflatten

function flatten(target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var maxDepth = opts.maxDepth
  var output = {}

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth ? currentDepth : 1
    Object.keys(object).forEach(function(key) {
      var value = object[key]
      var isarray = opts.safe && Array.isArray(value)
      var type = Object.prototype.toString.call(value)
      var isbuffer = isBuffer(value)
      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      var newKey = prev
        ? prev + delimiter + key
        : key

      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = value
    })
  }

  step(target)

  return output
}

function unflatten(target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var overwrite = opts.overwrite || false
  var result = {}

  var isbuffer = isBuffer(target)
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey(key) {
    var parsedKey = Number(key)

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1
    ) ? key
      : parsedKey
  }

  Object.keys(target).forEach(function(key) {
    var split = key.split(delimiter)
    var key1 = getkey(split.shift())
    var key2 = getkey(split[0])
    var recipient = result

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1])
      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object ? [] : {}
        )
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts)
  })

  return result
}

},{"is-buffer":5}],5:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],6:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol])
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = flatten;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
/*** Created by PraveenP on 6/3/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.AnnouncementController',
    [
        require('../services/settingSaveService').name
    ]
).controller('AnnouncementController',
    [
        '$scope','modelParam', 'settingSaveService','$modalInstance',
        function ($scope, modelParam, settingSaveService, $modalInstance) {
            var self = this;
            self.announcementModel = [];
            self.languageIndex = 0;
            self.languageId = 1033;
            self.openedStartDate = false;
            self.openedEndDate = false;

            self.saveAnnouncementData = function (postParam) {
                _.remove(postParam[self.announcementIndex].AnnouncementText, function (data) {
                    return data.Value === '';
                });
                settingSaveService.saveSettingData(modelParam.groupId, postParam, 'saveannouncements').
                    then(function () {
                    $modalInstance.close();
                });
            };

            self.defaultLanguage = function () {
                return [
                    {
                        LanguageId: 1033,
                        Value: ''
                    },
                    {
                        LanguageId: 2058,
                        Value: ''
                    }
                ];
            };

            self.constructAnnouncementModel = function () {
                var announcementModel = {
                    AnnouncementName: null,
                    AnnouncementText: self.defaultLanguage(),
                    StartDate: null,
                    EndDate: null,
                    Disabled: null,
                    SortOrder: null
                };
                return announcementModel;
            };

            self.initialization = function () {
                self.dateOptions = {
                    showWeeks: 'false'
                };

                self.announcementIndex = modelParam.index;
                if(!modelParam.isEditMode) {
                    modelParam.modelData.push(self.constructAnnouncementModel());
                }

                self.header = modelParam.header;
                self.languageList = modelParam.languageList;
                self.announcementModel = modelParam.modelData;
            };

            self.openStartDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedStartDate = true;
                self.openedEndDate = false;
            };

            self.openEndDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedEndDate = true;
                self.openedStartDate = false;
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.initialization();

        }
    ]
);
},{"../services/settingSaveService":18}],10:[function(require,module,exports){
/**
 * Created by PraveenP on 6/13/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.AuthenticationFieldController',
    [
        require('../services/settingSaveService').name,
        require('../../shared/lookupService').name
    ]
).controller('AuthenticationFieldController',
    [
        '$scope','modelParam', 'settingSaveService','$modalInstance',
        function ($scope, modelParam, settingSaveService, $modalInstance) {
            var self = this;
            self.authenticationModel = [];
            self.languageIndex = 0;
            self.languageId = 1033;
            self.openedStartDate = false;
            self.openedEndDate = false;

            self.saveAuthenticationFieldData = function (postParam) {
                _.remove(postParam[self.authenticationIndex].DisplayLabel, function (data) {
                    return data.Value === '';
                });

                _.remove(postParam[self.authenticationIndex].Instructions, function (data) {
                    return data.Value === '';
                });

                settingSaveService.saveSettingData(modelParam.groupId, postParam, 'saveauthenticationfields')
                    .then(function () {
                    $modalInstance.close();
                });
            };

            self.defaultLanguage = function () {
                return [
                    {
                        LanguageId: 1033,
                        Value: ''
                    },
                    {
                        LanguageId: 2058,
                        Value: ''
                    }
                ];
            };

            self.constructAuthenticationModel = function () {
                var authenticationModel = {
                    DisplayLabel:  self.defaultLanguage(),
                    Instructions:  self.defaultLanguage(),
                    FieldName: null,
                    Disabled: null,
                    SortOrder: null
                };
                return authenticationModel;
            };

            self.initialization = function () {
                self.fieldNameList = modelParam.lookupData.fieldNameList;
                self.dateOptions = {
                    showWeeks: 'false'
                };

                self.authenticationIndex = modelParam.index;
                if(!modelParam.isEditMode) {
                    modelParam.modelData.push(self.constructAuthenticationModel());
                }

                self.header = modelParam.header;
                self.languageList = modelParam.languageList;
                self.authenticationModel = modelParam.modelData;
            };

            self.openStartDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedStartDate = true;
                self.openedEndDate = false;
            };

            self.openEndDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedEndDate = true;
                self.openedStartDate = false;
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.initialization();
        }
    ]
);

},{"../../shared/lookupService":21,"../services/settingSaveService":18}],11:[function(require,module,exports){
/*** Created by PraveenP on 6/8/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.SettingHistoryController',
    [
        require('./settingService').name
    ]
).controller('SettingHistoryController',
    [
        '$scope', 'settingService', 'modelParam','$modalInstance', 'lookupService',
        function ($scope, settingService, modelParam, $modalInstance, lookupService) {
            var self = this;
                self.settingHistory = [];
                self.languageIndex = 0;
                self.languageId = 1033;
                self.openedStartDate = [];
                self.openedEndDate = [];

            self.getSettingData = function () {
                if(modelParam.group.dataType.match('enum')) {
                    lookupService.getLookupData(modelParam.group.settingName.Name.toLowerCase()).then(function (data) {
                        self.enumList = data.data;
                    });
                }
                settingService.editSetting(modelParam.group.settingName, modelParam.group.groupId).
                    then(function (response) {
                    self.settingHistory.push(response.data);
                    self.languageList = modelParam.languageList;
                    self.dateOptions = {
                        showWeeks: 'false'
                    };
                });
            };

            self.deleteSetting = function (row) {
                self.settingHistory[0].SettingValue.splice(row, 1);
            };

            self.saveSetting = function (postParam) {


                settingService.saveSetting(modelParam.group.groupId, postParam).then(function () {
                    $modalInstance.close();
                });
            };

            self.openStartDatePicker = function ($event, index) {
                $event.preventDefault();
                $event.stopPropagation();
                self.openedStartDate[index] = true;
                self.openedEndDate[index] = false;
            };

            self.openEndDatePicker = function ($event, index) {
                $event.preventDefault();
                $event.stopPropagation();
                self.openedEndDate[index] = true;
                self.openedStartDate[index] = false;
            };

            self.addSetting = function (dataType) {
                var defaultValue = dataType === 'bool' ? 'false' : '';
                var localizedValue = [
                    {
                        LanguageId: 1033,
                        Value: defaultValue
                    },
                    {
                        LanguageId: 2058,
                        Value: defaultValue
                    }
                ];
                var settingValueModel = {
                    Disabled: false,
                    EndDate: null,
                    StartDate: null,
                    LocalizedValue: localizedValue
                };
                if (!self.settingHistory[0].SettingValue) {
                    self.settingHistory[0].SettingValue = [];
                }
                self.settingHistory[0].SettingValue.push(settingValueModel);
            };

            self.settingValueChange = function (value, settingValueModel) {
                if (value === 'false' || value === 'False') {
                    settingValueModel.LocalizedValue[0].Value = 'true';
                }
                else {
                    settingValueModel.LocalizedValue[0].Value = 'false';
                }
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.getSettingData();
        }
    ]
);

},{"./settingService":13}],12:[function(require,module,exports){
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.SettingListController',
    [
        require('../pointsMatrix/pointsMatrixController').name,
        require('../announcements/announcementController').name,
        require('../authenticationFields/authenticationFieldController').name,
        require('../introScreens/introScreenController').name,
        require('../marketingTiles/marketingTileController').name,
        require('../myCompany/myCompanyController').name,
        require('./settingHistoryController').name,
        require('./settingService').name,
        require('../services/settingSaveService').name,
        require('../../shared/primaryModal').name,
        require('../../shared/lookupService').name
    ]
).controller('SettingListController',
    [
        '$scope', 'settingService', '$location', 'primaryModal','settingSaveService', 'lookupService',
        function ($scope, settingService, $location, primaryModal, settingSaveService, lookupService) {
            var self = this;
            self.lookupData = [];
            self.pointMatrixData = [];

            self.saveSetting = function () {
                $scope.response = settingService.createSetting($scope.setting);
            };

            self.getSettingType = function (settingName) {
                var settings = {
                    PointsMatrix: 'Complex',
                    Announcements:  'Complex',
                    AuthenticationFields:  'Complex',
                    IntroScreen: 'Complex',
                    MarketingTiles: 'Complex',
                    MyCompany: 'Complex',
                    SettingNameValueCollection: 'General'
                };
                return settings[settingName];
            };

            self.getCurrentSettings = function () {
                if(self.getSettingType($scope.settingMenuData.ClassType[0]) === 'Complex')
                {
                    settingService.getSettingData($scope.settingMenuData.ClassType[0], $scope.group.groupId)
                        .then(function (data) {
                            self.constructSettingGrid(data, $scope.settingMenuData.ClassType[0]);
                        });
                }
                else
                {
                    settingService.viewCurrentSetting($scope.settingMenuData, $scope.group.groupId)
                        .then(function (data) {
                            self.constructSettingGrid(data, $scope.settingMenuData.ClassType[0]);
                        });
                }
            };

            self.getSettingData = function (settingName) {
                if(settingName === 'SettingNameValueCollection')
                {
                    self.getCurrentSettings();
                }
                else
                {
                    settingService.getSettingData(settingName, $scope.group.groupId)
                        .then(function (data) {
                            self.constructSettingGrid(data, settingName );
                        });
                }
            };

            self.constructSettingGrid = function (data, settingName) {
                self.hideFilter = ((settingName === 'SettingNameValueCollection') ||
                    (settingName === 'AuthenticationFields'));
                self.showCurrentSetting = false;
                var settings = {
                    PointsMatrix: function () {
                        self.pointMatrixData = data.data;
                        lookupService.getLookupData('precondition').then(function (data) {
                            self.lookupData.preConditionList = data.data;
                        });
                        lookupService.getLookupData('pointsfrequency').then(function (data) {
                            self.lookupData.pointsFrequency = data.data;
                        });
                        lookupService.getLookupData('actioncategory').then(function (response) {
                            self.lookupData.actionCategory = response.data;
                            _.forEach(self.pointMatrixData, function (pointsData) {
                                _.find(self.lookupData.actionCategory, function (actionData) {
                                     if(actionData.Id === pointsData.ActionCategoryID) {
                                         pointsData.ActionDisplayName = actionData.Value;
                                     }
                                });
                                _.find(self.lookupData.pointsFrequency, function (frequencyData) {
                                    if(frequencyData.Id === pointsData.FrequencyDays) {
                                        pointsData.PointsFrequencyName = frequencyData.Value;
                                    }
                                });
                                _.forEach(self.lookupData.preConditionList, function (preConditionData, index) {
                                     if(preConditionData.Id === pointsData.PreCondition[index])
                                     {
                                         if(!pointsData.PreConditionDisplayName) {
                                             pointsData.PreConditionDisplayName = '';
                                         }
                                         pointsData.PreConditionDisplayName += preConditionData.Value +' ';
                                     }
                                });
                            });
                        });
                    },
                    Announcements: function() {self.settingsAnnouncementData = data.data;},
                    AuthenticationFields: function() {
                        self.authenticationFieldData = data.data;
                        lookupService.getLookupData('fieldname').then(function (data) {
                            self.lookupData.fieldNameList = data.data;
                            _.forEach(self.authenticationFieldData, function (authData) {
                                _.find(self.lookupData.fieldNameList, function (lookupData) {
                                    if(lookupData.Id === authData.FieldName) {
                                        authData.DisplayFieldName = lookupData.Value;
                                    }
                                });
                            });
                        });

                    },
                    IntroScreen: function () {self.introScreenData = data.data;},
                    MarketingTiles: function () {self.marketingTileData = data.data;},
                    MyCompany: function () {self.myCompanyData = data.data;},
                    SettingNameValueCollection: function () {self.settingsGrid.data = data.data;}
                };
                return settings[settingName]();
            };

            self.modelParam = function (screen, settingData, index, isEditMode) {
                return {
                    header: screen,
                    isEditMode: isEditMode,
                    index: index === null ? (settingData.length === null ? 0 : settingData.length) : index,
                    modelData: settingData,
                    groupId: $scope.group.groupId,
                    languageList : $scope.languageList,
                    lookupData: self.lookupData
                };
            };

            /* Points Matrix*/
            self.createEditPointMatrix = function (pointMatrixData, pointsMatrixIndex, isEditMode) {
                var primaryModalParam = {
                    template: 'partials/settings/pointsMatrixCreateEdit.html',
                    controller: 'PointsMatrixController as pointsMatrixCtrl',
                    modelParam: self.modelParam('Point Matrix', pointMatrixData, pointsMatrixIndex, isEditMode),
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            /*Announcement */
            self.createEditAnnouncement = function (announcementData, announcementIndex, isEditMode) {
                var primaryModalParam = {
                    template: 'partials/settings/announcementScreen.html',
                    controller: 'AnnouncementController as announcementCtrl',
                    modelParam: self.modelParam('Announcement',announcementData, announcementIndex, isEditMode ),
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            /*Intro Screen */
            self.createEditIntroScreen = function (introScreenData, introIndex, isEditMode) {
                var primaryModalParam = {
                    template: 'partials/settings/introScreen.html',
                    controller: 'IntroScreenController as introScreenCtrl',
                    modelParam: self.modelParam('Intro Screen',introScreenData, introIndex, isEditMode ),
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            /*Authentication Field */
            self.createEditAuthField = function (authFieldData, authIndex, isEditMode) {
                var primaryModalParam = {
                    template: 'partials/settings/authenticationFieldScreen.html',
                    controller: 'AuthenticationFieldController as authenticationCtrl',
                    modelParam: self.modelParam('AuthenticationField Screen',authFieldData, authIndex, isEditMode ),
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            /*Marketing Tile */
            self.createEditMarketingTileScreen = function (marketingTileData, tileIndex, isEditMode) {
                var primaryModalParam = {
                    template: 'partials/settings/marketingTileScreen.html',
                    controller: 'MarketingTileController as marketingTileCtrl',
                    modelParam: self.modelParam('Marketing Tile',marketingTileData, tileIndex, isEditMode ),
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            /*My Company*/
            self.createEditMyCompanyScreen = function (myCompanyData, companyIndex, isEditMode) {
                var primaryModalParam = {
                    template: 'partials/settings/myCompany.html',
                    controller: 'MyCompanyController as myCompanyCtrl',
                    modelParam: self.modelParam('My Company',myCompanyData, companyIndex, isEditMode ),
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            self.settingsGrid =
            {
                enableSorting: true,
                enableGridMenu: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                noUnselect: true,
                multiSelect: false,
                columnDefs: [
                    { name: 'Setting Name', width: 300, field: 'SettingName.MetaData.DisplayName',
                        enableColumnResizing: true, cellTooltip: function(row) {
                        if(row.entity.SettingName) {
                            return row.entity.SettingName.MetaData.Description;
                        }
                    }
                    },
                    { name: 'Setting Value', width: 400, field: 'SettingValue[0].LocalizedValue[0].Value',
                        cellTooltip: true
                    },
                    { name: 'Setting From', field: 'SettingName.MetaData.SettingsFromGroupName', cellTooltip: true},
                    { name: 'Start Date', field: 'SettingValue[0].StartDate', visible: false,
                        cellFilter: 'date:\'yyyy-MM-dd\''
                    },
                    { name: 'End Date', field: 'SettingValue[0].EndDate', visible: false,
                        cellFilter: 'date:\'yyyy-MM-dd\''
                    },
                    { name: 'Disabled', field: 'SettingValue[0].Disabled' }
                ]
            };
            self.settingsGrid.enableVerticalScrollbar = false;

            self.settingsGrid.onRegisterApi = function (gridApi) {
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, self.settingsGridCallBack);
            };

            self.settingsGridCallBack = function (row) {
                $scope.group.dataType = row.entity.SettingName.MetaData.DataType;
                $scope.group.settingName = row.entity.SettingName;
                self.nonLocalizableModel();
            };

            self.nonLocalizableModel = function () {
                var modelParam = {
                    group: $scope.group,
                    languageList: $scope.languageList
                };
                var primaryModalParam = {
                    template: 'partials/settings/settingHistory.html',
                    controller: 'SettingHistoryController as settingHistoryCtrl',
                    modelParam: modelParam,
                    size: 'lg'
                };
                primaryModal.launchPrimaryModal(primaryModalParam);
            };

            self.setSortOrder = function (settingData, saveMethod) {
                _.forEach(settingData, function (data, index) {
                    data.SortOrder = index + 1;
                });
                settingSaveService.saveSettingData($scope.group.groupId, settingData, saveMethod);
            };

            self.onDropComplete = function (index, obj, saveMethod, settingData) {
                var otherObj = settingData[index];
                var otherIndex = settingData.indexOf(obj);
                settingData[index] = obj;
                settingData[otherIndex] = otherObj;
                self.setSortOrder(settingData, saveMethod);
            };

            self.filterCurrentSettings = function (showCurrentSetting, settingName) {
                var settings = {
                    Points:  function () {
                        self.pointMatrixData = self.customFilter(showCurrentSetting, self.pointMatrixData);
                    },
                    Announcements: function () {
                        self.settingsAnnouncementData = self.customFilter(showCurrentSetting,
                            self.settingsAnnouncementData);
                    },
                    AuthenticationFields: function () {
                        self.authenticationFieldData = self.customFilter(showCurrentSetting,
                            self.authenticationFieldData);
                    },
                    IntroScreen: function () {
                        self.introScreenData = self.customFilter(showCurrentSetting, self.introScreenData);
                    },
                    MarketingTiles: function () {
                        self.marketingTileData = self.customFilter(showCurrentSetting, self.marketingTileData);
                    },
                    MyCompany: function () {
                        self.myCompanyData = self.customFilter(showCurrentSetting, self.myCompanyData);
                    }
                };
                return settings[settingName]();
            };

            self.customFilter = function (showCurrentSetting, complexSettingData) {
                var currentComplexSettingsData = [];
                if(showCurrentSetting) {
                    self.settingData = '';
                    self.settingData = complexSettingData;
                    _.filter(complexSettingData, function (data) {
                        if(new Date(data.StartDate) <= new Date() && new Date(data.EndDate) >= new Date())
                        {
                            currentComplexSettingsData.push(data);
                        }
                    });
                    complexSettingData = '';
                    complexSettingData = currentComplexSettingsData;
                }
                else
                {
                    complexSettingData = '';
                    complexSettingData = self.settingData;
                }
                return complexSettingData;
            };

            self.getCurrentSettings();
        }
    ]
);
},{"../../shared/lookupService":21,"../../shared/primaryModal":22,"../announcements/announcementController":9,"../authenticationFields/authenticationFieldController":10,"../introScreens/introScreenController":14,"../marketingTiles/marketingTileController":15,"../myCompany/myCompanyController":16,"../pointsMatrix/pointsMatrixController":17,"../services/settingSaveService":18,"./settingHistoryController":11,"./settingService":13}],13:[function(require,module,exports){
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.settingService',
    [
         require('../../shared/restfulRepo').name
    ]
).service('settingService',
    [
        'restfulRepo',
        function (restfulRepo) {
            return {

                viewSetting: function (groupId) {
                    var apiEndPoint = '/settings/' + groupId + '/false';
                    return restfulRepo.getMethod(apiEndPoint);
                },

                viewCurrentSetting: function (settingMenu, groupId)
                {
                    var apiEndPoint = '/admin/menusettings/' + groupId + '/' +
                         settingMenu.MenuIdentifier + '/' + settingMenu.ClassType[0];
                    return restfulRepo.getMethod(apiEndPoint);
                },

                editSetting: function (settingMenu, groupId) {
                    var apiEndPoint = '/admin/expandedsettings/' + groupId + '/'+ settingMenu.Name ;
                    return restfulRepo.getMethod(apiEndPoint);
                },

                getSettingMenu: function () {
                    var apiEndPoint = '/admin/menu';
                    return restfulRepo.getMethod(apiEndPoint);
                },

                saveSetting: function (groupId, putParam) {
                    var apiEndPoint = '/admin/save/' + groupId;
                    return restfulRepo.postMethod(putParam, apiEndPoint);
                },

                getSettingData: function (settingName, groupId) {
                    var apiEndPoint = '/admin/'+settingName.toLowerCase()+'/' + groupId;
                    return restfulRepo.getMethod(apiEndPoint);
                },

                clearSettingCache: function () {
                    return restfulRepo.postCache('/cache');
                }
            };
        }
    ]
);
},{"../../shared/restfulRepo":23}],14:[function(require,module,exports){
/**
 * Created by PraveenP on 6/20/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.IntroScreenController',
    [
        require('../services/settingSaveService').name
    ]
).controller('IntroScreenController',
    [
        '$scope','modelParam', 'settingSaveService','$modalInstance',
        function ($scope, modelParam, settingSaveService, $modalInstance) {
            var self = this;
            self.introScreenModel = [];
            self.languageIndex = 0;
            self.languageId = 1033;
            self.openedStartDate = false;
            self.openedEndDate = false;

            self.saveIntroScreenData = function (postParam) {
                _.remove(postParam[self.introScreenIndex].Header, function (data) {
                    return data.Value === '';
                });

                _.remove(postParam[self.introScreenIndex].Title, function (data) {
                    return data.Value === '';
                });

                _.remove(postParam[self.introScreenIndex].Content, function (data) {
                    return data.Value === '';
                });

                settingSaveService.saveSettingData(modelParam.groupId, postParam, 'saveintroscreens').
                    then(function () {
                        $modalInstance.close();
                    });
            };

            self.defaultLanguage = function () {
                return [
                    {
                        LanguageId: 1033,
                        Value: ''
                    },
                    {
                        LanguageId: 2058,
                        Value: ''
                    }
                ];
            };

            self.constructIntroScreenModel = function () {
                var introScreenModel = {
                        Header: self.defaultLanguage(),
                        Title: self.defaultLanguage(),
                        Content: self.defaultLanguage(),
                        Image: null,
                        StartDate: null,
                        EndDate: null,
                        SortOrder: null
                };
                return introScreenModel;
            };


            self.initialization = function () {
                self.dateOptions = {
                    showWeeks: 'false'
                };

                self.introScreenIndex = modelParam.index;
                if(!modelParam.isEditMode) {
                    modelParam.modelData.push(self.constructIntroScreenModel());
                }

                self.header = modelParam.header;
                self.languageList = modelParam.languageList;
                self.introScreenModel = modelParam.modelData;
            };

            self.openStartDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                self.openedStartDate = true;
                self.openedEndDate = false;
            };

            self.openEndDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                self.openedEndDate = true;
                self.openedStartDate = false;
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.initialization();
        }
    ]
);

},{"../services/settingSaveService":18}],15:[function(require,module,exports){
/**
 * Created by PraveenP on 6/29/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.MarketingTileController',
    [
        require('../services/settingSaveService').name
    ]
).controller('MarketingTileController',
    [
        '$scope','modelParam', 'settingSaveService','$modalInstance',
        function ($scope, modelParam, settingSaveService, $modalInstance) {
            var self = this;
            self.marketingTileModel = [];
            self.languageIndex = 0;
            self.languageId = 1033;
            self.openedStartDate = false;
            self.openedEndDate = false;

            self.saveMarketingTileData = function (postParam) {
                _.remove(postParam[self.marketingIndex].Header, function (data) {
                    return data.Value === '';
                });
                _.remove(postParam[self.marketingIndex].Text, function (data) {
                    return data.Value === '';
                });
                _.remove(postParam[self.marketingIndex].LinkText, function (data) {
                    return data.Value === '';
                });
                settingSaveService.saveSettingData(modelParam.groupId, postParam, 'savemarketingtiles').
                    then(function () {
                        $modalInstance.close();
                    });
            };

            self.defaultLanguage = function () {
                return [
                    {
                        LanguageId: 1033,
                        Value: ''
                    },
                    {
                        LanguageId: 2058,
                        Value: ''
                    }
                ];
            };

            self.constructMarketingTileModel = function () {
                var marketingModel = {
                    Header: self.defaultLanguage(),
                    Text: self.defaultLanguage(),
                    Name: null,
                    LinkText: self.defaultLanguage(),
                    Image: null,
                    Link: null,
                    StartDate :  null ,
                    EndDate: null,
                    Priority: null,
                    Disabled: null,
                    SortOrder: null
                };
                return marketingModel;
            };

            self.initialization = function () {
                self.dateOptions = {
                    showWeeks: 'false'
                };

                self.marketingIndex = modelParam.index;
                if(!modelParam.isEditMode) {
                    modelParam.modelData.push(self.constructMarketingTileModel());
                }

                self.header = modelParam.header;
                self.languageList = modelParam.languageList;
                self.marketingTileModel = modelParam.modelData;
            };

            self.openStartDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedStartDate = true;
                self.openedEndDate = false;
            };

            self.openEndDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedEndDate = true;
                self.openedStartDate = false;
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.initialization();
        }
    ]
);

},{"../services/settingSaveService":18}],16:[function(require,module,exports){
/**
 * Created by PraveenP on 7/27/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.MyCompanyController',
    [
        require('../services/settingSaveService').name
    ]
).controller('MyCompanyController',
    [
        '$scope','modelParam', 'settingSaveService','$modalInstance',
        function ($scope, modelParam, settingSaveService, $modalInstance) {
            var self = this;
            self.myCompanyModel = [];
            self.languageIndex = 0;
            self.languageId = 1033;
            self.glyphiconDisplayTextClass = [];
            self.glyphiconTitleClass = [];
            self.openedStartDate = false;
            self.openedEndDate = false;
            self.effectiveDate = false;

            self.saveMyCompanyData = function (postParam) {
                _.remove(postParam[self.myCompanyIndex].Title, function (data) {
                    return data.Value === '';
                });

                _.remove(postParam[self.myCompanyIndex].DisplayText, function (data) {
                    return data.Value === '';
                });
                settingSaveService.saveSettingData(modelParam.groupId, postParam, 'savemycompany')
                    .then(function () {
                        $modalInstance.close();
                    });
            };

            self.defaultLanguage = function () {
                return [
                    {
                        LanguageId: 1033,
                        Value: ''
                    },
                    {
                        LanguageId: 2058,
                        Value: ''
                    }
                ];
            };

            self.constructMyCompanyModel = function () {
                var myCompanyModel = {
                    Title: self.defaultLanguage(),
                    DisplayText: self.defaultLanguage(),
                    TargetURL: null,
                    StartDate: null,
                    EndDate: null,
                    EffectiveDate: null,
                    SortOrder: null,
                    Disabled: null
                };
                return myCompanyModel;
            };

            self.initialization = function () {
                self.dateOptions = {
                    showWeeks: 'false'
                };

                self.myCompanyIndex = modelParam.index;
                if(!modelParam.isEditMode) {
                    modelParam.modelData.push(self.constructMyCompanyModel());
                }

                self.header = modelParam.header;
                self.languageList = modelParam.languageList;
                self.myCompanyModel = modelParam.modelData;
            };

            self.openStartDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedStartDate = true;
                self.openedEndDate = false;
                self.effectiveDate = false;
            };

            self.openEndDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedEndDate = true;
                self.openedStartDate = false;
                self.effectiveDate = false;
            };

            self.openEffectiveDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.effectiveDate = true;
                self.openedEndDate = false;
                self.openedStartDate = false;
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.initialization();
        }
    ]
);


},{"../services/settingSaveService":18}],17:[function(require,module,exports){
/*** Created by PraveenP on 5/27/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.PointsMatrixController',
    [
        require('../../shared/lookupService').name,
        require('../services/settingSaveService').name
    ]
).controller('PointsMatrixController',
    [
        '$scope','lookupService','modelParam', 'settingSaveService','$modalInstance',
        function ($scope, lookupService, modelParam, settingSaveService, $modalInstance) {
            var self = this;
                self.pointMatrixModel = [];
                self.languageIndex = 0;
                self.languageId = 1033;
                self.openedStartDate = false;
                self.openedEndDate = false;
                self.openedCalendarStartDate = false;

            self.savePointsMatrix = function (postParam) {
                //todo: very ugly need to revisit
                self.preCondition = [];
                _.forEach(postParam[self.pointsIndex].PreCondition, function (data) {
                    self.preCondition.push(data.Id);
                });
                postParam[self.pointsIndex].PreCondition = self.preCondition;
                settingSaveService.saveSettingData(modelParam.groupId, postParam, 'savepointsmatrix').then(function ()
                {
                    $modalInstance.close();
                });
            };

            self.defaultLanguage = function () {
                return [
                    {
                        LanguageId: 1033,
                        Value: ''
                    }
                ];
            };

            self.constructPointMatrixModel = function () {
                var pointMatrixModel = {
                    InstancePoints: null,
                    MaxInstances: null,
                    FrequencyMaxInstances: null,
                    StartDate: null,
                    EndDate: null,
                    CalendarStartDate: null,
                    ActionCategoryTitle:  self.defaultLanguage(),
                    ActionCategoryText:  self.defaultLanguage(),
                    PreCondition: [],
                    Disabled: null,
                    Icon: null,
                    SortOrder: null,
                    ActionCategoryID: null
                };
                return pointMatrixModel;
            };

            self.initialization = function () {
                self.actionCategory = modelParam.lookupData.actionCategory;
                self.pointsFrequency = modelParam.lookupData.pointsFrequency;
                self.customPreCondition = [];
                self.dateOptions = {
                    showWeeks: 'false'
                };

                self.pointsIndex = modelParam.index;
                if(!modelParam.isEditMode) {
                    modelParam.modelData.push(self.constructPointMatrixModel());
                }

                self.header = modelParam.header;
                self.languageList = modelParam.languageList;
                lookupService.getLookupData('precondition').then(function (data) {
                    self.preConditionList = data.data;
                    //todo: very ugly need to revisit
                    _.forEach(self.preConditionList, function (lookupData){
                        _.forEach(modelParam.modelData[self.pointsIndex].PreCondition, function(data) {
                            if(lookupData.Id === data)
                            {
                                self.customPreCondition.push(lookupData);
                            }
                        });
                    });
                    modelParam.modelData[self.pointsIndex].PreCondition =  self.customPreCondition;
                    self.pointMatrixModel = modelParam.modelData;
                });
            };

            self.openStartDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedStartDate = true;
                self.openedEndDate = false;
                self.openedCalendarStartDate = false;
            };

            self.openEndDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedEndDate = true;
                self.openedStartDate = false;
                self.openedCalendarStartDate = false;
            };

            self.openCalendarStartDatePicker = function ($event) {
                $scope.$emit('date_picker', $event);
                self.openedCalendarStartDate = true;
                self.openedEndDate = false;
                self.openedStartDate = false;
            };

            self.languageChange = function (languageId) {
                if(languageId === 1033)
                {
                    self.languageIndex = 0;
                }
                else
                {
                    self.languageIndex = 1;
                }
            };

            self.initialization();
        }
    ]
);

},{"../../shared/lookupService":21,"../services/settingSaveService":18}],18:[function(require,module,exports){
/**
 * Created by PraveenP on 6/14/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.settingSaveService',
    [
        require('../../shared/restfulRepo').name
    ]
).service('settingSaveService',
    [
        'restfulRepo',
        function (restfulRepo) {
            return {

                saveSettingData: function (groupId, postParam, methodName) {
                    var apiEndPoint = '/admin/'+methodName+'/' + groupId;
                    return restfulRepo.postMethod(postParam, apiEndPoint);
                }
            };
        }
    ]
);


},{"../../shared/restfulRepo":23}],19:[function(require,module,exports){
/*** Created by PraveenP on 4/7/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.shared.GroupSearchController',
    [
        require('./groupService').name,
        require('../../settings/groupSetting/settingListController').name,
        require('../../userCreationTool/testUsersController.js').name,
        require('../../userCreationTool/creationController.js').name
    ]
).controller('GroupSearchController',
    [
        '$scope', 'groupService',
        function ($scope, groupService) {
            var self = this;
            self.pageCount = 1;
            self.isDeepSearch = false;
            self.totalPageCount = 0;
            self.pageNumber = 1;
            self.prevClass = 'paginate_button previous disabled';
            self.nextClass = 'paginate_button next';

            self.gridOptions =
            {
                enablePaginationControls: false,
                enableSorting: true,
                enableGridMenu: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                noUnselect: true,
                multiSelect: false,
                columnDefs: [
                    { name: 'GroupID', field: 'GroupID' , visible: false},
                    { name: 'Group Name', field: 'GroupName' },
                    { name: 'Address', field: 'GroupAddress1' },
                    { name: 'Phone Number', field: 'GroupPhoneNo' },
                    { name: 'City', field: 'GroupCity' },
                    { name: 'State', field: 'GroupState' }
                ]
            };

            self.searchGroup = function ($event) {
                if ($scope.search && $event.which === 13) {
                    self.isDeepSearch = true;
                    groupService.groupSearch($scope.group.groupId, $scope.search, 1).then(function (data) {
                        self.gridOptions.data = data.data.Groups;
                        self.totalPageCount = data.data.totalCount;
                    });
                }
            };

            self.gridOptions.onRegisterApi = function (gridApi) {
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, self.rowSelectCallBack);
            };

            self.rowSelectCallBack = function (row) {
                self.assignGroupData(row.entity.GroupID, row.entity.GroupName);
               self.getBreadCrumb();
            };

            self.getBreadCrumb = function () {
                self.isDeepSearch = false;
                groupService.getBreadCrumbData($scope.group.groupId).then(function (response) {
                    $scope.group.breadCrumb = response.data;
                });
                self.getGridData();
            };

            self.assignGroupData = function (groupId, groupName) {
                $scope.group.isSelected = true;
                $scope.group.groupId = groupId;
                $scope.group.groupName = groupName;

            };

            self.customPagination = function () {
                if (self.pageNumber ===  self.pageCount) {
                    self.nextClass = 'paginate_button next disabled';
                }
                else
                {
                    self.nextClass = 'paginate_button next';
                }

                if (self.pageCount > 1) {
                    self.prevClass = 'paginate_button previous';
                }
                else
                {
                    self.prevClass = 'paginate_button next disabled';
                }

            };

            self.getGroupList = function (groupId, pageNumber) {
                groupService.getGroupList(groupId, pageNumber).then(function (data) {
                    self.gridOptions.data = data.data.Groups;
                    self.totalPageCount = data.data.totalCount;
                    self.pageNumber = Math.ceil(data.data.totalCount/ 10);
                    groupService.getBreadCrumbData($scope.group.groupId).then(function (response) {
                        $scope.group.breadCrumb = response.data;
                    });      
                    self.customPagination();
                });
            };

            self.selectedGroup = function (selectedGroupData) {
                self.isDeepSearch = false;
                $scope.group.isSelected = true;
                $scope.group.groupId = selectedGroupData.GroupId;
                $scope.group.groupName = selectedGroupData.GroupName;

                self.getBreadCrumb();
            };

            self.getGridData = function () {
                if (self.isDeepSearch) {
                    groupService.groupSearch($scope.group.groupId, $scope.search, self.pageCount).
                        then(function (data) {
                        self.gridOptions.data = data.data.Groups;
                        self.totalPageCount = data.data.totalCount;
                    });
                }
                else {
                    self.getGroupList($scope.group.groupId, self.pageCount);
                }
            };

            self.previousPage = function () {
                if(self.prevClass === 'paginate_button previous')
                {
                    self.pageCount --;
                    self.getGridData();
                }
            };

            self.nextPage = function () {
                if(self.nextClass === 'paginate_button next')
                {
                    self.pageCount++;
                    self.getGridData();
                }
            };

            self.getPage = function (pageNumber) {
                if(pageNumber) {
                    self.pageCount = pageNumber;
                    self.getGridData();
                }
            };

            $scope.$on('GroupList', function () {
                self.getBreadCrumb();
            });
        }
    ]
);
},{"../../settings/groupSetting/settingListController":12,"../../userCreationTool/creationController.js":25,"../../userCreationTool/testUsersController.js":28,"./groupService":20}],20:[function(require,module,exports){
'use strict';

module.exports = angular.module(
    'onlife.admin.shared.groupService',
    [
         require('../../shared/restfulRepo').name
    ]
).service('groupService',
    [
        'restfulRepo',
        function (restfulRepo) {
            return {

                getGroupData: function () {
                    var apiEndPoint = '/group';
                    return restfulRepo.getMethod(apiEndPoint);
                },

                groupSearch : function (groupId, searchString, pageNumber) {
                    var apiEndPoint = '/admin/Search/'+groupId+'/' + searchString +'/'+pageNumber;
                    return restfulRepo.getMethod(apiEndPoint);
                },
                getBreadCrumbData: function (parentGroupId) {
                  var apiEndPoint = '/admin/GroupBreadcrumb/'+parentGroupId;
                    return restfulRepo.getMethod(apiEndPoint);
                },

                getGroupList: function (parentGroupId, pageNumber) {
                    var apiEndPoint = '/admin/subgroups/'+parentGroupId + '/'+pageNumber;
                    return restfulRepo.getMethod(apiEndPoint);
                }

            };
        }
    ]
);
},{"../../shared/restfulRepo":23}],21:[function(require,module,exports){
/**
 * Created by praveenp on 5/6/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.lookupService',
    [
        require('./restfulRepo').name
    ]
).service('lookupService',
    [
        'restfulRepo',
        function (restfulRepo) {
            return {
                getLookupData: function (name) {
                    var apiEndPoint = '/admin/lookups/'+ name;
                    return restfulRepo.getMethod(apiEndPoint);
                }
            };
        }
    ]
);

},{"./restfulRepo":23}],22:[function(require,module,exports){
/**
 * Created by PraveenP on 5/27/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.primaryModal',
    [

    ]
).service('primaryModal',
    [
        '$modal', '$state',
        function ($modal, $state) {
            return {

                launchPrimaryModal: function (primaryModalParam) {
                    var modelpopup = $modal.open({
                        templateUrl: primaryModalParam.template,
                        controller: primaryModalParam.controller,
                        size: primaryModalParam.size,
                        scope: primaryModalParam.scope,
                        resolve: {
                            modelParam: function () {
                                return primaryModalParam.modelParam;
                            }
                        }
                    });

                    modelpopup.result.then(function () {
                        $state.go($state.current, {}, {reload: true});
                    }, function () {
                        $state.go($state.current, {}, {reload: true});
                    });
                }
            };
        }
    ]
);
},{}],23:[function(require,module,exports){
'use strict';

module.exports = angular.module(
    'onlife.admin.settings.restfulRepo',
    [

    ]
).service('restfulRepo', ['$http', 'notify', '$timeout', function ($http, notify, $timeout) {
        var self = this;

        var config = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        };

        var buildUrl = function (resourceUrl) {
            return baseURL + resourceUrl;
        };

        self.postMethod = function (postParam, apiEndPoint) {
            return $http({
                method: 'POST',
                url: buildUrl(apiEndPoint),
                data: JSON.stringify(postParam),
                config: config
            }).success(function () {
                $timeout(function () {
                    notify({ message: 'The Data Have Been Saved',
                        classes: 'alert-success',
                        templateUrl: 'partials/settingNotification.html'});
                }, 2000);
            }).error(function () {
                $timeout(function () {
                    notify({ message: 'Oops!! !!!!!!',
                        classes: 'alert-danger',
                        templateUrl: 'partials/settingNotification.html'});
                }, 2000);
            });
        };

        self.getMethod = function (apiEndPoint) {
            return $http({
                method: 'GET',
                url: buildUrl(apiEndPoint),
                config: config
            }).error(function () {
                $timeout(function () {
                    notify({ message: 'Oops!! !!!!!!',
                        classes: 'alert-danger',
                        templateUrl: 'partials/settingNotification.html'});
                }, 2000);
            });
        };

        self.putMethod = function (postParam, apiEndPoint) {
            return $http({
                method: 'PUT',
                url: buildUrl(apiEndPoint),
                data: JSON.stringify(postParam),
                config: config
            });
        };

        self.postCache = function (apiEndPoint) {
            return $http({
                method: 'POST',
                url: buildUrl(apiEndPoint),
                data: JSON.stringify(''),
                config: config
            }).success(function (data) {
                if (data) {
                    notify({ message: 'Cache Cleared',
                        classes: 'alert-success',
                        templateUrl: 'partials/settingNotification.html'});
                }
            }).error(function () {
                notify({ message: 'Oops!! !!!!!!',
                    classes: 'alert-danger',
                    templateUrl: 'partials/settingNotification.html'});
            });
        };
    }]);
},{}],24:[function(require,module,exports){
/**
 * Created by PraveenP on 6/16/2016.
 */
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.home',
    [
        'ui.router',
        'ui.bootstrap',
        'cgNotify',
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.autoResize',
        'ui.select',
        require('../userCreationTool/userController.js').name,
        require('../shared/groupSearch/groupSearchController.js').name,
        require('../shared/restfulRepo.js').name
    ]
).config(
    [
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('userCreationIndex');

            $stateProvider.state('userCreationIndex', {
                url: '/userCreationIndex',
                templateUrl: 'partials/sharedViews/groupSearch.html'
            }).
                state('createUser', {
                    url: '/createUser',
                    templateUrl: 'partials/userCreationTool/createUser.html'
                }).
                state('testUsers',
                {
                    url: '/testUsers',
                    templateUrl: 'partials/userCreationTool/testUsers.html'
                });
                
        }

    ]);
},{"../shared/groupSearch/groupSearchController.js":19,"../shared/restfulRepo.js":23,"../userCreationTool/userController.js":30}],25:[function(require,module,exports){
/*** Created by Reed McLean and Kendall Haberer on 6/17/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.CreationController',
    [
        require('./creationService.js').name,
        require('./initializeFormService.js').name
    ]
).controller('CreationController',
    [
        '$scope', 'creationService',
        function ($scope, creationService) {
            $scope.testusers = [];
            var json2csv = require('json2csv');
            

            var init = function () {
                $scope.form = {};
                $scope.form.default = {};
                $scope.form.default.username = true;
                $scope.form.default.password = true;
                $scope.form.default.fname = true;
                $scope.form.default.lname = true;
                $scope.form.default.email = true;
                $scope.form.default.address1 = true;
                $scope.form.default.address2 = true;
                $scope.form.default.phone1 = true;
                $scope.form.default.phone2 = true;
                $scope.form.default.zip = true;
                $scope.form.default.DoB = true;
                $scope.form.gender = 'default';
                $scope.form.subdep = 'default';
                $scope.form.timezone = 'default';
                $scope.form.state = 'default';
                $scope.form.batch = false;
                $scope.advanced = false;
                $scope.form.isBusy = 0;
                $scope.date = new Date();
                $scope.form.groupGuid = $scope.group.groupId;
                $scope.form.groupName = $scope.group.groupName;
                $scope.form.quantity = 1;
                $scope.form.status = 1;
            };

            init();


            $scope.testUserGrid = {
                enableGridMenu: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                noUnselect: false,
                data: $scope.testusers,
                multiSelect: false,
                columnDefs: [
                    {
                        name: 'ActorID', width: 80, field: 'ActorID',
                        enableColumnResizing: true, cellTooltip: true
                    },
                    {
                        name: 'EmployeeID', width: 120, field: 'EmployeeID',
                        enableColumnResizing: true, cellTooltip: true
                    },
                    {
                        name: 'Username', width: 275, field: 'UserName',
                        enableColumnResizing: true, cellTooltip: true
                    },
                    {
                        name: 'First Name', field: 'FirstName',
                        cellTooltip: true
                    },
                    { name: 'Last Name', field: 'LastName', cellTooltip: true }
                ]
            };

            $scope.clear = function (name) {
                $scope.form[name] = '';
            };

            var creationCallbackMethod = function () {
                creationService.makeNewUser($scope.form).then(
                    function (user) {
                        $scope.testusers.push(user.Eligibility);
                        $scope.form.isBusy--;
                    });
            };


            $scope.createUserButton = function () {
                if ($scope.form.quantity > 1)
                {
                    $scope.form.batch = true;
                }
                for (var i = 0; i < $scope.form.quantity; i++) {
                    $scope.form.isBusy++;
                    creationCallbackMethod();
                }


            };

            $scope.downloadCSV = function () {
                var csvString = 'data:text/csv;charset=utf-8,' + json2csv({ data: $scope.testusers });
                var encodedURI = encodeURI(csvString);
                var link = document.createElement('a');
                link.setAttribute('href', encodedURI);
                var fileName = 'TestUsers' + Date.now() + '.csv';
                link.setAttribute('download', fileName);
                document.body.appendChild(link); 
                link.click();
            };

        }]
    
);


},{"./creationService.js":26,"./initializeFormService.js":27,"json2csv":3}],26:[function(require,module,exports){
/** Created by Reed McLean and Kendall Haberer 6/22/2016 **/
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.creationService',
    [
        require('../shared/restfulRepo').name
    ]
).service('creationService', ['restfulRepo', '$http', '$q', 'notify',
    function (restfulRepo, $http, $q, notify) {

    this.makeNewUser = function (tempuser) {
        var defer = $q.defer();
        $http({
            url: baseURL + '/createTestUsers/createUser',
            data: tempuser, method: 'PUT'
        }).success(function (data) {
            
            var user = JSON.parse(data);
            if (user.Eligibility.ActorID >= 0) {
                defer.resolve(user);
            } else {
                notify({
                    message: 'Could not create user:\n' + user.Eligibility.PopSeg1,
                    classes: 'alert-danger',
                    templateUrl: 'partials/settingNotification.html'
                });

                tempuser.isBusy--;
            }


        }).error(function () {
            notify({
                message: 'Could not create user',
                classes: 'alert-danger',
                templateUrl: 'partials/settingNotification.html'
            });

            tempuser.isBusy--;
        });
        return defer.promise;
    };
}]);
},{"../shared/restfulRepo":23}],27:[function(require,module,exports){
/** Created by Reed McLean and Kendall Haberer 6/22/2016 **/
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.initializeFormService',
    [
    ]
).service('initializeFormService', [function () {
    var self = this;

    self.getForm = function () {
        var form = {};

        var getZone = function () {
            var zoneArr = ['Hawaii (GMT-10:00)', 'Alaska (GMT-09:00)',
                'Pacific Time (US & Canada) (GMT-08:00)', 'Arizona (GMT-07:00)',
                'Mountain Time (US & Canada) (GMT-07:00)', 'Central Time (US & Canada) (GMT-06:00)',
                'Eastern Time (US & Canada) (GMT-05:00)'];

            return zoneArr[Math.floor(Math.random() * zoneArr.length)];
        };

        var getState = function () {
            var stateList = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE',
                'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA',
                'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND',
                'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA',
                'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

            return stateList[Math.floor(Math.random() * stateList.length)];
        };

        var getEmail = function () {

            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var result = '';

            var suffix = ['.com', '.org', '.net', '.biz', '.info'];

            for (var i = 0 ; i < (Math.random() * 4) + 5 ; i++) {
                result += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            result += '@';
            for (i = 0 ; i < (Math.random() * 4) + 5 ; i++) {
                result += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            result += suffix[Math.floor(Math.random() * suffix.length)];

            return result;
        };

        var getPhoneNum = function () {

            var result = '';
            for (var i = 0 ; i < 3 ; i++) {
                result += Math.floor(Math.random() * 10);
            }
            result += '-';
            for (i = 0 ; i < 3 ; i++) {
                result += Math.floor(Math.random() * 10);
            }
            result += '-';
            for (i = 0 ; i < 4 ; i++) {
                result += Math.floor(Math.random() * 10);
            }

            return result;

        };

        var getAddress1 = function () {
            var streetNum = Math.ceil(Math.random() * 10000);
            var street = ['Sunset', 'Arbor', 'Flower', 'Brunswick',
                'Wilson', 'Island', 'Concord', 'Franklin', 'Woodmont'];
            var suffix = ['Pl', 'Rd', 'Dr', 'Ave', 'St', 'Ln', 'Pk'];

            var addr = streetNum + ' ' + street[Math.floor(Math.random() * street.length)] + ' ' +
                suffix[Math.floor(Math.random() * suffix.length)];

            return addr;
        };

        var getAddress2 = function () {
            var letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            var locationArr = ['Apt', 'Room'];
            var location = locationArr[Math.floor(Math.random() * 2)];
            if (location === '') {
                return '';
            }
            var addr = location + ' ' + Math.floor(Math.random() * 10) +
                letter.charAt(Math.floor(Math.random() * letter.length));

            if (Math.random() > 0.7) { return addr; }
            return '';
        };

        var getZip = function () {
            var zip = '';

            for (var i = 0 ; i < 5 ; i++) {
                zip += Math.floor(Math.random() * 10);
            }

            return zip;
        };

        var getfName = function () {
            var names = ['John', 'Charlie', 'Bob', 'Tom', 'Jim', 'James', 'Michael', 'Mike', 'Steven', 'Stephen',
                'Jeff', 'Geoff', 'Max', 'Greg', 'Lewis', 'Kevin', 'Shawn', 'Jacob', 'Jake'];

            return names[Math.floor(Math.random() * names.length)];
        };

        var getlName = function () {
            var names = ['Smith', 'Thompson', 'Brown', 'McCree', 'Palmer', 'Alexander',
                'Bond', 'Jones', 'Carpenter',
                'Cabellero', 'Nicholson', 'Cole', 'Brake', 'Hall', 'Baker', 'Underwood'];

            return names[Math.floor(Math.random() * names.length)];
        };

        var getPassword = function () {
            var password = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?';



            for (var i = 0; i < Math.round(Math.random() * 8) + 6; i++) {
                password += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return password;
        };

        var initialize = function () {
            form = {
                username: 'testuser' + Math.ceil(Math.random() * 10000),
                password: getPassword(),
                DoB: Math.ceil(Math.random() * 12) + '/' + Math.ceil(Math.random() * 28)
                    + '/' + (Math.ceil(Math.random() * 50) + 1950),
                fname: getfName(),
                lname: getlName(),
                groupId: '',
                address1: getAddress1(),
                address2: getAddress2(),
                zip: getZip(),
                phone1: getPhoneNum(),
                phone2: Math.random > 0.7 ? getPhoneNum() : '',
                state: getState(),
                email: getEmail(),
                zone: getZone(),
                isBusy: false
            };
        };

        initialize();

        return form;
    };
}]);
},{}],28:[function(require,module,exports){
/*** Created by Kendall  Haberer on 6/28/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.TestUsersController',
    [
        require('./testUsersService.js').name,
        require('../shared/primaryModal').name,
        'ui.grid.pagination'
    ]
).controller('TestUsersController',
    [
        '$scope', 'testUsersService', 'primaryModal',
        function ($scope, testUsersService, primaryModal) {
            $scope.newPass = '';

            var list = [];
            testUsersService.getTestUser($scope.group.groupId)
                .then(
                    function (users) {
                        for (var i = 0; i < users.length ; i++) {
                            users[i].DOB = users[i].DOB.substring(0,10);
                            list.push(users[i]);
                        }
                    });

            //$scope.showInfo = {};
            $scope.getInfo = function (row) {
                testUsersService.getPopSegs(row.entity.ActorID)
                    .then(function (info) {                   
                        $scope.showInfo = info;
                        var modalParam = {
                            template: 'partials/userCreationTool/moreInformationDialog.html',
                            size: 'lg',
                            controller: 'TestUsersController as testUsersCtrl',
                            scope: $scope
                        };
                        primaryModal.launchPrimaryModal(modalParam);                      
                    });
            };

            $scope.registerUser = function(row) { 
                alert('Register User');
                testUsersService.registerUser(row.entity.ActorID, row.entity.UserName);

            };

            $scope.resetPassword = function() { 
                var modalParam = {
                    template: 'partials/userCreationTool/resetPassDialog.html',
                    size: 'lg',
                    controller: 'TestUsersController as testUsersCtrl',
                    scope: $scope
                };
                primaryModal.launchPrimaryModal(modalParam);
            };

            $scope.resetPassClick = function() {
                //alert($scope.newPass);
                //$modalInstance.close();

                //huge problem with the below code:
                //you have to click somewhere on the screen after
                //hitting submit
                
                $('#myModalP').modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();

                //$.modal.close();
            };

            $scope.testUserGrid =
            {
                enablePaginationControls: false,
                paginationPageSize: 20,
                enableGridMenu: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                noUnselect: false,
                data: list,
                multiSelect: false,
                columnDefs: [
                    {
                        name: 'UserName', field: 'UserName',
                        enableColumnResizing: true, cellTooltip: true
                    },
                    {
                        name: 'ActorID',field: 'ActorID', cellTooltip: true
                    },
                    {
                         name: 'FirstName', field: 'FirstName', cellTooltip: true
                    },
                    {
                        name: 'LastName', field: 'LastName', cellTooltip: true
                    },
                    {
                        name: 'DOB', field: 'DOB', cellToolTip: true
                    },
                    {
                        name: 'EmployeeID', field: 'EmployeeID', cellToolTip: true
                    },
                    {
                        name: 'Last4SSN', field: 'Last4SSN', cellToolTip: true,
                    },
                    {
                        name: 'ZipCode', field: 'ZipCode', cellToolTip: true,
                    },
                    {
                        name: 'MoreInfo', cellToolTip: true,
                        cellTemplate: 
                            '<div class="ui-grid-cell-contents" ng-model="row.entity">' +
                            '<button type="button" class="btn btn-primary btn-sm" ' +
                            'ng-click="grid.appScope.getInfo(row)" style="border-radius: 8%; margin-left: 3px;' +
                            'padding: 0px 5px 0px 5px">More Info</button></div>'                           
                    },
                    {
                        name: 'Reset Password', cellToolTip: true,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents" ng-model="row.entity">' +
                            '<button type="button" class="btn btn-primary btn-sm" ' +
                            'ng-click="grid.appScope.resetPassword()" style="border-radius: 8%;' +
                            'padding: 0px 5px 0px 5px">Reset Pass</button></div>'
                    },
                    {
                        name: 'Register', cellToolTip: true,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents" ng-model="row.entity">' +
                            '<button type="button" class="btn btn-primary btn-sm" ' +
                            'ng-click="grid.appScope.registerUser(row)" style="border-radius: 8%; margin-left: 7px;' +
                            'padding: 0px 5px 0px 5px" ng-show="row.entity.isRegistered == 0"> Register </button></div>'
                    }
                    
                ]
            };

            $scope.testUserGrid.onRegisterApi = function(gridApi) {
                $scope.gridApi = gridApi;
            };


        }]

);
},{"../shared/primaryModal":22,"./testUsersService.js":29}],29:[function(require,module,exports){
/** Created by Kendall Haberer 7/15/2016 **/
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.testUsersService',
    [
        require('../shared/restfulRepo').name 
    ]
).service('testUsersService', ['restfulRepo', '$http', '$q', 'notify',
    function (restfulRepo, $http, $q, notify) {

        this.getTestUser = function (groupGuid) {
            var defer = $q.defer();
            $http({
                url: baseURL +
                '/createTestUsers/getTestUsers/' + groupGuid,
                method: 'GET' 
            }).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                notify({
                    message: 'Could not acquire users',
                    classes: 'alert-danger',
                    templateUrl: 'partials/settingNotification.html'
                });

            });
            return defer.promise;
        };

        this.getPopSegs = function (actorId) {
            var defer = $q.defer();
            $http({
                url: baseURL +
                '/createTestUsers/getPopSegs/' + actorId,
                method: 'GET'
            }).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                notify({
                    message: 'Could not acquire information',
                    classes: 'alert-danger',
                    templateUrl: 'partials/settingNotification.html'
                });

            });
            return defer.promise;
        };

        this.registerUser = function(actorId, username) {
            $http({
                url: baseURL +
                     '/createTestUsers/registerUser/' + actorId,
                    method: 'GET',
                    params: {actorId: actorId, username: username}
                })
                .success(function() {
                    alert('http success!');
                })
                .error(function() {
                    notify({
                        message: 'Could not register user',
                        classes: 'alert-danger',
                        templateUrl: 'partials/settingNotification.html'
                    });
                });
        };

    }]);

},{"../shared/restfulRepo":23}],30:[function(require,module,exports){
/*** Created by PraveenP on 6/16/2016.*/
'use strict';

module.exports = angular.module(
    'onlife.admin.userCreationTool.UserController',
    [
        require('../shared/groupSearch/groupService').name
    ]
).controller('UserController',
    [
        '$scope', 'groupService', '$timeout', '$location',
        function ($scope, groupService, $timeout, $location) {
            var self = this;
            self.hideWelcomeNote = true;
            $scope.group = {};
            

            self.getGroupData = function () {
                groupService.getGroupData().then(function (data) {
                    self.groupData = data.data;
                    $scope.group.groupId = self.groupData.Id;
                    $scope.group.groupName = self.groupData.Identifier.GroupName;
                    $scope.$broadcast('GroupList');
                    $timeout(function() {
                        self.hideWelcomeNote = false;
                    }, 2000);
                });
            };

            self.getDropDownMenu = function () {
                var menu = [{
                    text: 'Create User',
                    onClick: function () { $location.path('/createUser'); }
                }, {
                    text: 'Test Users',
                    onClick: function () { $location.path('/testUsers'); }
                }];

                return menu;
            };

            self.searchGroup = function () {
                $location.path('/search');
                $timeout(function() {
                    $scope.$broadcast('GroupList');
                }, 2000);
            };

            self.getGroupData();
            self.dropDownMenu = self.getDropDownMenu();
        }
    ]
);

},{"../shared/groupSearch/groupService":20}]},{},[24]);
