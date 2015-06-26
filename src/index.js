import * as _ from "./util";
import * as d from "./data";
import {Note} from "./note";
import {Chord, toNotes} from "./chord";

var x = toNotes("Dmaj6");


/*var maj  = ["Major", "major", "Maj", "maj", "M"];
var min  = ["Minor", "minor", "Min", "min", "m"];
var aug  = ["Augmented", "augmented", "Aug", "aug"];
var dim  = ["Diminished", "diminished", "Dim", "dim"];

console.table(dim.map(test));
console.table(aug.map(test));
console.table(maj.map(test));
console.table(min.map(test));

function test (x) {
    return [x, d.regex.diminished.test(x)];
}*/
