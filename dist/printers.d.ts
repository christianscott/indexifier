import type * as dirTree from 'directory-tree';
export declare type Node = dirTree.DirectoryTree;
/**
 * Base printer class. Cannot be implemented directly.
 */
export declare abstract class AbstractPrinter {
    private dirTreeToArchyTree;
    print(node: Node): string;
    abstract printNode(node: Node): string;
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
export declare class PlainTextPrinter extends AbstractPrinter {
    printNode(node: Node): string;
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
export declare class HtmlPrinter extends AbstractPrinter {
    private readonly cwd;
    private readonly linkFolders;
    constructor(cwd: string, linkFolders: boolean);
    print(node: Node): string;
    printNode(node: Node): string;
}
