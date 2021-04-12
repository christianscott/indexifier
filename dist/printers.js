"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlPrinter = exports.PlainTextPrinter = exports.AbstractPrinter = void 0;
var archy = require("archy");
var wrapHref_1 = require("./wrapHref");
var wrapHtml_1 = require("./wrapHtml");
/**
 * Base printer class. Cannot be implemented directly.
 */
var AbstractPrinter = /** @class */ (function () {
    function AbstractPrinter() {
    }
    AbstractPrinter.prototype.dirTreeToArchyTree = function (node) {
        var _this = this;
        if (!node.children) {
            return { label: this.printNode(node) };
        }
        return {
            label: this.printNode(node),
            nodes: node.children.map(function (childNode) { return _this.dirTreeToArchyTree(childNode); }),
        };
    };
    AbstractPrinter.prototype.print = function (node) {
        return archy(this.dirTreeToArchyTree(node));
    };
    return AbstractPrinter;
}());
exports.AbstractPrinter = AbstractPrinter;
/**
 * Prints the tree as simply as possible
 *
 * Example:
 * ```
 *   ├─┬ A
 *   │ └── c.html
 *   ├── a.html
 *   ├── a.txt
 *   └── b.html
 * ```
 */
var PlainTextPrinter = /** @class */ (function (_super) {
    __extends(PlainTextPrinter, _super);
    function PlainTextPrinter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlainTextPrinter.prototype.printNode = function (node) {
        return node.name;
    };
    return PlainTextPrinter;
}(AbstractPrinter));
exports.PlainTextPrinter = PlainTextPrinter;
/**
 * Prints the tree as an HTML document, with the tree printed
 * inside a <pre> element.
 *
 * Example (simplified):
 * ```
 *   <!doctype html>
 *   <html>
 *       <body>
 *           <pre>
 *   <a href=\\"./\\">1</a>
 *   ├─┬ <a href=\\"./A\\">A</a>
 *   │ └── <a href=\\"./A/c.html\\">c.html</a>
 *   ├── <a href=\\"./a.html\\">a.html</a>
 *   ├── <a href=\\"./a.txt\\">a.txt</a>
 *   └── <a href=\\"./b.html\\">b.html</a>
 *           </pre>
 *       </body>
 *   </html>
 * ```
 */
var HtmlPrinter = /** @class */ (function (_super) {
    __extends(HtmlPrinter, _super);
    function HtmlPrinter(cwd, linkFolders) {
        var _this = _super.call(this) || this;
        _this.cwd = cwd;
        _this.linkFolders = linkFolders;
        return _this;
    }
    HtmlPrinter.prototype.print = function (node) {
        var outTree = _super.prototype.print.call(this, node);
        return wrapHtml_1.default(outTree, node.name);
    };
    HtmlPrinter.prototype.printNode = function (node) {
        if (node.children) {
            // any node that has children is a "folder"
            return this.linkFolders ? wrapHref_1.default(node, this.cwd) : node.name;
        }
        return wrapHref_1.default(node, this.cwd);
    };
    return HtmlPrinter;
}(AbstractPrinter));
exports.HtmlPrinter = HtmlPrinter;
//# sourceMappingURL=printers.js.map