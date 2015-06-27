import * as d from "./data";
import * as f from "./fn";
import * as g from "./general";

// input normalization
export function normalizeIntervalNumber (raw) {
    let result = "";
    raw += "";
    f.each(checkName, d.alias.interval);
    return result;
    function checkName (set, name) {
        if (set.has(raw)) {
            result = name;
            return g.BREAK;
        }
    }
}
export function normalizeQuality (string) {
    if (d.regex.major.test(string)) {
        return d.MAJ;
    }
    if (d.regex.minor.test(string)) {
        return d.MIN;
    }
    if (d.regex.augmented.test(string)) {
        return d.AUG;
    }
    if (d.regex.diminished.test(string)) {
        return d.DIM;
    }
    return d.DOM;
}
export function normalizeChordModifier (mod) {
    if (d.regex.modifiers.chord.add.test(mod)) {
        return d.ADD;
    }
    if (d.regex.modifiers.chord.sus.test(mod)) {
        return d.SUS;
    }
    if (d.regex.modifiers.chord.maj.test(mod)) {
        return d.MAJ;
    }
    if (d.regex.modifiers.chord.min.test(mod)) {
        return d.MIN;
    }
    return d.NONE;
}
export function normalizeAccidental (string) {
    if (typeof string === "string") {
        return string || "";
    }
    return "";
}
