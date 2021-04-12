"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var dirTree = require("directory-tree");
var dirTreeFilters_1 = require("./dirTreeFilters");
var exceptions_1 = require("./exceptions");
var printers_1 = require("./printers");
// Use nasty `module.exports` syntax for backawards compat. we could also use `export =`, but
// that doesn't work because it would prevent us from exporting the `Node` type.
module.exports = indexifier;
module.exports.AbstractPrinter = printers_1.AbstractPrinter;
var defaultOpts = {
    fileTypes: undefined,
    isHtml: false,
    linkFolders: true,
    include: undefined,
    exclude: undefined,
    emptyDirectories: true,
    maxDepth: Infinity,
};
/**
* Generates a directory tree from the given directory and all sub-directories
* @param dir The directory to use as the start (this will be the root node of the tree)
* @param opts An object which controls how the tool works
* @returns A unicode string containing a directory tree
*/
function indexifier(dir, opts) {
    var _a;
    var stats;
    try {
        stats = fs.statSync(dir);
    }
    catch (e) {
        throw new exceptions_1.DirectoryInvalidError("Given directory \"" + dir + "\" does not exist");
    }
    if (!stats.isDirectory()) {
        throw new exceptions_1.DirectoryInvalidError("Given directory \"" + dir + "\" is not valid");
    }
    var _b = normaliseOpts(dir, opts), include = _b.include, exclude = _b.exclude, fileTypes = _b.fileTypes, printer = _b.printer, emptyDirectories = _b.emptyDirectories, maxDepth = _b.maxDepth;
    var tree = dirTree(dir, {
        exclude: exclude
            ? new RegExp(exclude)
            : undefined,
        extensions: fileTypes && fileTypes.length
            ? new RegExp("(?:" + fileTypes.join('|').replace('.', '\\.') + ")$")
            : undefined,
    });
    if (maxDepth !== Infinity) {
        dirTreeFilters_1.filterToMaxDepth(tree, maxDepth);
    }
    if (include) {
        // Don't filter out the top level (cwd)
        tree.children = (_a = tree.children) === null || _a === void 0 ? void 0 : _a.filter(function (child) { return dirTreeFilters_1.filterIncluded(child, new RegExp(include)); });
    }
    if (!emptyDirectories) {
        dirTreeFilters_1.filterEmptyDirectories(tree);
    }
    return printer.print(tree);
}
function normaliseOpts(dir, userOpts) {
    var _a;
    checkOpts(userOpts);
    var opts = __assign(__assign({}, defaultOpts), userOpts);
    var printer = (_a = opts.printer) !== null && _a !== void 0 ? _a : getPrinter(dir, opts);
    return __assign(__assign({}, opts), { printer: printer }); // ts doesn't like opts.printer ??= getPrinter(dir, opts) for some reason
}
function checkOpts(opts) {
    if (opts && opts.printer && opts.isHtml) {
        throw new Error('cannot specify both the printer and isHtml options at the same time');
    }
    if (opts && opts.printer && opts.linkFolders) {
        throw new Error('cannot specify both the printer and linkFolders options at the same time');
    }
}
function getPrinter(dir, opts) {
    return opts.isHtml ? new printers_1.HtmlPrinter(dir, opts.linkFolders) : new printers_1.PlainTextPrinter();
}
//# sourceMappingURL=index.js.map