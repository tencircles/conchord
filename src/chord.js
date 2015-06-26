import * as _ from "./util";
import * as d from "./data";
import {Note, make} from "./note";

const X = Symbol("private");

// Should return an interval or chord based on args
export function collection (...args) {
    if (args.length > 1) {
        if (args.every(_.is.stringOrNumber)) {
            return new Collection(args.map(make));
        } else if (args.every(isNote)) {
            return new Collection(args);
        } else {
            throw new TypeError(`cannot create collection from ${args}`);
        }
    } else if (args.length === 1) {
        let x = args[0];
        if (_.is.number(x) || _.is.noteString(x)) {
            return new Collection([new Note(x)]);
        } else if (_.is.array(x)) {
            return collection(...x);
        } else if (isNote(x)) {
            return new Collection([x]);
        } else if (_.is.chordString(x)) {
            return new Collection([]);
        } else {
            throw new TypeError(`Cannot create collection from ${args}`);
        }
    } else {
        return new Collection([]);
    }
}
export function toNotes (x) {
    x = "D4add9";
    let res = d.regex.chordString.exec(x);
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
    let length;
    accidental = accidental || "";
    quality    = _.normalizeQuality(quality);
    modifier   = _.normalizeChordModifier(modifier);

    if (octave) {
        console.log("had octave", octave);
        if (!quality) {
            console.log("had no quality");
            if (!ext1) {
                console.log("had no ext1");
                if (_.is.extensionNumber(octave)) {
                    console.log("octave is extension");
                    ext1   = octave;
                    octave = 0;
                    length = ext1 ? _.lengthFromExt1(ext1) : 3;
                } else {
                    console.log("octave is not extension");
                    if (modifier) {
                        console.log("had modifier");
                    } else {
                        console.log("had no modifier");
                    }
                }
            } else {
                console.log("had ext1", ext1);
                length = ext1 ? _.lengthFromExt1(ext1) : 3;
            }
        }
    }

    console.table([
        {match},
        {root},
        {accidental},
        {octave},
        {quality},
        {ext1},
        {modifier},
        {ext2},
        {ext3},
        {over},
        {n: length}
    ]);
    // let rootNote = new Note(root + accidental + octave);
}
function isNote (x) {
    return x instanceof Note;
}
export class Collection {
    constructor (notes) {
        this.members = notes;
    }
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
function inferAccidental (root, quality) {
    if (quality === "maj" || quality === "min") {
        let accidentals = d.keys[quality][root.pitchName].accidental;
        return accidentals > -1 ? "#" : "b";
    } else {
        return quality === "aug" ? "#" : "b";
    }
}

