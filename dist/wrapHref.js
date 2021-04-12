"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
function wrapHref(node, cwd) {
    var relativePath = path.relative(cwd, node.path);
    return "<a href=\"./" + relativePath + "\">" + node.name + "</a>";
}
exports.default = wrapHref;
;
//# sourceMappingURL=wrapHref.js.map