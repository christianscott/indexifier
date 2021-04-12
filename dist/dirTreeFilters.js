"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEmptyDirectories = exports.filterIncluded = exports.filterToMaxDepth = void 0;
/**
 * Remove all tree nodes below a given depth.
 * Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
 * compared to filtering while building the dirTree in the first place.
 * To fix we would need to add this feature to directory-tree instead.
 * @param tree A directory tree
 * @param maxDepth Maximum depth of files/directories to include in tree
 */
function filterToMaxDepth(tree, maxDepth) {
    if (tree.children && tree.children.length > 0) {
        if (maxDepth <= 0) {
            tree.children = [];
        }
        else {
            tree.children.forEach(function (child) {
                if (child.type === 'directory') {
                    filterToMaxDepth(child, maxDepth - 1);
                }
            });
        }
    }
}
exports.filterToMaxDepth = filterToMaxDepth;
/**
* Remove files and directories from tree that don't match regexp.
* Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
* compared to filtering while building the dirTree in the first place.
* To fix we would need to add this feature to directory-tree instead.
* @param tree A directory tree
* @param regexp Regexp to match nodes against
*/
function filterIncluded(tree, regexp) {
    if (!tree || !regexp.test(tree.name)) {
        return false;
    }
    if (tree.children && tree.children.length > 0) {
        tree.children = tree.children.filter(function (child) { return filterIncluded(child, regexp); });
    }
    return true;
}
exports.filterIncluded = filterIncluded;
/**
 * Remove empty directories from the given tree
 * @param tree A directory tree
 */
function filterEmptyDirectories(tree) {
    var _a, _b;
    if (tree.children && tree.children.length > 0) {
        tree.children.forEach(function (child) {
            if (child.type === 'directory') {
                child.children = filterEmptyDirectories(child);
            }
        });
    }
    return tree.children = (_b = (_a = tree.children) === null || _a === void 0 ? void 0 : _a.filter(isNotEmptyDirectory)) !== null && _b !== void 0 ? _b : [];
}
exports.filterEmptyDirectories = filterEmptyDirectories;
function isNotEmptyDirectory(tree) {
    return tree.type === 'file' || (tree.children != null && tree.children.length > 0);
}
//# sourceMappingURL=dirTreeFilters.js.map