import * as archy from 'archy';
import type * as dirTree from 'directory-tree';

import wrapHref from './wrapHref';
import wrapHtml from './wrapHtml';

export type Node = dirTree.DirectoryTree;

/**
 * Base printer class. Cannot be implemented directly.
 */
export abstract class AbstractPrinter {
    private dirTreeToArchyTree(node: Node): archy.Data {
        if (!node.children) {
            return { label: this.printNode(node) };
        }
        return {
            label: this.printNode(node),
            nodes: node.children.map(childNode => this.dirTreeToArchyTree(childNode)),
        };
    }

    print(node: Node): string {
        return archy(this.dirTreeToArchyTree(node))
    }

    abstract printNode(node: Node): string
}

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
export class PlainTextPrinter extends AbstractPrinter {
    printNode(node: Node): string {
        return node.name;
    }
}

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
export class HtmlPrinter extends AbstractPrinter {
    constructor(
        private readonly cwd: string,
        private readonly linkFolders: boolean,
    ) {
        super();
    }

    print(node: Node): string {
        const outTree = super.print(node);
        return wrapHtml(outTree, node.name);
    }

    printNode(node: Node): string {
        if (node.children) {
            // any node that has children is a "folder"
            return this.linkFolders ? wrapHref(node, this.cwd) : node.name;
        }
        return wrapHref(node, this.cwd);
    }
}
