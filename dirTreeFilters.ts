import type * as dirTree from 'directory-tree';

/**
 * Remove all tree nodes below a given depth.
 * Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
 * compared to filtering while building the dirTree in the first place.
 * To fix we would need to add this feature to directory-tree instead.
 * @param tree A directory tree
 * @param maxDepth Maximum depth of files/directories to include in tree
 */
export function filterToMaxDepth(tree: dirTree.DirectoryTree, maxDepth: number): void {
  if (tree.children && tree.children.length > 0) {
      if (maxDepth <= 0) {
          tree.children = [];
      } else {
          tree.children.forEach(child => {
              if (child.type === 'directory') {
                  filterToMaxDepth(child, maxDepth - 1);
              }
          })
      }
  }
}

/**
* Remove files and directories from tree that don't match regexp.
* Note: This feature can be inefficient due to this filtering taking place on a complete directory tree,
* compared to filtering while building the dirTree in the first place.
* To fix we would need to add this feature to directory-tree instead.
* @param tree A directory tree
* @param regexp Regexp to match nodes against
*/
export function filterIncluded(tree: dirTree.DirectoryTree, regexp: RegExp): boolean {
  if (!tree || !regexp.test(tree.name)) {
      return false;
  }
  if (tree.children && tree.children.length > 0) {
      tree.children = tree.children.filter(child => filterIncluded(child, regexp));
  }
  return true;
}

/**
 * Remove empty directories from the given tree
 * @param tree A directory tree
 */
export function filterEmptyDirectories(tree: dirTree.DirectoryTree): dirTree.DirectoryTree[] {
  if (tree.children && tree.children.length > 0) {
      tree.children.forEach(child => {
          if (child.type === 'directory') {
              child.children = filterEmptyDirectories(child);
          }
      });
  }
  return tree.children = tree.children?.filter(isNotEmptyDirectory) ?? [];
}

function isNotEmptyDirectory(tree: dirTree.DirectoryTree): boolean {
    return tree.type === 'file' || (tree.children != null && tree.children.length > 0);
}
