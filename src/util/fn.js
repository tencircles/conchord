// function
export var demethodize = Function.prototype.bind.bind(Function.prototype.call);
export var slice = demethodize(Array.prototype.slice);

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

// shenanigans
Function.prototype.autocurry = fac;
function fac (n) {
    return autocurry(this, n);
}
Function.prototype.curry = fc;
function fc () {
    return curry(this);
}
