export default function wrapHtml(content: string, title: string): string {
    return `<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
            * {
                font-family: monospace;
            }
        </style>
    </head>
    <body>
        <pre>
${content}        </pre>
    </body>
</html>
`;
}
