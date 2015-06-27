import * as d from "./data";
import * as g from "./general";
import * as c from "./convert";

// guess work
export function inferThird (midiNote, quality, modifier) {
    if (modifier === d.SUS) {
        return midiNote + 5;
    }
    switch (quality) {
        case d.MIN:
        case d.DIM: return midiNote + 3;
        default   : return midiNote + 4;
    }
}
export function inferFifth (midiNote, quality) {
    switch (quality) {
        case d.AUG: return midiNote + 8;
        case d.DIM: return midiNote + 6;
        default   : return midiNote + 7;
    }
}
export function inferSixth (root, quality) {
    switch (quality) {
        case d.DOM:
        case d.DIM:
        case d.MAJ: return root + 9;
        case d.MIN: return root + 8;
        case d.AUG: return root + 10;
        default   : return root + 9;
    }
}
export function inferSeventh (root, quality, mod) {
    switch (quality) {
        case d.DOM:
        case d.MIN: return root + 10;
        case d.MAJ: return root + 11;
        case d.AUG: return root + 12;
        case d.DIM: return root + 9;
        default   : return root + 10; // default to dom
    }
}
export function inferExtension (root, quality, num, mod) {
    let res;
    switch (num) {
        case 9:
            res = root + 14;
            break;
        case 11:
            res = root + 17;
            break;
        case 13:
            res = inferSixth(root, quality, mod);
            break;
        default:
            throw new TypeError("invalid extension " + num + mod);
    }
    return res + c.string.toAccNumber(mod);
}
export function inferAccidental (root, quality) {
    if (quality) {
        return "#";
    } else {
        if (quality === d.MAJ || quality === d.MIN) {
            let accidentals = d.keys[quality][root.pitchName].accidental;
            return accidentals > -1 ? "#" : "b";
        } else {
            return quality === d.AUG ? "#" : "b";
        }
    }
}
