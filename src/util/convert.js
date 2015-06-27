import * as d from "./data";
import * as n from "./normalize";
import * as g from "./general";

var r = {
    extNumber: g.firstMatch(d.regex.extensionNumber),
    accidental: g.firstMatch(d.regex.accidental)
};
export var pitchClass = {
    toPitchName (index, acc = "#") {
        return d.pitchNameByClass[acc][index];
    }
};
export var pitchName = {
    toPitchClass: pitchName => d.pitchClassByName[pitchName]
};
export var midiNote = {
    toPitchClass: number => number % 12,
    toOctave: number => ~~(number / 12)
};
export var string = {
    toNumber: str => parseInt(str),
    toAccNumber: str => d.modifiers.accidental[str] || 0,
    toExt (str) {
        let match;
        str += "";
        match = r.extNumber(str);
        console.log("match", match);
        return parseInt(match) || undefined;
    },
    toExtMod (str) {
        let mod, qual;
        str += "";
        mod = r.accidental(str);
        qual = n.normalizeQuality(str);
        if (qual !== d.MAJ && qual !== d.MIN) {
            qual = "";
        }
        return qual || mod || "";
    }
};
