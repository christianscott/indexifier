"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapHtml(content, title) {
    return "<!doctype html>\n<html>\n    <head>\n        <meta charset=\"UTF-8\">\n        <title>" + title + "</title>\n        <style>\n            * {\n                font-family: monospace;\n            }\n        </style>\n    </head>\n    <body>\n        <pre>\n" + content + "        </pre>\n    </body>\n</html>\n";
}
exports.default = wrapHtml;
//# sourceMappingURL=wrapHtml.js.map