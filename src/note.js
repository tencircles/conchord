import * as _ from "./util";

const MALFORMED_ERR = "Malformed note string ";
const RANGE_ERR     = "Note is out of 0-127 midi range";
const TYPE_ERR      = "Note must be a number or note string";
const X             = Symbol("private");

export class Note {
    constructor (n, acc) {
        if (!(this instanceof Note)) {
            return new Note(n, acc);
        }
        //console.log("new note from", n, acc);
        if (typeof n === "string") {
            // is string representation
            if (_.is.noteString(n)) {
                this[X] = noteFromString(n);
            } else {
                throw new TypeError(MALFORMED_ERR + n);
            }
        } else if (+n === +n) {
            // is midi number representation
            if (n > -1 && n < 128) {
                this[X] = noteFromNumber(n, acc);
            } else {
                throw new RangeError(RANGE_ERR);
            }
        } else {
            throw new TypeError(TYPE_ERR);
        }
    }
    transpose (by) {
        if (typeof by === "string") {
            if (_.is.interval(by)) {
                return transposeByInterval(this, by);
            } else if (!isNaN(parseInt(by))) {
                return new Note(this.midiNote + by);
            }
        } else if (+by === +by) {
            return new Note(this.midiNote + by);
        }
        throw new Error(`Can't transpose by ${by}`);
    }
    get midiNote () {
        return this[X].get("midiNote");
    }
    get octave () {
        return this[X].octave;
    }
    get fullName () {
        return this[X].get("fullName");
    }
    get pitchName () {
        return this[X].get("pitchName");
    }
    get pitchClass () {
        return this[X].get("pitchClass");
    }
    get accidental () {
        return this[X].get("accidental");
    }
}
function noteFromString (string) {
    let map   = new Map();
    let match = _.regex.noteString.exec(_.capitalize(string));
    let [
        fullName,
        pitchName,
        accidental,
        octave
    ] = match;

    octave = ~~octave;
    accidental = _.normalizeAccidental(accidental);

    let pitchClass = _.pitchName.toPitchClass(pitchName);
    let number     = octave * 12 + pitchClass;

    map.set("midiNote"  , number);
    map.set("octave"    , octave);
    map.set("fullName"  , fullName);
    map.set("pitchName" , pitchName);
    map.set("pitchClass", pitchClass);
    map.set("accidental", accidental);

    return map;
}
function noteFromNumber (number, acc) {
    acc = _.normalizeAccidental(acc) || "#";
    let map        = new Map();
    let midiNote   = number;
    let accidental = acc || "";
    let octave     = _.midiNote.toOctave(number);
    let pitchClass = _.midiNote.toPitchClass(number);
    let pitchName  = _.pitchClass.toPitchName(pitchClass, acc);
    let fullName   = pitchName + octave;

    map.set("midiNote"  , number);
    map.set("octave"    , octave);
    map.set("fullName"  , fullName);
    map.set("pitchName" , pitchName);
    map.set("pitchClass", pitchClass);
    map.set("accidental", accidental);

    return map;
}
function transposeByInterval (note, interval) {
    let n = _.intervalStringToNumber(interval);
    let acc = _.isPerfect(n) ? "#" : "b";
    return new Note(note.midiNote + n, acc);
}
