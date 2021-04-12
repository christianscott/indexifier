import * as fs from 'fs';

import * as dirTree from 'directory-tree';

import { filterToMaxDepth, filterIncluded, filterEmptyDirectories } from './dirTreeFilters';
import { DirectoryInvalidError } from './exceptions';
import { AbstractPrinter, HtmlPrinter, PlainTextPrinter, Node } from './printers';

// Use nasty `module.exports` syntax for backawards compat. we could also use `export =`, but
// that doesn't work because it would prevent us from exporting the `Node` type.
module.exports = indexifier;
module.exports.AbstractPrinter = AbstractPrinter;

export type { Node }

type Opts = {
    /** The file types to print. Defaults to all file types. */
    fileTypes?: string[];
    /** Whether to produce HTML output. Defaults to false. */
    isHtml: boolean;
    /** Link folders when in HTML output mode. Defaults to true. */
    linkFolders: boolean;
    /** A regular expression matching files/directories to include. */
    include?: RegExp;
    /** A regular expression matching files/directories to exclude. */
    exclude?: RegExp;
    /** Include empty directories. Defaults to true. */
    emptyDirectories: boolean;
    /** Limit results to a maximum sub-directory depth. Defaults to no limit. */
    maxDepth: number;
    /** A printer instance which will convert the directory tree into a string */
    printer: AbstractPrinter;
};

type UserOpts = Partial<Opts>;

const defaultOpts = {
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
function indexifier(dir: string, opts: UserOpts): string {
    let stats: fs.Stats;
    try {
        stats = fs.statSync(dir);
    } catch(e) {
        throw new DirectoryInvalidError(`Given directory "${dir}" does not exist`);
    }
    if (!stats.isDirectory()) {
        throw new DirectoryInvalidError(`Given directory "${dir}" is not valid`);
    }
    const { include, exclude, fileTypes, printer, emptyDirectories, maxDepth } = normaliseOpts(dir, opts);

    const tree = dirTree(dir, {
        exclude: exclude
            ? new RegExp(exclude)
            : undefined,
        extensions: fileTypes && fileTypes.length
            ? new RegExp(`(?:${fileTypes.join('|').replace('.', '\\.')})$`)
            : undefined,
    });

    if (maxDepth !== Infinity) {
        filterToMaxDepth(tree, maxDepth);
    }
    if (include) {
        // Don't filter out the top level (cwd)
        tree.children = tree.children?.filter(child => filterIncluded(child, new RegExp(include)));
    }
    if (!emptyDirectories) {
        filterEmptyDirectories(tree);
    }

    return printer.print(tree);
}

function normaliseOpts(dir: string, userOpts: UserOpts): Opts {
    checkOpts(userOpts);

    const opts = { ...defaultOpts, ...userOpts };
    const printer = opts.printer ?? getPrinter(dir, opts);
    return { ...opts, printer }; // ts doesn't like opts.printer ??= getPrinter(dir, opts) for some reason
}

function checkOpts(opts: UserOpts) {
    if (opts && opts.printer && opts.isHtml) {
        throw new Error('cannot specify both the printer and isHtml options at the same time');
    }
    if (opts && opts.printer && opts.linkFolders) {
        throw new Error('cannot specify both the printer and linkFolders options at the same time');
    }
}

function getPrinter(dir: string, opts: Omit<Opts, 'printer'>): AbstractPrinter {
    return opts.isHtml ? new HtmlPrinter(dir, opts.linkFolders) : new PlainTextPrinter();
}
