import * as _ from "./util";
import {Note} from "./note";

const X = Symbol("private");

export class Collection {
    constructor (notes) {
        this.members = notes;
    }
    each (f) {
        this.members.forEach(f);
    }
}

// Should return an interval or chord based on args
export function collection (...args) {
    if (args.length > 1) {
        if (args.every(_.is.stringOrNumber)) {
            return new Collection(args.map(makeNote));
        } else if (args.every(isNote)) {
            return new Collection(args);
        } else {
            throw new TypeError(`cannot create collection from ${args}`);
        }
    } else if (args.length === 1) {
        let x = args[0];
        if (_.is.number(x) || isNoteString(x)) {
            return new Collection([new Note(x)]);
        } else if (_.is.array(x)) {
            return collection(...x);
        } else if (isNote(x)) {
            return new Collection([x]);
        } else if (_.is.chordString(x)) {
            return new Collection(toNotes(x));
        } else {
            throw new TypeError(`Cannot create collection from ${args}`);
        }
    } else {
        return new Collection([]);
    }
}
export function toNotes (x) {
    let res = _.regex.chordString.exec(x);
    let [
        match,
        root,
        accidental,
        octave,
        quality,
        ext1,
        modifier,
        ext2,
        ext3,
        over
    ] = res;
    console.log("matched", match);

    accidental = _.normalizeAccidental(accidental);
    console.log("accidental is", accidental || "none");

    octave     = parseInt(octave) || 0;
    console.log("octave is", octave);

    modifier   = _.normalizeChordModifier(modifier);
    console.log("modifier is", modifier);

    if (octaveIsExt1(quality, ext1, octave)) {
        console.log("octaveIsExt1");
        ext1 = octave + "";
        octave = 0;
    }

    quality    = _.normalizeQuality(quality);
    console.log("quality is", quality);

    let ext1Digit = _.string.toExt(ext1);
    let ext2Digit = _.string.toExt(ext2);
    let ext3Digit = _.string.toExt(ext3);
    let ext2Mod   = _.string.toExtMod(ext2);
    let ext3Mod   = _.string.toExtMod(ext3);

    let members  = [];
    let rootNote = new Note(root + octave);
    let chordAcc = _.inferAccidental(root, quality);
    let third    = _.inferThird(rootNote.midiNote, quality, modifier);
    let fifth    = _.inferFifth(rootNote.midiNote, quality);
    let seventh;
    let ninth;
    let eleventh;
    let thirteenth;
    let mnote = rootNote.midiNote;
    if (ext1) {
        console.log("had ext1", ext1, ext1Digit);
        if (ext1Digit === 6) {
            seventh = _.inferSixth(mnote, quality);
        }
        if (ext1Digit > 6) {
            seventh = _.inferSeventh(mnote, quality);
            console.log("inferSeventh", seventh);
        }
        if (ext1Digit === 9) {
            ninth   = _.inferExtension(mnote, quality, ext1Digit);
        }
        if (ext1Digit === 11) {
            eleventh   = _.inferExtension(mnote, quality, ext1Digit);
        }
        if (ext1Digit === 13) {
            thirteenth   = _.inferExtension(mnote, quality, ext1Digit);
        }
    }
    if (ext2) {
        if (ext2Digit === 9) {
            ninth   = _.inferExtension(mnote, quality, ext2Digit, ext2Mod);
        }
        if (ext2Digit === 11) {
            eleventh   = _.inferExtension(mnote, quality, ext2Digit, ext2Mod);
        }
        if (ext2Digit === 13) {
            thirteenth   = _.inferExtension(mnote, quality, ext2Digit, ext2Mod);
        }
    }
    if (ext3) {
        if (ext3Digit === 9) {
            ninth   = _.inferExtension(mnote, quality, ext3Digit, ext3Mod);
        }
        if (ext3Digit === 11) {
            eleventh   = _.inferExtension(mnote, quality, ext3Digit, ext3Mod);
        }
        if (ext3Digit === 13) {
            thirteenth   = _.inferExtension(mnote, quality, ext3Digit, ext3Mod);
        }
    }

    let thirdNote  = new Note(third, chordAcc);
    let fifthNote  = new Note(fifth, chordAcc);
    let seventhNote;
    let ninthNote;
    let eleventhNote;
    let thirteenthNote;

    members.push(rootNote, thirdNote, fifthNote);

    if (seventh) {
        seventhNote = new Note(seventh, chordAcc);
        members.push(seventhNote);
    }
    if (ninth) {
        ninthNote = new Note(ninth, chordAcc);
        members.push(ninthNote);
    }
    if (eleventh) {
        eleventhNote = new Note(eleventh, chordAcc);
        members.push(eleventhNote);
    }
    if (thirteenth) {
        thirteenthNote = new Note(thirteenth, chordAcc);
        members.push(thirteenthNote);
    }
    console.table([
        {
            "root": rootNote.fullName,
            "third": thirdNote.fullName,
            "fifth": fifthNote.fullName,
            "seventh": seventhNote ? seventhNote.fullName : "none",
            "ninth": ninthNote ? ninthNote.fullName : "none",
            "eleventh": eleventhNote ? eleventhNote.fullName : "none",
            "thirteenth": thirteenthNote ? thirteenthNote.fullName : "none"
        }
    ]);
    return members;
}
function octaveIsExt1 (quality, ext1, octave) {
    return !quality && !ext1 &&
        octave === 7  || octave === 9 ||
        octave === 11 || octave === 13;
}
function isNote (x) {
    return x instanceof Note;
}
function isNoteString (x) {
    let res = _.regex.noteString.exec(x);
    return !!res && !_.is.extensionNumber(res[3]);
}
function getRoot (desc) {
    if (typeof desc === "string") {
        return new Note(desc);
    } else if (+desc === +desc) {
        return new Note(desc);
    } else {
        throw new Error(`Invalid triad description ${desc}`);
    }
}
function makeNote (n, acc) {
    return new Note(n, acc);
}

