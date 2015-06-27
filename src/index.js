import * as _ from "./util";
import {collection} from "./collection";

console.log(_.regex.noteString.exec("D9"));

var k = collection("D9");

k.each(function (n) {
    console.log(n.fullName);
});
