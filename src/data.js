const NOTE = "([a-gA-G](b|#)?)";
const OCT = "(\\d{1,2})?";
const QUAL  = "(major|minor|diminished|augmented|maj|min|dim|aug|M|m|°)?";
const SEV = "(6|7|9|11|13)?";
const EXT = "([#b]?(?:5|6|7|9|11|13))?";
const MOD = "(sus|add|min|maj)?";
const OVER = "(?:\\\/)?([a-gA-G][#b]?)?";
const NAT = "♮";

export const R_MAJ = /M(?!i)(?:aj(?:or)?)?|m(?:aj(?:or)?)/;
export const R_MIN = /M(?:in(?:or)?)|m(?!a)(?:in(?:or)?)?/;
export const R_AUG = /[Aa]ug(?:mented)?/;
export const R_DIM = /[Dd]im(?:inished)?/;
export const R_PER = /[Pp](?:erfect)?/;
export const R_ACC = /[#b]/;

export const N_MAJ   = "major";
export const N_MIN   = "minor";
export const N_AUG   = "augmented";
export const N_DIM   = "diminished";
export const N_PER   = "perfect";

export const MAJ   = 0;
export const MIN   = 1;
export const AUG   = 2;
export const DIM   = 3;

export var extension = new Set([6, 7, 9, 11, 13]);
export var perfect   = new Set([0, 5, 7, 12]);

export var intervalNames = [
    "unison",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "octave",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "uni",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "oct",
    "9th",
    "10th",
    "11th",
    "12th",
    "13th",
    "0",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13"
];
export var regex  = {
    chordString: new RegExp(`^${NOTE}${OCT}${QUAL}${SEV}${MOD}${EXT}${EXT}${OVER}`),
    noteString : new RegExp(`^${NOTE}${OCT}$`),
    interval   : new RegExp(intervalNames.join("|")),
    major      : R_MAJ,
    minor      : R_MIN,
    augmented  : R_AUG,
    diminished : R_DIM,
    perf       : R_PER,
    accidental : R_ACC,
    modifiers: {
        chord: {
            "add": /add/i,
            "sus": /sus/i,
            "maj": R_MAJ,
            "min": R_MIN
        }
    }
};
export var pitchNameByClass = {
    "#": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    "b": ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
};
export var pitchClassByName = {
    "C"  : 0,
    "C#" : 1,
    "Db" : 1,
    "D"  : 2,
    "D#" : 3,
    "Eb" : 3,
    "E"  : 4,
    "Fb" : 4,
    "F"  : 5,
    "F#" : 6,
    "Gb" : 6,
    "G"  : 7,
    "G#" : 8,
    "Ab" : 8,
    "A"  : 9,
    "A#" : 10,
    "Bb" : 10,
    "B"  : 11
};
export var interval = {
    long: {
        "unison"     : 0,
        "second"     : 2,
        "third"      : 4,
        "fourth"     : 5,
        "fifth"      : 7,
        "sixth"      : 9,
        "seventh"    : 11,
        "octave"     : 12,
        "ninth"      : 14,
        "tenth"      : 16,
        "eleventh"   : 17,
        "twelfth"    : 19,
        "thirteenth" : 21
    },
    med: {
        "uni"    : 0,
        "2nd"    : 2,
        "3rd"    : 4,
        "4th"    : 5,
        "5th"    : 7,
        "6th"    : 9,
        "7th"    : 11,
        "oct"    : 12,
        "9th"    : 14,
        "10th"   : 16,
        "11th"   : 17,
        "12th"   : 19,
        "13th"   : 21
    },
    short: {
        "0"  : 0,
        "2"  : 2,
        "3"  : 4,
        "4"  : 5,
        "5"  : 7,
        "6"  : 9,
        "7"  : 11,
        "8"  : 12,
        "9"  : 14,
        "10" : 16,
        "11" : 17,
        "12" : 19,
        "13" : 21
    }
};
export var modifiers = {
    interval: {
        "perfect": 0,
        "maj": 0,
        "min": -1,
        "aug": +1,
        "dim": -1
    },
    chord: {
        "maj": new Map(
            [
                ["root", 0],
                ["third", 4],
                ["fifth", 7]
            ]
        ),
        "min": new Map(
            [
                ["root", 0],
                ["third", 3],
                ["fifth", 7]
            ]
        ),
        "dim": new Map(
            [
                ["root", 0],
                ["third", 3],
                ["fifth", 6]
            ]
        ),
        "aug": new Map(
            [
                ["root", 0],
                ["third", 4],
                ["fifth", 8]
            ]
        )
    }
};
export var keys = {
    "major": {
        "Cb": {accidental: -7},
        "Gb": {accidental: -6},
        "Db": {accidental: -5},
        "Ab": {accidental: -4},
        "Eb": {accidental: -3},
        "Bb": {accidental: -2},
        "F": {accidental: -1},
        "C": {accidental: 0},
        "G": {accidental: 1},
        "D": {accidental: 2},
        "A": {accidental: 3},
        "E": {accidental: 4},
        "B": {accidental: 5},
        "F#": {accidental: 6},
        "C#": {accidental: 7}
    },
    "minor": {
        "Ab": {accidental: -7},
        "Eb": {accidental: -6},
        "Bb": {accidental: -5},
        "F": {accidental: -4},
        "C": {accidental: -3},
        "G": {accidental: -2},
        "D": {accidental: -1},
        "A": {accidental: 0},
        "E": {accidental: 1},
        "B": {accidental: 2},
        "F#": {accidental: 3},
        "C#": {accidental: 4},
        "G#": {accidental: 5},
        "D#": {accidental: 6},
        "A#": {accidental: 7}
    }
};
export var alias = {
    interval: {
        "unison": new Set(["unison", "uni", "0"]),
        "second": new Set(["second", "2nd", "2"]),
        "third": new Set(["third", "3rd", "3"]),
        "fourth": new Set(["fourth", "4th", "4"]),
        "fifth": new Set(["fifth", "5th", "5"]),
        "sixth": new Set(["sixth", "6th", "6"]),
        "seventh": new Set(["seventh", "7th", "7"]),
        "octave": new Set(["octave", "oct", "8"]),
        "ninth": new Set(["ninth", "9th", "9"]),
        "tenth": new Set(["tenth", "10th", "10"]),
        "eleventh": new Set(["eleventh", "11th", "11"]),
        "twelfth": new Set(["twelfth", "12th", "12"]),
        "thirteenth": new Set(["thirteenth", "13th", "13"])
    }
};
