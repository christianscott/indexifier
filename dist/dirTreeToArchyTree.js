"use strict";
var wrapHref = require('./wrapHref');
module.exports = function dirTreeToArchyTree(node, cwd, isHtml, linkFolders) {
    if (!node.children) {
        return isHtml ? wrapHref(node, cwd) : node.name;
    }
    return {
        label: (isHtml && linkFolders) ? wrapHref(node, cwd) : node.name,
        nodes: node.children.map(function (subTree) { return dirTreeToArchyTree(subTree, cwd, isHtml, linkFolders); })
    };
};
//# sourceMappingURL=dirTreeToArchyTree.js.map