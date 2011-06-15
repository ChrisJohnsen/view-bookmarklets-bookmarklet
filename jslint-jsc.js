/*
 * jslint-jsc.js
 *
 * Use JavaScriptCore to run JSLINT (from JSLint/jslint.js) on the
 * text read from stdin.
 *
 * /path/to/jsc /path/to/jslint-jsc.js -- [filename] <filename
 *
 * While the (optional) filename parameter is not used as a filename
 * (e.g. we never end up calling open(2) on it), it is included in
 * the output (so that the output for multipe files is distinct).
 *
 */

/*jslint plusplus: true */
/*globals readline, load, JSLINT, print */

(function(args) {
    'use strict';

    /*
     * readStdin()
     *
     * Read all lines from stdin using readline().
     *
     * Returns an array of strings (one per line; each without the
     * trailing line break character).
     *
     * readline() returns '' for both empty lines and EOF, so we
     * assume we are at EOF if we have seen a certain number of
     * empty lines. This will be incorrect if the input actually has
     * enough empty lines, so we use a very large number.
     *
     */
    function readStdin() {
        var lines = [], numEmpty = 0, assumeEofAfter = 10000, line;
        while (numEmpty < assumeEofAfter) {
            line = readline();
            if (line === null) { break; }
            if (line === '') {
                numEmpty++;
            } else {
                while (numEmpty--) { lines.push(''); }
                numEmpty = 0;
                lines.push(line);
            }
        }
        return lines;
    }

    var jsLintPath = (args[0] || 'JSLint/jslint.js'),
        pathname = (args[1] || '<stdin>'),
        i, err;
    load(jsLintPath);
    if (JSLINT(readStdin(), null)) {
        print(pathname + ': Passed JSLint');
    } else {
        for (i = 0; i < JSLINT.errors.length; i++) {
            err = JSLINT.errors[i];
            print(pathname + ':' + err.line + ' ' + err.reason);
        }
    }
}(arguments));
