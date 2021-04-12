import * as path from 'path';
import type * as dirTree from 'directory-tree';

export default function wrapHref(node: dirTree.DirectoryTree, cwd: string) {
    const relativePath = path.relative(cwd, node.path);
    return `<a href="./${relativePath}">${node.name}</a>`;
};
