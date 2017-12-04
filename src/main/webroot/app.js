/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017 Joachim Wester
 * MIT license
 */
var _hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(obj, key) {
    return _hasOwnProperty.call(obj, key);
}
exports.hasOwnProperty = hasOwnProperty;
function _objectKeys(obj) {
    if (Array.isArray(obj)) {
        var keys = new Array(obj.length);
        for (var k = 0; k < keys.length; k++) {
            keys[k] = "" + k;
        }
        return keys;
    }
    if (Object.keys) {
        return Object.keys(obj);
    }
    var keys = [];
    for (var i in obj) {
        if (hasOwnProperty(obj, i)) {
            keys.push(i);
        }
    }
    return keys;
}
exports._objectKeys = _objectKeys;
;
/**
* Deeply clone the object.
* https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
* @param  {any} obj value to clone
* @return {any} cloned obj
*/
function _deepClone(obj) {
    switch (typeof obj) {
        case "object":
            return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
        case "undefined":
            return null; //this is how JSON.stringify behaves for array items
        default:
            return obj; //no need to clone primitives
    }
}
exports._deepClone = _deepClone;
//3x faster than cached /^\d+$/.test(str)
function isInteger(str) {
    var i = 0;
    var len = str.length;
    var charCode;
    while (i < len) {
        charCode = str.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            i++;
            continue;
        }
        return false;
    }
    return true;
}
exports.isInteger = isInteger;
/**
* Escapes a json pointer path
* @param path The raw pointer
* @return the Escaped path
*/
function escapePathComponent(path) {
    if (path.indexOf('/') === -1 && path.indexOf('~') === -1)
        return path;
    return path.replace(/~/g, '~0').replace(/\//g, '~1');
}
exports.escapePathComponent = escapePathComponent;
/**
 * Unescapes a json pointer path
 * @param path The escaped pointer
 * @return The unescaped path
 */
function unescapePathComponent(path) {
    return path.replace(/~1/g, '/').replace(/~0/g, '~');
}
exports.unescapePathComponent = unescapePathComponent;
function _getPathRecursive(root, obj) {
    var found;
    for (var key in root) {
        if (hasOwnProperty(root, key)) {
            if (root[key] === obj) {
                return escapePathComponent(key) + '/';
            }
            else if (typeof root[key] === 'object') {
                found = _getPathRecursive(root[key], obj);
                if (found != '') {
                    return escapePathComponent(key) + '/' + found;
                }
            }
        }
    }
    return '';
}
exports._getPathRecursive = _getPathRecursive;
function getPath(root, obj) {
    if (root === obj) {
        return '/';
    }
    var path = _getPathRecursive(root, obj);
    if (path === '') {
        throw new Error("Object not found in root");
    }
    return '/' + path;
}
exports.getPath = getPath;
/**
* Recursively checks whether an object has any undefined values inside.
*/
function hasUndefined(obj) {
    if (obj === undefined) {
        return true;
    }
    if (obj) {
        if (Array.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (hasUndefined(obj[i])) {
                    return true;
                }
            }
        }
        else if (typeof obj === "object") {
            var objKeys = _objectKeys(obj);
            var objKeysLength = objKeys.length;
            for (var i = 0; i < objKeysLength; i++) {
                if (hasUndefined(obj[objKeys[i]])) {
                    return true;
                }
            }
        }
    }
    return false;
}
exports.hasUndefined = hasUndefined;
var PatchError = (function (_super) {
    __extends(PatchError, _super);
    function PatchError(message, name, index, operation, tree) {
        _super.call(this, message);
        this.message = message;
        this.name = name;
        this.index = index;
        this.operation = operation;
        this.tree = tree;
    }
    return PatchError;
}(Error));
exports.PatchError = PatchError;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(11);
var isArguments = __webpack_require__(12);

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var equalsOptions = { strict: true };
var _equals = __webpack_require__(2);
var areEquals = function (a, b) {
    return _equals(a, b, equalsOptions);
};
var helpers_1 = __webpack_require__(0);
exports.JsonPatchError = helpers_1.PatchError;
exports.deepClone = helpers_1._deepClone;
/* We use a Javascript hash to store each
 function. Each hash entry (property) uses
 the operation identifiers specified in rfc6902.
 In this way, we can map each patch operation
 to its dedicated function in efficient way.
 */
/* The operations applicable to an object */
var objOps = {
    add: function (obj, key, document) {
        obj[key] = this.value;
        return { newDocument: document };
    },
    remove: function (obj, key, document) {
        var removed = obj[key];
        delete obj[key];
        return { newDocument: document, removed: removed };
    },
    replace: function (obj, key, document) {
        var removed = obj[key];
        obj[key] = this.value;
        return { newDocument: document, removed: removed };
    },
    move: function (obj, key, document) {
        /* in case move target overwrites an existing value,
        return the removed value, this can be taxing performance-wise,
        and is potentially unneeded */
        var removed = getValueByPointer(document, this.path);
        if (removed) {
            removed = helpers_1._deepClone(removed);
        }
        var originalValue = applyOperation(document, { op: "remove", path: this.from }).removed;
        applyOperation(document, { op: "add", path: this.path, value: originalValue });
        return { newDocument: document, removed: removed };
    },
    copy: function (obj, key, document) {
        var valueToCopy = getValueByPointer(document, this.from);
        // enforce copy by value so further operations don't affect source (see issue #177)
        applyOperation(document, { op: "add", path: this.path, value: helpers_1._deepClone(valueToCopy) });
        return { newDocument: document };
    },
    test: function (obj, key, document) {
        return { newDocument: document, test: areEquals(obj[key], this.value) };
    },
    _get: function (obj, key, document) {
        this.value = obj[key];
        return { newDocument: document };
    }
};
/* The operations applicable to an array. Many are the same as for the object */
var arrOps = {
    add: function (arr, i, document) {
        if (helpers_1.isInteger(i)) {
            arr.splice(i, 0, this.value);
        }
        else {
            arr[i] = this.value;
        }
        // this may be needed when using '-' in an array
        return { newDocument: document, index: i };
    },
    remove: function (arr, i, document) {
        var removedList = arr.splice(i, 1);
        return { newDocument: document, removed: removedList[0] };
    },
    replace: function (arr, i, document) {
        var removed = arr[i];
        arr[i] = this.value;
        return { newDocument: document, removed: removed };
    },
    move: objOps.move,
    copy: objOps.copy,
    test: objOps.test,
    _get: objOps._get
};
/**
 * Retrieves a value from a JSON document by a JSON pointer.
 * Returns the value.
 *
 * @param document The document to get the value from
 * @param pointer an escaped JSON pointer
 * @return The retrieved value
 */
function getValueByPointer(document, pointer) {
    if (pointer == '') {
        return document;
    }
    var getOriginalDestination = { op: "_get", path: pointer };
    applyOperation(document, getOriginalDestination);
    return getOriginalDestination.value;
}
exports.getValueByPointer = getValueByPointer;
/**
 * Apply a single JSON Patch Operation on a JSON document.
 * Returns the {newDocument, result} of the operation.
 * It modifies the `document` and `operation` objects - it gets the values by reference.
 * If you would like to avoid touching your values, clone them:
 * `jsonpatch.applyOperation(document, jsonpatch._deepClone(operation))`.
 *
 * @param document The document to patch
 * @param operation The operation to apply
 * @param validateOperation `false` is without validation, `true` to use default jsonpatch's validation, or you can pass a `validateOperation` callback to be used for validation.
 * @param mutateDocument Whether to mutate the original document or clone it before applying
 * @return `{newDocument, result}` after the operation
 */
function applyOperation(document, operation, validateOperation, mutateDocument) {
    if (validateOperation === void 0) { validateOperation = false; }
    if (mutateDocument === void 0) { mutateDocument = true; }
    if (validateOperation) {
        if (typeof validateOperation == 'function') {
            validateOperation(operation, 0, document, operation.path);
        }
        else {
            validator(operation, 0);
        }
    }
    /* ROOT OPERATIONS */
    if (operation.path === "") {
        var returnValue = { newDocument: document };
        if (operation.op === 'add') {
            returnValue.newDocument = operation.value;
            return returnValue;
        }
        else if (operation.op === 'replace') {
            returnValue.newDocument = operation.value;
            returnValue.removed = document; //document we removed
            return returnValue;
        }
        else if (operation.op === 'move' || operation.op === 'copy') {
            returnValue.newDocument = getValueByPointer(document, operation.from); // get the value by json-pointer in `from` field
            if (operation.op === 'move') {
                returnValue.removed = document;
            }
            return returnValue;
        }
        else if (operation.op === 'test') {
            returnValue.test = areEquals(document, operation.value);
            if (returnValue.test === false) {
                throw new exports.JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
            }
            returnValue.newDocument = document;
            return returnValue;
        }
        else if (operation.op === 'remove') {
            returnValue.removed = document;
            returnValue.newDocument = null;
            return returnValue;
        }
        else if (operation.op === '_get') {
            operation.value = document;
            return returnValue;
        }
        else {
            if (validateOperation) {
                throw new exports.JsonPatchError('Operation `op` property is not one of operations defined in RFC-6902', 'OPERATION_OP_INVALID', 0, operation, document);
            }
            else {
                return returnValue;
            }
        }
    } /* END ROOT OPERATIONS */
    else {
        if (!mutateDocument) {
            document = helpers_1._deepClone(document);
        }
        var path = operation.path || "";
        var keys = path.split('/');
        var obj = document;
        var t = 1; //skip empty element - http://jsperf.com/to-shift-or-not-to-shift
        var len = keys.length;
        var existingPathFragment = undefined;
        var key = void 0;
        var validateFunction = void 0;
        if (typeof validateOperation == 'function') {
            validateFunction = validateOperation;
        }
        else {
            validateFunction = validator;
        }
        while (true) {
            key = keys[t];
            if (validateOperation) {
                if (existingPathFragment === undefined) {
                    if (obj[key] === undefined) {
                        existingPathFragment = keys.slice(0, t).join('/');
                    }
                    else if (t == len - 1) {
                        existingPathFragment = operation.path;
                    }
                    if (existingPathFragment !== undefined) {
                        validateFunction(operation, 0, document, existingPathFragment);
                    }
                }
            }
            t++;
            if (Array.isArray(obj)) {
                if (key === '-') {
                    key = obj.length;
                }
                else {
                    if (validateOperation && !helpers_1.isInteger(key)) {
                        throw new exports.JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", 0, operation.path, operation);
                    } // only parse key when it's an integer for `arr.prop` to work
                    else if (helpers_1.isInteger(key)) {
                        key = ~~key;
                    }
                }
                if (t >= len) {
                    if (validateOperation && operation.op === "add" && key > obj.length) {
                        throw new exports.JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", 0, operation.path, operation);
                    }
                    var returnValue = arrOps[operation.op].call(operation, obj, key, document); // Apply patch
                    if (returnValue.test === false) {
                        throw new exports.JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
                    }
                    return returnValue;
                }
            }
            else {
                if (key && key.indexOf('~') != -1) {
                    key = helpers_1.unescapePathComponent(key);
                }
                if (t >= len) {
                    var returnValue = objOps[operation.op].call(operation, obj, key, document); // Apply patch
                    if (returnValue.test === false) {
                        throw new exports.JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
                    }
                    return returnValue;
                }
            }
            obj = obj[key];
        }
    }
}
exports.applyOperation = applyOperation;
/**
 * Apply a full JSON Patch array on a JSON document.
 * Returns the {newDocument, result} of the patch.
 * It modifies the `document` object and `patch` - it gets the values by reference.
 * If you would like to avoid touching your values, clone them:
 * `jsonpatch.applyPatch(document, jsonpatch._deepClone(patch))`.
 *
 * @param document The document to patch
 * @param patch The patch to apply
 * @param validateOperation `false` is without validation, `true` to use default jsonpatch's validation, or you can pass a `validateOperation` callback to be used for validation.
 * @param mutateDocument Whether to mutate the original document or clone it before applying
 * @return An array of `{newDocument, result}` after the patch
 */
function applyPatch(document, patch, validateOperation, mutateDocument) {
    if (mutateDocument === void 0) { mutateDocument = true; }
    if (validateOperation) {
        if (!Array.isArray(patch)) {
            throw new exports.JsonPatchError('Patch sequence must be an array', 'SEQUENCE_NOT_AN_ARRAY');
        }
    }
    if (!mutateDocument) {
        document = helpers_1._deepClone(document);
    }
    var results = new Array(patch.length);
    for (var i = 0, length_1 = patch.length; i < length_1; i++) {
        results[i] = applyOperation(document, patch[i], validateOperation);
        document = results[i].newDocument; // in case root was replaced
    }
    results.newDocument = document;
    return results;
}
exports.applyPatch = applyPatch;
/**
 * Apply a single JSON Patch Operation on a JSON document.
 * Returns the updated document.
 * Suitable as a reducer.
 *
 * @param document The document to patch
 * @param operation The operation to apply
 * @return The updated document
 */
function applyReducer(document, operation) {
    var operationResult = applyOperation(document, operation);
    if (operationResult.test === false) {
        throw new exports.JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
    }
    return operationResult.newDocument;
}
exports.applyReducer = applyReducer;
/**
 * Validates a single operation. Called from `jsonpatch.validate`. Throws `JsonPatchError` in case of an error.
 * @param {object} operation - operation object (patch)
 * @param {number} index - index of operation in the sequence
 * @param {object} [document] - object where the operation is supposed to be applied
 * @param {string} [existingPathFragment] - comes along with `document`
 */
function validator(operation, index, document, existingPathFragment) {
    if (typeof operation !== 'object' || operation === null || Array.isArray(operation)) {
        throw new exports.JsonPatchError('Operation is not an object', 'OPERATION_NOT_AN_OBJECT', index, operation, document);
    }
    else if (!objOps[operation.op]) {
        throw new exports.JsonPatchError('Operation `op` property is not one of operations defined in RFC-6902', 'OPERATION_OP_INVALID', index, operation, document);
    }
    else if (typeof operation.path !== 'string') {
        throw new exports.JsonPatchError('Operation `path` property is not a string', 'OPERATION_PATH_INVALID', index, operation, document);
    }
    else if (operation.path.indexOf('/') !== 0 && operation.path.length > 0) {
        // paths that aren't empty string should start with "/"
        throw new exports.JsonPatchError('Operation `path` property must start with "/"', 'OPERATION_PATH_INVALID', index, operation, document);
    }
    else if ((operation.op === 'move' || operation.op === 'copy') && typeof operation.from !== 'string') {
        throw new exports.JsonPatchError('Operation `from` property is not present (applicable in `move` and `copy` operations)', 'OPERATION_FROM_REQUIRED', index, operation, document);
    }
    else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && operation.value === undefined) {
        throw new exports.JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_REQUIRED', index, operation, document);
    }
    else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && helpers_1.hasUndefined(operation.value)) {
        throw new exports.JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED', index, operation, document);
    }
    else if (document) {
        if (operation.op == "add") {
            var pathLen = operation.path.split("/").length;
            var existingPathLen = existingPathFragment.split("/").length;
            if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) {
                throw new exports.JsonPatchError('Cannot perform an `add` operation at the desired path', 'OPERATION_PATH_CANNOT_ADD', index, operation, document);
            }
        }
        else if (operation.op === 'replace' || operation.op === 'remove' || operation.op === '_get') {
            if (operation.path !== existingPathFragment) {
                throw new exports.JsonPatchError('Cannot perform the operation at a path that does not exist', 'OPERATION_PATH_UNRESOLVABLE', index, operation, document);
            }
        }
        else if (operation.op === 'move' || operation.op === 'copy') {
            var existingValue = { op: "_get", path: operation.from, value: undefined };
            var error = validate([existingValue], document);
            if (error && error.name === 'OPERATION_PATH_UNRESOLVABLE') {
                throw new exports.JsonPatchError('Cannot perform the operation from a path that does not exist', 'OPERATION_FROM_UNRESOLVABLE', index, operation, document);
            }
        }
    }
}
exports.validator = validator;
/**
 * Validates a sequence of operations. If `document` parameter is provided, the sequence is additionally validated against the object document.
 * If error is encountered, returns a JsonPatchError object
 * @param sequence
 * @param document
 * @returns {JsonPatchError|undefined}
 */
function validate(sequence, document, externalValidator) {
    try {
        if (!Array.isArray(sequence)) {
            throw new exports.JsonPatchError('Patch sequence must be an array', 'SEQUENCE_NOT_AN_ARRAY');
        }
        if (document) {
            //clone document and sequence so that we can safely try applying operations
            applyPatch(helpers_1._deepClone(document), helpers_1._deepClone(sequence), externalValidator || true);
        }
        else {
            externalValidator = externalValidator || validator;
            for (var i = 0; i < sequence.length; i++) {
                externalValidator(sequence[i], i, document, undefined);
            }
        }
    }
    catch (e) {
        if (e instanceof exports.JsonPatchError) {
            return e;
        }
        else {
            throw e;
        }
    }
}
exports.validate = validate;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mithril__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mithril___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mithril__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jsonpath__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fast_json_patch__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fast_json_patch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fast_json_patch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rendering__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__htmltohyperscript__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils__ = __webpack_require__(17);










let Context = {
    editMode: false
};


let store = {
    "store": {
        "book": [
            {"category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95,
                "flag": "http://www.androidbegin.com/tutorial/flag/china.png"
            },
            {"category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/india.png"
            },
            {"category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/unitedstates.png"
            },
            {"category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99,
                "flag": "http://www.androidbegin.com/tutorial/flag/japan.png"
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    }
};

let data = {// JSON Object
    "worldpopulation": // JSON Array Name
            [// JSON Array
                {// JSON Object
                    "rank": 1, "country": "China",
                    "population": "1,354,040,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/china.png"
                },
                {// JSON Object
                    "rank": 2, "country": "India",
                    "population": "1,210,193,422",
                    "flag": "http://www.androidbegin.com/tutorial/flag/india.png"
                },
                {// JSON Object
                    "rank": 3, "country": "United States",
                    "population": "315,761,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/unitedstates.png"
                },
                {// JSON Object
                    "rank": 4, "country": "Indonesia",
                    "population": "237,641,326",
                    "flag": "http://www.androidbegin.com/tutorial/flag/indonesia.png"
                },
                {// JSON Object
                    "rank": 5, "country": "Brazil",
                    "population": "193,946,886",
                    "flag": "http://www.androidbegin.com/tutorial/flag/brazil.png"
                },
                {// JSON Object
                    "rank": 6, "country": "Pakistan",
                    "population": "182,912,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/pakistan.png"
                },
                {// JSON Object
                    "rank": 7, "country": "Nigeria",
                    "population": "170,901,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/nigeria.png"
                },
                {// JSON Object
                    "rank": 8, "country": "Bangladesh",
                    "population": "152,518,015",
                    "flag": "http://www.androidbegin.com/tutorial/flag/bangladesh.png"
                },
                {// JSON Object
                    "rank": 9, "country": "Russia",
                    "population": "143,369,806",
                    "flag": "http://www.androidbegin.com/tutorial/flag/russia.png"
                },
                {// JSON Object
                    "rank": 10, "country": "Japan",
                    "population": "127,360,000",
                    "flag": "http://www.androidbegin.com/tutorial/flag/japan.png"
                }
            ] // JSON Array
};
let cardTemplate = {"tag": "div", "attrs": {"class": "col-md-4"}, "children": [{
            "tag": "div",
            "attrs": {
                "style": {
                    //         "width": "10rem"
                },
                "className": "card card-primary",
            },
            "children": [
                {
                    "tag": "img",
                    "attrs": {
                        "alt": "Card image cap",
                        "src": "$.flag",
                        "className": "card-img-top"
                    },
                    "children": [

                    ],
                    "skip": false
                },
                {
                    "tag": "div",
                    "attrs": {
                        "className": "card-body"
                    },
                    "children": [
                        {
                            "tag": "h4",
                            "attrs": {
                                "className": "card-title"
                            },
                            "text": "$.country",
                            "skip": false
                        },
                        {
                            "tag": "p",
                            "attrs": {
                                "className": "card-text"
                            },
                            "children": [
                                "Population: ",
                                {
                                    tag: 'span',
                                    "text": "$.population",
                                    attrs: {
                                        className: ''
                                    }
                                }
                            ],
                            "skip": false
                        },
                        {
                            "tag": "a",
                            "attrs": {
                                "href": "#",
                                "className": "btn btn-primary"
                            },
                            "text": "Nuke'em all",
                            "skip": false
                        }
                    ],
                    "skip": false
                }
            ],
            "skip": false
        }]};
let booktemplate_old = {"tag": "h1", "attrs": {"class": "large-font"}, "text": "@.title"};
let booktemplate = {"tag": "div", "attrs": {"class": "card"}, "children": [{"tag": "div", "attrs": {"class": "card-header"}, "children": ["$.title"]}]};

//jsonPath(cardTemplate, "$..children[?(@.attrs.className == 'card-title')]", {applyFn: v => v.text = v.text.toLowerCase()})
//jsonPath(cardTemplate, "$..children[?(@.attrs.className == 'card-text')]", {applyFn: v => v.text = v.text.toLowerCase()})





var renderedTemplate_ =
        Object(__WEBPACK_IMPORTED_MODULE_3__rendering__["a" /* default */])({template: booktemplate, data: store, path: '$..book[?(@.price < 9)]'});

var renderedTemplate = Object(__WEBPACK_IMPORTED_MODULE_3__rendering__["a" /* default */])({template: cardTemplate, data: data, path: '$..worldpopulation[:]'});

console.log('renderedTemplate', JSON.stringify(renderedTemplate))
/**
 * Do it well
 *
 * @param {type} obj
 * @param {type} paths
 * @param {type} vals
 * @return {undefined}
 */
let applyValuesToPaths = (obj, paths, vals) => {
    let applyValueToPath = (obj, path, val) => {
        for (var pidx = 0; pidx < path.length - 1; pidx++)
            obj = obj[path[pidx]];
        obj[path[path.length - 1]] = val;
    };
//    console.log(!!paths.length, '!!paths.length')
//    console.log(!!vals.length, '!!vals.length')
//    console.log(paths.length, 'paths.length')
//    console.log(vals.length, 'vals.length')
//    console.log(typeof vals === 'string', "typeof vals ==='string'")
//    console.log(typeof vals, "typeof vals")

    if (__WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].isString(paths)) {
        paths = Object(__WEBPACK_IMPORTED_MODULE_1__jsonpath__["a" /* default */])(obj, paths, {resultType: 'LOCATION'})
    }

    if (!paths.length && !vals.length) {
// Both contain one value.
        console.log('This cannot happen, because paths should always be an array.');
    } else if (paths.length && vals.length && (paths.length === vals.length)) {
// Both contain the same number of values.
        paths.forEach((path, idx) => {
            applyValueToPath(obj, path, vals[idx]);
        });
        console.log('Both contain the same number of values.');
    } else if (paths.length && (!vals.length || vals.length === 1 || typeof vals == 'string')) {
        console.log('Multiple paths, but only one value.');
        paths.forEach((path) => {
            applyValueToPath(obj, path, vals);
        });
    } else {
        console.log('ERROR while applying', obj, paths, vals);
    }
};
console.log('path', Object(__WEBPACK_IMPORTED_MODULE_1__jsonpath__["a" /* default */])(store, '$..book[:]', {resultType: "VALUE"}));
console.log('value', Object(__WEBPACK_IMPORTED_MODULE_1__jsonpath__["a" /* default */])(cardTemplate, '$..attrs', {resultType: "VALUE"}));


/*applyValuesToPaths(cardTemplate, jsonPath(cardTemplate, "$..children[?(@.attrs.className == 'card-title')].text", {
 resultType: "LOCATION"
 }), "HELLO");
 */

//applyValuesToPaths(cardTemplate, "$..children[?(@.attrs.className == 'card-title')].text", "heLLo");
applyValuesToPaths(cardTemplate, "$['children'][1]['children'][0]['text']", "heLLo!!    ");

var mapping = {
    "book": {
        each: '$..book[:]',
        as: 'book',
        to: '$',
        then: {
            "$..children[?(@.attrs.className == 'card-title')]": '$.title',
            '__CARD_TEXT__': '$.title',
            //       ???   NESTING `?????`
        }
    }
};

var datasets = [
    {
        key: 'worldpopulation',
        data: data,
    },
    {
        key: 'store',
        data: store
    },
    {
        key: 'template for card',
        data: cardTemplate
    },
    {
        key: 'rederedStuff',
        data: renderedTemplate
    }
];
var findData = (key) => {
    for (var i = 0; i < datasets.length; i++) {
        if (key === datasets[i].key)
            return datasets[i].data;
    }
};
var resultTypes = ["VALUE", "PATH", "LOCATION"];
class TestJsonPath {
    oninit(vnode) {
        vnode.state.path = '$';
        vnode.state.dataset = 'worldpopulation';
        vnode.state.resultType = 'VALUE';
        vnode.state.computeOutput(vnode)
    }
    changePath(vnode, ev) {
        vnode.state.path = ev.target.value;
        vnode.state.computeOutput(vnode)
    }
    computeOutput(vnode) {
        let tOut = JSON.stringify(Object(__WEBPACK_IMPORTED_MODULE_1__jsonpath__["a" /* default */])(findData(vnode.state.dataset), vnode.state.path, {resultType: vnode.state.resultType}), undefined, 2);
        if (tOut !== 'false')
            vnode.state.output = tOut;
    }
    changeDataset(vnode, ev) {
        vnode.state.dataset = ev.target.value;
        vnode.state.computeOutput(vnode)
    }
    changeResultType(vnode, ev) {
        vnode.state.resultType = ev.target.value;
        vnode.state.computeOutput(vnode);
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.row', [
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-6', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('select', {onchange: event(vnode, this.changeDataset)}, datasets.map(d => __WEBPACK_IMPORTED_MODULE_0_mithril___default()('option', d.key)))),
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-6', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('select', {onchange: event(vnode, this.changeResultType)}, resultTypes.map(d => __WEBPACK_IMPORTED_MODULE_0_mithril___default()('option', d + '')))),
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-md-6', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('input', {oninput: event(vnode, this.changePath)})),
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-md-6', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('pre', vnode.state.output))
        ]);
    }
}

let template = {
    templateID: 'page',
    class: 'container',
    children: [
        {
            class: 'row',
            children: [
                {
                    class: 'col-md-6',
                    children: [
                        {
                            class: ''
                        }
                    ]
                }
            ]
        }
    ]
};
class ES6TestComponent {
    constructor() {
        this.message = 'HELLO ES6';
    }
    view(vnode) {
        return [__WEBPACK_IMPORTED_MODULE_0_mithril___default()('h1', [vnode.attrs.id || this.message]), __WEBPACK_IMPORTED_MODULE_0_mithril___default()(VariableComponent, '---'), __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.row', renderedTemplate.map(c => __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Wrapper, {obj: c})))];
    }
}



class Wrapper {
    view(vnode) {
        console.log('wrapping', vnode.attrs.obj)
        return !vnode.attrs.obj ? null : __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].isArray(vnode.attrs.obj) ?
                __WEBPACK_IMPORTED_MODULE_0_mithril___default()('', vnode.attrs.obj.map(c => __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Wrapper, {obj: c}))) :
                __WEBPACK_IMPORTED_MODULE_0_mithril___default()(vnode.attrs.obj.tag,
                        vnode.attrs.obj.attrs,
                        vnode.attrs.obj.children ?
                        vnode.attrs.obj.children.map(c => {
                            console.log('c', c);
                            return __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].isString(c) ? c : __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Wrapper, {obj: c})
                        }) :
                        vnode.attrs.obj.text);
    }
}




class RenderJson {
    oninit(vnode) {
        vnode.state.collapsed = false;
    }
    toggleCollapsed(vnode, ev) {
        vnode.state.collapsed = !vnode.state.collapsed;
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()('div', {style: vnode.attrs.indent ? 'margin-left:' + vnode.attrs.indent + 'px' : ''}, [
            vnode.attrs.elem ? vnode.attrs.elem + ':' : null,
            __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].propList(vnode.attrs.obj).length ?
                    [
                        '{',
                        __WEBPACK_IMPORTED_MODULE_0_mithril___default()('span', {style: 'opacity:.5', onclick: event(vnode, this.toggleCollapsed)},
                                [
                                    ' -- ',
                                    vnode.attrs.path ? vnode.attrs.path : '$'
                                ]),
                        __WEBPACK_IMPORTED_MODULE_0_mithril___default()('br')
                    ]
                    : null,
            (!vnode.state.collapsed && __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].propList(vnode.attrs.obj).length) ?
                    __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].propList(vnode.attrs.obj).map(e =>
                __WEBPACK_IMPORTED_MODULE_0_mithril___default()(RenderJson,
                        {
                            indent: (vnode.attrs.indent ? vnode.attrs.indent + 10 : 10),
                            obj: vnode.attrs.obj[e],
                            elem: e,
                            path: vnode.attrs.path ? vnode.attrs.path + '.' + e : '$.' + e
                        })
            ) : ('' + JSON.stringify(vnode.attrs.obj)), __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].propList(vnode.attrs.obj).length ? null : __WEBPACK_IMPORTED_MODULE_0_mithril___default()('span', {style: 'opacity:.5'}, [' -- ', vnode.attrs.path ? vnode.attrs.path : '$']),
            __WEBPACK_IMPORTED_MODULE_5__utils__["a" /* default */].propList(vnode.attrs.obj).length ? '}' : null, ',', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('br')
        ]);
    }
}

var event = (vnode, fn) => {
    return (ev) => {
        fn(vnode, ev);
        __WEBPACK_IMPORTED_MODULE_0_mithril___default.a.redraw();
    };
};

class Alert {
    oncreate(vnode) {
        this.timeout = vnode.attrs.timeout || -1;
        if (this.timeout > 0) {
            setTimeout(event(vnode, this.remove), this.timeout);
        }
    }
    remove(vnode) {
        console.log('removal ', alerts);
        alerts.splice(alerts.indexOf(vnode.attrs.alert), 1);
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()(".alert.alert-warning.alert-dismissible.fade.show[role='alert']", {key: vnode.attrs.alert.key},
                [
                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("strong", vnode.attrs.alert.title),
                    [vnode.attrs.alert.alert, vnode.attrs.alert.key],
                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("button.close[aria-label='Close'][data-dismiss='-alert'][type='button']",
                            {onclick: event(vnode, this.remove)},
                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("span[aria-hidden='true']", __WEBPACK_IMPORTED_MODULE_0_mithril___default.a.trust("&times;")))
                ]
                );
    }
}

class Navbar {
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()("nav.navbar.navbar-expand-lg.navbar-light.bg-light",
                [
                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.navbar-brand[href='#']",
                            "Navbar"
                            ),
                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("button.navbar-toggler[aria-controls='navbarSupportedContent'][aria-expanded='false'][aria-label='Toggle navigation'][data-target='#navbarSupportedContent'][data-toggle='collapse'][type='button']",
                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("span.navbar-toggler-icon")
                            ),
                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()(".collapse.navbar-collapse[id='navbarSupportedContent']",
                            [
                                __WEBPACK_IMPORTED_MODULE_0_mithril___default()("ul.navbar-nav.mr-auto",
                                        [
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("li.nav-item.active",
                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.nav-link[href='#']",
                                                            [
                                                                "Home",
                                                                __WEBPACK_IMPORTED_MODULE_0_mithril___default()("span.sr-only",
                                                                        "(current)"
                                                                        )
                                                            ]
                                                            )
                                                    ),
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("li.nav-item",
                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.nav-link[href='#']",
                                                            "Link"
                                                            )
                                                    ),
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("li.nav-item.dropdown",
                                                    [
                                                        __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.nav-link.dropdown-toggle[aria-expanded='false'][aria-haspopup='true'][data-toggle='dropdown'][href='#'][id='navbarDropdown'][role='button']",
                                                                "Dropdown"
                                                                ),
                                                        __WEBPACK_IMPORTED_MODULE_0_mithril___default()(".dropdown-menu[aria-labelledby='navbarDropdown']",
                                                                [
                                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.dropdown-item[href='#/title/Helo']",
                                                                            "Action"
                                                                            ),
                                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.dropdown-item[href='#/render']",
                                                                            "render wrapper"
                                                                            ),
                                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()(".dropdown-divider"),
                                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.dropdown-item[href='#/jsonpath']",
                                                                            "Json Path"
                                                                            ),
                                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.dropdown-item[href='#/templatebuilder']",
                                                                            "TemplateBuilder"
                                                                            )
                                                                ]
                                                                )
                                                    ]
                                                    ),
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("li.nav-item",
                                                    __WEBPACK_IMPORTED_MODULE_0_mithril___default()("a.nav-link.disabled[href='#']",
                                                            "Disabled"
                                                            )
                                                    ),
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("button.btn.btn-primary[aria-pressed='false'][autocomplete='off'][data-toggle='button'][type='button']", {onclick: ev => {
                                                    Context.editMode = !Context.editMode;
                                                }},
                                                    Context.editMode ? "Don't edit" : "Edit"
                                                    )
                                        ]
                                        ),
                                __WEBPACK_IMPORTED_MODULE_0_mithril___default()("form.form-inline.my-2.my-lg-0",
                                        [
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("input.form-control.mr-sm-2[aria-label='Search'][placeholder='Search'][type='search']"),
                                            __WEBPACK_IMPORTED_MODULE_0_mithril___default()("button.btn.btn-outline-success.my-2.my-sm-0[type='submit']", {onclick: ev => alerts.push({text: 'hello', title: 'HoneyPot', key: Math.random()})},
                                                    "Search"
                                                    )
                                        ]
                                        )
                            ]
                            )
                ]
                );
    }
}

class TemplateBuilder {
    oninit(vnode) {
        vnode.state.virtual = false;
    }
    convert(vnode, ev) {
        console.log('#########', vnode);
        console.log(__WEBPACK_IMPORTED_MODULE_4__htmltohyperscript__["a" /* default */]);
        let source = document.getElementById('from-area').value;
        console.log(source)
        let input = vnode.state.virtual ? {source, virtual: vnode.state.virtual} : {source};
        let result = Object(__WEBPACK_IMPORTED_MODULE_4__htmltohyperscript__["a" /* default */])(input);
        document.getElementById('to-area').value = vnode.state.virtual ? JSON.stringify(result) : result;
        if (vnode.state.virtual) {
            datasets.push({key: 'result', data: result});
        }
    }
    toggleVirtual(vnode) {
        vnode.state.virtual = !vnode.state.virtual;
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.row', [
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-md-6', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('textarea#from-area[cols=20]', {style: "width:100%", cols: 20})),
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-md-6', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('textarea#to-area', {style: "width:100%", cols: 20})),
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.col-md-12', [
                __WEBPACK_IMPORTED_MODULE_0_mithril___default()('input[type=checkbox]', {value: vnode.state.virtual, onchange: __WEBPACK_IMPORTED_MODULE_0_mithril___default.a.withAttr('value', (v) => vnode.state.virtual = Boolean(v), vnode)}, 'virtual'),
                __WEBPACK_IMPORTED_MODULE_0_mithril___default()('button.btn.btn-default', {onclick: event(vnode, this.convert)}, 'Convert')
            ])
        ])
    }
}

__WEBPACK_IMPORTED_MODULE_0_mithril___default.a.route.prefix('#');
class Router {
    oncreate(vnode) {
        __WEBPACK_IMPORTED_MODULE_0_mithril___default.a.route(vnode.dom, '/', {
            '/': ES6TestComponent,
            '/title/:id': ES6TestComponent,
            '/render': {
                render: (vnode) => {
                    return [__WEBPACK_IMPORTED_MODULE_0_mithril___default()(Wrapper, {obj: cardTemplate}), __WEBPACK_IMPORTED_MODULE_0_mithril___default()(RenderJson, {obj: renderedTemplate})];
                }
            },
            '/jsonpath': TestJsonPath,
            '/templatebuilder': TemplateBuilder
        });
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()('');
    }
}

class Adder {
    add(vnode, ev) {
        vnode.attrs.cb(ev);
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()("button.close[aria-label='Close'][data-dismiss='-alert'][type='button']",
                {onclick: event(vnode, this.add)},
                __WEBPACK_IMPORTED_MODULE_0_mithril___default()("span[aria-hidden='true']", __WEBPACK_IMPORTED_MODULE_0_mithril___default.a.trust("&plus;")));
    }
}

class Editbar {
    oninit(vnode) {
        vnode.state.tags = ['button', 'div', 'article', 'nav', 'a', 'input'];
    }
    applyClassToParent(vnode, ev) {
        vnode.attrs.cc(ev.target.value);
    }
    applyTagToParent(vnode, ev) {
        vnode.attrs.tc(ev.target.value);
    }
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()('', 'Editbar', __WEBPACK_IMPORTED_MODULE_0_mithril___default()('select', {onchange: event(vnode, this.applyClassToParent)}, [
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('option', 'alert alert-warning'),
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()('option', 'alert alert-success')]), __WEBPACK_IMPORTED_MODULE_0_mithril___default()('select', {onchange: event(vnode, this.applyTagToParent)}, [
            vnode.state.tags.map(t => __WEBPACK_IMPORTED_MODULE_0_mithril___default()('option', t))
        ]));
    }
}

class VariableComponent {
    oninit(vnode) {
        vnode.state.tag = '';
        vnode.state.class = 'alert alert-warning';
//        setInterval(event(vnode, v => console.log(vnode.state.class)), 1000);
    }
    applyClass(vnode, ev) {
        vnode.state.class = ev;
    }
    applyTag(vnode, ev) {
        vnode.state.tag = ev;
    }
    addChild(vnode, ev) {
        console.log(vnode.children);
        // vnode.children  ADD A DATAMODEL FOR THE TEMPLATE HEREs
    }
    view(vnode) {
        return  [
            Context.editMode ? __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Editbar, {
                t: vnode.state.tag,
                tc: event(vnode, this.applyTag),
                c: vnode.state.class,
                cc: event(vnode, this.applyClass)
            }) : null,
            __WEBPACK_IMPORTED_MODULE_0_mithril___default()(vnode.state.tag, {class: vnode.state.class}, vnode.children),
            Context.editMode ? __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Adder, {cb: event(vnode, this.addChild)}) : null];
    }
}

var alerts = [{text: 'hello', title: 'HoneyPot', key: 0}];
class AlertList {
    view(vnode) {
        return __WEBPACK_IMPORTED_MODULE_0_mithril___default()('', [__WEBPACK_IMPORTED_MODULE_0_mithril___default()('.badge.badge-secondary', alerts.length), alerts.map((al, idx) => __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Alert, {alert: al, timeout: 3000}))]);
    }
}

class PageLayout {
    view(vnode) {
        return [__WEBPACK_IMPORTED_MODULE_0_mithril___default()(Navbar), __WEBPACK_IMPORTED_MODULE_0_mithril___default()('.container', __WEBPACK_IMPORTED_MODULE_0_mithril___default()(AlertList), __WEBPACK_IMPORTED_MODULE_0_mithril___default()('article', __WEBPACK_IMPORTED_MODULE_0_mithril___default()(Router)))];
    }
}



__WEBPACK_IMPORTED_MODULE_0_mithril___default.a.mount(document.getElementById('app'), PageLayout);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, global) {;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
		if (vnode.instance != null) onremove(vnode.instance)
		else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		for (var i = 0; i < hooks.length; i++) hooks[i]()
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.5"
m.vnode = Vnode
if (true) module["exports"] = m
else window.m = m
}());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).setImmediate, __webpack_require__(1)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(7);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
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
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* JSONPath 0.8.5 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 *
 * Proposal of Chris Zyp goes into version 0.9.x
 * Issue 7 resolved
 */
function jsonPath(obj, expr, arg) {
//    console.log('####################################');
//            console.log(expr);
    var P = {
        resultType: arg && arg.resultType || "VALUE",
        result: [],
        applyFn: arg && arg.applyFn,
        normalize: function (expr) {
            var subx = [];
            return expr.replace(/[\['](\??\(.*?\))[\]']|\['(.*?)'\]/g, function ($0, $1, $2) {
                return "[#" + (subx.push($1 || $2) - 1) + "]";
            })  /* http://code.google.com/p/jsonpath/issues/detail?id=4 */
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function ($0, $1) {
                        return subx[$1];
                    });
        },
        asPath: function (path) {
            var x = path.split(";"), p = "$";
            for (var i = 1, n = x.length; i < n; i++)
                p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
            return p;
        },
        asLocation: function (path) {
            var x = path.split(";"), p = [];
            for (var i = 1, n = x.length; i < n; i++) {
                console.log(x[i]);
                p.push(/^[0-9*]+$/.test(x[i]) ?parseInt(x[i]): x[i]);
            }
            return p;
        },
        store: function (p, v) {
            if (p) {
                if (P.applyFn) {
                    console.log('before: ', v);
                    v = P.applyFn(v);
                    console.log('after: ', v);
                } else if (P.resultType === 'LOCATION') {
                    P.result[P.result.length] = P.asLocation(p);
                } else {
                    P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : (v);
                }
            }
            return !!p;
        },
        trace: function (expr, val, path) {
//            console.log(expr, val, path);
            if (expr !== "") {
                var x = expr.split(";"), loc = x.shift();
                x = x.join(";");
                if (val && val.hasOwnProperty(loc))
                    P.trace(x, val[loc], path + ";" + loc);
                else if (loc === "*")
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        P.trace(m + ";" + x, v, p);
                    });
                else if (loc === "..") {
                    P.trace(x, val, path);
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m);
                    });
                } else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                    P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
                else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v instanceof Array ? v[m] : v, m))
                            P.trace(m + ";" + x, v, p);
                    }); // issue 5 resolved
                else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                    P.slice(loc, x, val, path);
                else if (/,/.test(loc)) { // [name1,name2,...]
                    for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                        P.trace(s[i] + ";" + x, val, path);
                }
            } else
                P.store(path, val);
        },
        walk: function (loc, expr, val, path, f) {
            if (val instanceof Array) {
                for (var i = 0, n = val.length; i < n; i++)
                    if (i in val)
                        f(i, loc, expr, val, path);
            } else if (typeof val === "object") {
                for (var m in val)
                    if (val.hasOwnProperty(m))
                        f(m, loc, expr, val, path);
            }
        },
        slice: function (loc, expr, val, path) {
            if (val instanceof Array) {
                var len = val.length, start = 0, end = len, step = 1;
                loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {
                    start = parseInt($1 || start);
                    end = parseInt($2 || end);
                    step = parseInt($3 || step);
                });
                start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
                end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
                for (var i = start; i < end; i += step)
                    P.trace(i + ";" + expr, val, path);
            }
        },
        eval: function (x, _v, _vname) {
            try {
                return $ && _v && eval(x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@"));
            }  // issue 7 : resolved ..
            catch (e) {
                throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@"));
            }  // issue 7 : resolved ..
        }
    };
    var $ = obj;
    if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH" || P.resultType == "LOCATION")) {
        P.trace(P.normalize(expr).replace(/^\$;?/, ""), obj, "$"); // issue 6 resolved
        return P.result.length ? P.result : false;
    }
}

/** AE: exported as module to be compatible with the rest of the code. */
/* harmony default export */ __webpack_exports__["a"] = (jsonPath);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var equalsOptions = { strict: true };
var _equals = __webpack_require__(2);
var areEquals = function (a, b) {
    return _equals(a, b, equalsOptions);
};
var helpers_1 = __webpack_require__(0);
var core_1 = __webpack_require__(3);
/* export all core functions */
var core_2 = __webpack_require__(3);
exports.applyOperation = core_2.applyOperation;
exports.applyPatch = core_2.applyPatch;
exports.applyReducer = core_2.applyReducer;
exports.getValueByPointer = core_2.getValueByPointer;
exports.validate = core_2.validate;
exports.validator = core_2.validator;
/* export some helpers */
var helpers_2 = __webpack_require__(0);
exports.JsonPatchError = helpers_2.PatchError;
exports.deepClone = helpers_2._deepClone;
exports.escapePathComponent = helpers_2.escapePathComponent;
exports.unescapePathComponent = helpers_2.unescapePathComponent;
var beforeDict = [];
var Mirror = (function () {
    function Mirror(obj) {
        this.observers = [];
        this.obj = obj;
    }
    return Mirror;
}());
var ObserverInfo = (function () {
    function ObserverInfo(callback, observer) {
        this.callback = callback;
        this.observer = observer;
    }
    return ObserverInfo;
}());
function getMirror(obj) {
    for (var i = 0, length = beforeDict.length; i < length; i++) {
        if (beforeDict[i].obj === obj) {
            return beforeDict[i];
        }
    }
}
function getObserverFromMirror(mirror, callback) {
    for (var j = 0, length = mirror.observers.length; j < length; j++) {
        if (mirror.observers[j].callback === callback) {
            return mirror.observers[j].observer;
        }
    }
}
function removeObserverFromMirror(mirror, observer) {
    for (var j = 0, length = mirror.observers.length; j < length; j++) {
        if (mirror.observers[j].observer === observer) {
            mirror.observers.splice(j, 1);
            return;
        }
    }
}
/**
 * Detach an observer from an object
 */
function unobserve(root, observer) {
    observer.unobserve();
}
exports.unobserve = unobserve;
/**
 * Observes changes made to an object, which can then be retrieved using generate
 */
function observe(obj, callback) {
    var patches = [];
    var root = obj;
    var observer;
    var mirror = getMirror(obj);
    if (!mirror) {
        mirror = new Mirror(obj);
        beforeDict.push(mirror);
    }
    else {
        observer = getObserverFromMirror(mirror, callback);
    }
    if (observer) {
        return observer;
    }
    observer = {};
    mirror.value = helpers_1._deepClone(obj);
    if (callback) {
        observer.callback = callback;
        observer.next = null;
        var dirtyCheck = function () {
            generate(observer);
        };
        var fastCheck = function () {
            clearTimeout(observer.next);
            observer.next = setTimeout(dirtyCheck);
        };
        if (typeof window !== 'undefined') {
            if (window.addEventListener) {
                window.addEventListener('mouseup', fastCheck);
                window.addEventListener('keyup', fastCheck);
                window.addEventListener('mousedown', fastCheck);
                window.addEventListener('keydown', fastCheck);
                window.addEventListener('change', fastCheck);
            }
            else {
                document.documentElement.attachEvent('onmouseup', fastCheck);
                document.documentElement.attachEvent('onkeyup', fastCheck);
                document.documentElement.attachEvent('onmousedown', fastCheck);
                document.documentElement.attachEvent('onkeydown', fastCheck);
                document.documentElement.attachEvent('onchange', fastCheck);
            }
        }
    }
    observer.patches = patches;
    observer.object = obj;
    observer.unobserve = function () {
        generate(observer);
        clearTimeout(observer.next);
        removeObserverFromMirror(mirror, observer);
        if (typeof window !== 'undefined') {
            if (window.removeEventListener) {
                window.removeEventListener('mouseup', fastCheck);
                window.removeEventListener('keyup', fastCheck);
                window.removeEventListener('mousedown', fastCheck);
                window.removeEventListener('keydown', fastCheck);
            }
            else {
                document.documentElement.detachEvent('onmouseup', fastCheck);
                document.documentElement.detachEvent('onkeyup', fastCheck);
                document.documentElement.detachEvent('onmousedown', fastCheck);
                document.documentElement.detachEvent('onkeydown', fastCheck);
            }
        }
    };
    mirror.observers.push(new ObserverInfo(callback, observer));
    return observer;
}
exports.observe = observe;
/**
 * Generate an array of patches from an observer
 */
function generate(observer) {
    var mirror;
    for (var i = 0, length = beforeDict.length; i < length; i++) {
        if (beforeDict[i].obj === observer.object) {
            mirror = beforeDict[i];
            break;
        }
    }
    _generate(mirror.value, observer.object, observer.patches, "");
    if (observer.patches.length) {
        core_1.applyPatch(mirror.value, observer.patches);
    }
    var temp = observer.patches;
    if (temp.length > 0) {
        observer.patches = [];
        if (observer.callback) {
            observer.callback(temp);
        }
    }
    return temp;
}
exports.generate = generate;
// Dirty check if obj is different from mirror, generate patches and update mirror
function _generate(mirror, obj, patches, path) {
    if (obj === mirror) {
        return;
    }
    if (typeof obj.toJSON === "function") {
        obj = obj.toJSON();
    }
    var newKeys = helpers_1._objectKeys(obj);
    var oldKeys = helpers_1._objectKeys(mirror);
    var changed = false;
    var deleted = false;
    //if ever "move" operation is implemented here, make sure this test runs OK: "should not generate the same patch twice (move)"
    for (var t = oldKeys.length - 1; t >= 0; t--) {
        var key = oldKeys[t];
        var oldVal = mirror[key];
        if (helpers_1.hasOwnProperty(obj, key) && !(obj[key] === undefined && oldVal !== undefined && Array.isArray(obj) === false)) {
            var newVal = obj[key];
            if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
                _generate(oldVal, newVal, patches, path + "/" + helpers_1.escapePathComponent(key));
            }
            else {
                if (oldVal !== newVal) {
                    changed = true;
                    patches.push({ op: "replace", path: path + "/" + helpers_1.escapePathComponent(key), value: helpers_1._deepClone(newVal) });
                }
            }
        }
        else {
            patches.push({ op: "remove", path: path + "/" + helpers_1.escapePathComponent(key) });
            deleted = true; // property has been deleted
        }
    }
    if (!deleted && newKeys.length == oldKeys.length) {
        return;
    }
    for (var t = 0; t < newKeys.length; t++) {
        var key = newKeys[t];
        if (!helpers_1.hasOwnProperty(mirror, key) && obj[key] !== undefined) {
            patches.push({ op: "add", path: path + "/" + helpers_1.escapePathComponent(key), value: helpers_1._deepClone(obj[key]) });
        }
    }
}
/**
 * Create an array of patches from the differences in two objects
 */
function compare(tree1, tree2) {
    var patches = [];
    _generate(tree1, tree2, patches, '');
    return patches;
}
exports.compare = compare;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const ENTITY_REGEX = /(&#?\w+;)/;

const svgCaseSensitiveTagNames = ["altGlyph", "altGlyphDef", "altGlyphItem", "animateColor", "animateMotion", "animateTransform", "clipPath", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "foreignObject", "glyphRef", "linearGradient", "radialGradient", "textPath"];

const svgCaseSensitiveTagNamesMap = {};
svgCaseSensitiveTagNames.forEach((term) => {
    svgCaseSensitiveTagNamesMap[term.toLowerCase()] = term;
});

function each(list, f) {
    for (let i = 0; i < list.length; i++) {
        f(list[i], i);
    }
}

function createFragment(markup) {
    // escape HTML entities, to be resolved in addVirtualString
    markup = markup.replace(/&/g, "&amp;");
    if (markup.indexOf("<!doctype") >= 0) {
        return [
            new DOMParser()
                    .parseFromString(markup, "text/html")
                    .childNodes[1]
        ];
    }
    const container = document.createElement("div");
    container.insertAdjacentHTML("beforeend", markup);
    return container.childNodes;
}

function createVirtual(fragment) {
    const list = [];

    each(fragment, function (el) {
        if (el.nodeType === 3) {
            list.push(el.nodeValue);
        } else if (el.nodeType === 1) {
            const attrs = {};
            each(el.attributes, function (attr) {
                attrs[attr.name] = attr.value;
            });

            const tag = el.nodeName.toLowerCase();
            const caseTag = svgCaseSensitiveTagNamesMap[tag] ? svgCaseSensitiveTagNamesMap[tag] : tag;

            list.push({
                tag: caseTag,
                attrs,
                children: createVirtual(el.childNodes)
            });
        }
    });
    return list;
}

function TemplateBuilder(virtual) {
    this.virtual = virtual;
    this.children = []; // each child is an object with attributes: node, children, content
}

TemplateBuilder.prototype = {
    addVirtualString: function (el) {
        const content = el.replace(/(["\r\n])/g, "\\$1");
        // handle HTML entities
        const contentWithEntities = content.split(ENTITY_REGEX);
        if (contentWithEntities.length > 1) {
            contentWithEntities.forEach((part) => {
                if (part.match(ENTITY_REGEX)) {
                    this.children.push({
                        content: `m.trust("${part}")`
                    });
                } else if (part) {
                    this.children.push({
                        content: `"${part}"`
                    });
                }
            });
        } else {
            this.children.push({
                content: `"${content}"`
            });
        }
    },

    addVirtualAttrs: function (el) {
        let virtual = el.tag === "div" ? "" : el.tag;

        if (el.attrs.class) {
            let attrs = el.attrs.class.replace(/\s+/g, ".");
            virtual += `.${attrs}`;
            el.attrs.class = undefined;
        }

        each(Object.keys(el.attrs).sort(), function (attrName) {
            if (attrName === "style")
                return;
            if (el.attrs[attrName] === undefined)
                return;
            let attrs = el.attrs[attrName];
            attrs = attrs.replace(/[\n\r\t]/g, " ");
            attrs = attrs.replace(/\s+/g, " "); // clean up redundant spaces we just created
            attrs = attrs.replace(/'/g, "\\'"); // escape quotes
            virtual += `[${attrName}='${attrs}']`;
        });

        if (virtual === "")
            virtual = "div";
        virtual = `"${virtual}"`; // add quotes

        if (el.attrs.style) {
            let attrs = el.attrs.style.replace(/(^.*);\s*$/, "$1"); // trim trailing semi-colon
            attrs = attrs.replace(/[\n\r]/g, ""); // remove newlines
            attrs = attrs.split(/\s*;\s*/); // ["color:#f00", "border: 1px solid red"]
            attrs = attrs.map((propValue) => {
                // "color:#f00"
                return propValue.split(/\s*:\s*/).map((part) => {
                    return `"${part}"`;
                }).join(": "); // "\"color\": \"#f00\""
            });
            attrs = attrs.join(", ");
            virtual += `, {style: {${attrs}}}`;
        }

        const children = (el.children.length !== 0) ?
                new TemplateBuilder(el.children).complete() :
                null;

        this.children.push({
            node: virtual,
            children
        });
    },

    complete: function () {
        each(this.virtual, function (el) {
            if (typeof el === "string") {
                const trimmed = el.trim();
                const charCode = trimmed.charCodeAt();
                // dimiss:
                // - empty strings
                // - single escaped quotes
                // - single newlines
                // - characters with char code lower than SPACE, but allow newlines in multiline text
                if (
                        trimmed.length !== 0
                        && trimmed !== "\""
                        && !(trimmed.length === 1 && charCode === 10)
                        && (charCode === 10 || charCode >= 32)
                        ) {
                    this.addVirtualString(trimmed);
                }
            } else {
                this.addVirtualAttrs(el);
            }
        }.bind(this));
        return this.children;
    }
};

const whitespace = (level, indent) => {
    if (level < 0)
        return "";
    let whitespace = "";
    for (var i = 0; i < level; i++) {
        whitespace += indent;
    }
    return whitespace;
};

const wrapperTemplate = content => (
            `[${content}\n]`
            );

const contentTemplate = (content, whitespace) => (
            `\n${whitespace}${content}`
            );

const singleMithrilNodeTemplate = (mithrilNode, children, whitespace) => (
            `\n${whitespace}m(${mithrilNode})`
            );

const mithrilNodeMultipleChildrenTemplate = (mithrilNode, children, whitespace, indent) => (
            `\n${whitespace}m(${mithrilNode},
${whitespace}${indent}[${children}
${whitespace}${indent}]
${whitespace})`
            );

const mithrilNodeSingleChildTemplate = (mithrilNode, child, whitespace) => (
            `\n${whitespace}m(${mithrilNode}, ${child}
${whitespace})`
            );

const template = (mithrilNode, children, whitespace, indent) => (
            children
            ? children.length > 1
            ? mithrilNodeMultipleChildrenTemplate(mithrilNode, children, whitespace, indent)
            : mithrilNodeSingleChildTemplate(mithrilNode, children, whitespace, indent)
            : singleMithrilNodeTemplate(mithrilNode, children, whitespace, indent)
            );

const formatCode = (data, level, indent) => {
    if (!data) {
        return "";
    }
    return data.map((d) => {
        const space = whitespace(level, indent);
        if (d.content) {
            return contentTemplate(d.content, space);
        }
        const node = d.node || "";
        const newLevel = level + (d.children && d.children.length > 1 ? 2 : 1);
        const children = formatCode(d.children, newLevel, indent) || "";
        return template(node, children, space, indent);
    });
};

const indentCharsMap = {
    "2": "  ",
    "4": "    ",
    "tab": "\t"
};

/*
 opts: {
 source: string containing HTML markup
 indent: either "2", "4" or "tab"
 }
 */
const templateBuilder = opts => {
    const source = createVirtual(createFragment(opts.source));
    if (opts.virtual === true)
        return source;
    const parsed = new TemplateBuilder(source).complete();
    const indentLevel = parsed.length > 1 ?
            1 :
            0;
    const indentChars = indentCharsMap[opts.indent || "4"];
    const formatted = formatCode(parsed, indentLevel, indentChars);

    // only wrap output in brackets when it is a list
    const wrapped = formatted.length > 1 ?
            wrapperTemplate(formatted.join(", ")) :
            formatted.join("").trim();
    return wrapped;
};

/* harmony default export */ __webpack_exports__["a"] = (templateBuilder);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__jsonPath__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(17);




var render = input => {
    var output = [];

    let template = input.template || null;

    var appendTemplateCopyToOutput = value => {
        let t = __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].copy(template);
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].traverse(t, (root, member) => {
            if (__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].isString(root[member]) && root[member][0] === '$') {
                root[member] = Object(__WEBPACK_IMPORTED_MODULE_0__jsonPath__["a" /* default */])(value, root[member])[0];
            }
        });
        output.push(t);
    };

    if (input.data && input.path) {
        let result = Object(__WEBPACK_IMPORTED_MODULE_0__jsonPath__["a" /* default */])(input.data, input.path);
        result.map(appendTemplateCopyToOutput);
    } else {
        appendTemplateCopyToOutput(input.data);
    }
    return output;
};

/* harmony default export */ __webpack_exports__["a"] = (render);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* JSONPath 0.8.5 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 *
 * Proposal of Chris Zyp goes into version 0.9.x
 * Issue 7 resolved
 */
function jsonPath(obj, expr, arg) {
//    console.log('####################################');
//            console.log(expr);
    var P = {
        resultType: arg && arg.resultType || "VALUE",
        result: [],
        applyFn: arg && arg.applyFn,
        normalize: function (expr) {
            var subx = [];
            return expr.replace(/[\['](\??\(.*?\))[\]']|\['(.*?)'\]/g, function ($0, $1, $2) {
                return "[#" + (subx.push($1 || $2) - 1) + "]";
            })  /* http://code.google.com/p/jsonpath/issues/detail?id=4 */
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function ($0, $1) {
                        return subx[$1];
                    });
        },
        asPath: function (path) {
            var x = path.split(";"), p = "$";
            for (var i = 1, n = x.length; i < n; i++)
                p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
            return p;
        },
        asLocation: function (path) {
            var x = path.split(";"), p = [];
            for (var i = 1, n = x.length; i < n; i++) {
                console.log(x[i]);
                p.push(/^[0-9*]+$/.test(x[i]) ?parseInt(x[i]): x[i]);
            }
            return p;
        },
        store: function (p, v) {
            if (p) {
                if (P.applyFn) {
                    console.log('before: ', v);
                    v = P.applyFn(v);
                    console.log('after: ', v);
                } else if (P.resultType === 'LOCATION') {
                    P.result[P.result.length] = P.asLocation(p);
                } else {
                    P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : (v);
                }
            }
            return !!p;
        },
        trace: function (expr, val, path) {
//            console.log(expr, val, path);
            if (expr !== "") {
                var x = expr.split(";"), loc = x.shift();
                x = x.join(";");
                if (val && val.hasOwnProperty(loc))
                    P.trace(x, val[loc], path + ";" + loc);
                else if (loc === "*")
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        P.trace(m + ";" + x, v, p);
                    });
                else if (loc === "..") {
                    P.trace(x, val, path);
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m);
                    });
                } else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                    P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
                else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v instanceof Array ? v[m] : v, m))
                            P.trace(m + ";" + x, v, p);
                    }); // issue 5 resolved
                else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                    P.slice(loc, x, val, path);
                else if (/,/.test(loc)) { // [name1,name2,...]
                    for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                        P.trace(s[i] + ";" + x, val, path);
                }
            } else
                P.store(path, val);
        },
        walk: function (loc, expr, val, path, f) {
            if (val instanceof Array) {
                for (var i = 0, n = val.length; i < n; i++)
                    if (i in val)
                        f(i, loc, expr, val, path);
            } else if (typeof val === "object") {
                for (var m in val)
                    if (val.hasOwnProperty(m))
                        f(m, loc, expr, val, path);
            }
        },
        slice: function (loc, expr, val, path) {
            if (val instanceof Array) {
                var len = val.length, start = 0, end = len, step = 1;
                loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {
                    start = parseInt($1 || start);
                    end = parseInt($2 || end);
                    step = parseInt($3 || step);
                });
                start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
                end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
                for (var i = start; i < end; i += step)
                    P.trace(i + ";" + expr, val, path);
            }
        },
        eval: function (x, _v, _vname) {
            try {
                return $ && _v && eval(x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@"));
            }  // issue 7 : resolved ..
            catch (e) {
                throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@"));
            }  // issue 7 : resolved ..
        }
    };
    var $ = obj;
    if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH" || P.resultType == "LOCATION")) {
        P.trace(P.normalize(expr).replace(/^\$;?/, ""), obj, "$"); // issue 6 resolved
        return P.result.length ? P.result : false;
    }
}

/** AE: exported as module to be compatible with the rest of the code. */
/* harmony default export */ __webpack_exports__["a"] = (jsonPath);


/***/ }),
/* 16 */,
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var isFunction = (fn) => {
    return typeof fn === 'function';
};

var isArray = (obj) => {
    return obj && isFunction(obj.map);
};

var isString = (obj) => {
    return objj && typeof obj === 'string';
};

var propList = obj => {
    let p = [];
    if (isString(obj))
        return p;
    for (var q in obj)
        p.push(q);
    return p;
};

var traverse = (obj, fn) => {
    propList(obj).forEach(prop => {
        fn(obj, prop);
        return !isString(obj[prop]) &&
                traverse(obj[prop], fn);
    });
};

var copy = obj => {
    let result = JSON.parse(JSON.stringify(obj));
    return result;
};

/* harmony default export */ __webpack_exports__["a"] = ({
    propList: propList,
    isArray: isArray,
    isString: isString,
    isFunction: isFunction,
    traverse: traverse,
    copy: copy
});


/***/ })
/******/ ]);