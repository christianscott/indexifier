import type * as dirTree from 'directory-tree';
/**
 * Remove all tree nodes below a given depth.
 * Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
 * compared to filtering while building the dirTree in the first place.
 * To fix we would need to add this feature to directory-tree instead.
 * @param tree A directory tree
 * @param maxDepth Maximum depth of files/directories to include in tree
 */
export declare function filterToMaxDepth(tree: dirTree.DirectoryTree, maxDepth: number): void;
/**
* Remove files and directories from tree that don't match regexp.
* Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
* compared to filtering while building the dirTree in the first place.
* To fix we would need to add this feature to directory-tree instead.
* @param tree A directory tree
* @param regexp Regexp to match nodes against
*/
export declare function filterIncluded(tree: dirTree.DirectoryTree, regexp: RegExp): boolean;
/**
 * Remove empty directories from the given tree
 * @param tree A directory tree
 */
export declare function filterEmptyDirectories(tree: dirTree.DirectoryTree): dirTree.DirectoryTree[];
