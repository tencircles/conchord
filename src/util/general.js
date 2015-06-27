import * as d from "./data";

export const BREAK = Symbol("break");

//iteration
export var each = function each (f, x, context) {
    if (f && x) {
        if (Array.isArray(x)) {
            return forEach(f, x, context);
        } else if (Object.prototype.isPrototypeOf(x)) {
            return forOwn(f, x, context);
        } else {
            return forEach(f, Array.from(x), context);
        }
    } else {
        return x;
    }
}.autocurry(2);

export var map = function map (f, x, context = x) {
    var result;
    if (Array.isArray(x)) {
        result = [];
        for (var i = 0, ii = x.length; i < ii; i++) {
            result[i] = f.call(context, x[i], i, x);
        }
    } else if (Object.prototype.isPrototypeOf(x)) {
        result = {};
        Object.keys(x).forEach(enumerate);
    }
    return result;
    function enumerate (key) {
        result[key] = f.call(context, x[key], key, x);
    }
}.autocurry(2);

export var filter = function filter (f, x, context = x) {
    var result;
    if (Array.isArray(x)) {
        result = [];
        for (var i = 0, ii = x.length; i < ii; i++) {
            if (f.call(context, x[i], i, x)) {
                result.push(x[i]);
            }
        }
    } else if (Object.prototype.isPrototypeOf(x)) {
        result = {};
        Object.keys(x).forEach(enumerate);
    }
    return result;
    function enumerate (key) {
        if (f.call(context, x[key], key, x)) {
            result[key] = x[key];
        }
    }
}.autocurry(2);

export var find = function find (f, x, context) {
    var result;
    each(iterate, x);
    return result;
    function iterate (value, key) {
        if (f.call(context, value, key, x)) {
            result = value;
            return BREAK;
        }
    }
}.autocurry(2);

function forEach (f, array, context) {
    var ii = array.length,
        i = -1;

    while (++i < ii) {
        if (f.call(context, array[i], i, array) === BREAK) {
            break;
        }
    }
    return array;
}
function forOwn (f, obj, context) {
    var keys = Object.keys(obj),
        ii = keys.length,
        i = -1;

    while (++i < ii) {
        if (f.call(context, obj[keys[i]], keys[i], obj) === BREAK) {
            break;
        }
    }
    return obj;
}

// string
export var replace = function replace (rx, subst, string) {
    return string.replace(rx, subst);
}.autocurry();

export function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// regex
export var firstMatch = function (regex, string) {
    var match;
    if (string) {
        match = string.match(regex);
        if (match) {
            return match.length > 1 ? match[1] : match[0];
        }
    }
    return "";
}.autocurry();

// types
export var is = {
    number          : x => +x === +x,
    array           : x => Array.isArray(x),
    string          : x => typeof x === "string",
    perfect         : n => d.perfect.has(n % 12),
    interval        : x => d.regex.interval.text(x),
    accidental      : x => d.regex.accidental.test(x),
    noteString      : x => d.regex.noteString.test(x),
    chordString     : x => d.regex.chordString.test(x),
    extensionNumber : x => d.extension.has(parseInt(x)),
    stringOrNumber  : x => +x === +x || typeof x === "string",
    object          : x => Object.prototype.toString.call(x) === "[object Object]"
};
