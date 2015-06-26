import * as d from "./data";

export const BREAK = Symbol("break");

// shenanigans
Function.prototype.autocurry = fac;
function fac (n) {
    return autocurry(this, n);
}
Function.prototype.curry = fc;
function fc () {
    return curry(this);
}

// is
export var is = {
    array (x) {
        return Array.isArray(x);
    },
    string (x) {
        return typeof x === "string";
    },
    number (x) {
        return +x === +x;
    },
    object (x) {
        return Object.prototype.toString.call(x) === "[object Object]";
    },
    stringOrNumber (x) {
        return +x === +x || typeof x === "string";
    },
    chordString (x) {
        return d.regex.chordString.test(x);
    },
    noteString (x) {
        return d.regex.noteString.test(x);
    },
    extensionNumber (x) {
        return d.extension.has(parseInt(x));
    }
};

// function
export var demethodize = Function.prototype.bind.bind(Function.prototype.call);
export var slice = demethodize(Array.prototype.slice);
export function iam () {
    return this;
}
export function make (f) {
    return function (...args) {
        return new f(...args);
    };
}
export function compose () {
    let funcs = arguments;
    return function () {
        let args = arguments,
            l = funcs.length;
        while (l) {
            args = [funcs[--l].apply(this, args)];
        }

        return args[0];
    };
}
export function curry (f) {
    var args = slice(arguments, 1);
    return function () {
        return f.apply(this, args.concat(slice(arguments)));
    };
}
export function autocurry (f, n = f.length) {
    return function () {
        let args = slice(arguments);
        let m = n - args.length;
        if (args.length < n) {
            let g = curry.apply(this, [f].concat(args));
            return m > 0 ? autocurry(g, m) : g;
        } else {
            return f.apply(this, args);
        }
    };
}

//iteration
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
var each = function each (f, x, context) {
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
var map = function map (f, x, context = x) {
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
var filter = function filter (f, x, context = x) {
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
var find = function find (f, x, context) {
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

// string
export var replace = function replace (rx, subst, string) {
    return string.replace(rx, subst);
}.autocurry();

// regex
export var firstMatch = function (regex, string) {
    var match = string.match(regex);
    if (match) {
        return match.length > 1 ? match[1] : match[0];
    } else {
        return "";
    }
}.autocurry();

// pitch / parsing
export var accidental       = firstMatch(d.regex.accidental);
export var getIntervalNumber = firstMatch(d.regex.interval);
export var note              = firstMatch(d.regex.note);
export var isPerfect         = n => d.perfect.has(n % 12);

export function pitchNameByClass (index, acc = "#") {
    return d.pitchNameByClass[acc][index];
}
export function pitchClassByName (pitchName) {
    return d.pitchClassByName[pitchName];
}
export function pitchClassByNumber (number) {
    return number % 12;
}
export function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function accidental (string) {
    return firstMatch(d.regex.accidental);
}
export function noteNumber (octave, pitchClass) {
    return octave * 12 + pitchClass;
}
export function octave (number) {
    return ~~(number / 12);
}
export function intervalStringToNumber (string) {
    let dir       = /-/.test(string) ? "down" : "up";
    let _quality  = quality(string);
    let number    = getIntervalNumber(string);
    let mod       = d.modifiers.interval[_quality] || 0;
    let unmodded  = find(check, d.interval.long) ||
                    find(check, d.interval.med)  ||
                    find(check, d.interval.short);
    if (!_quality) {
        _quality = isPerfect(unmodded) ? "perfect" : "major";
    }
    if (dir === "down") {
        mod *= -1;
        unmodded *= -1;
    }

    /*
    console.group("intervalStringToNumber");
    console.log("direction", dir);
    console.log("quality:", _quality);
    console.log("number:", number);
    console.log("mod:", mod);
    console.log("unmodded:", unmodded);

    console.log("result:", unmodded + mod);
    console.groupEnd("intervalStringToNumber");
    */

    return unmodded + mod;

    function check (value, key) {
        return key === number;
    }
}
export function lengthFromExt1 (string) {
    let num = parseInt(string);
    switch (num) {
        case 6 :
        case 7 : return 4;
        case 9 : return 5;
        case 11: return 6;
        case 13: return 7;
        default: return 0;
    }
}

// input normalization
export function normalizeIntervalNumber (raw) {
    let result = "";
    raw = raw + "";
    each(function (set, name) {
        if (set.has(raw)) {
            result = name;
            return BREAK;
        }
    }, d.alias.interval);
    return result;
}
export function normalizeQuality (string) {
    if (d.regex.major.test(string)) {
        return "major";
    }
    if (d.regex.minor.test(string)) {
        return "minor";
    }
    if (d.regex.augmented.test(string)) {
        return "augmented";
    }
    if (d.regex.diminished.test(string)) {
        return "diminished";
    }
    return "";
}
export function normalizeChordModifier (mod) {
    if (d.regex.modifiers.chord.add.test(mod)) {
        return "add";
    }
    if (d.regex.modifiers.chord.sus.test(mod)) {
        return "sus";
    }
    if (d.regex.modifiers.chord.maj.test(mod)) {
        return "major";
    }
    if (d.regex.modifiers.chord.min.test(mod)) {
        return "minor";
    }
    return "";
}
export function normalizeChordExtension (ext) {
    //([#b]?(?:min|maj|M|m)?(?:5|6|7|9|11|13))

}
