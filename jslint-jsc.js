/*
 * Copyright (c) 2011, Chris Johnsen <chris_johnsen@pobox.com>
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 
 *     1. Redistributions of source code must retain the above
 *        copyright notice, this list of conditions and the following
 *        disclaimer.
 * 
 *     2. Redistributions in binary form must reproduce the above
 *        copyright notice, this list of conditions and the following
 *        disclaimer in the documentation and/or other materials
 *        provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * jslint-jsc.js
 *
 * Usage: jsc jslint-jsc.js -- [JSLint/jslint.js JSLINT filename] <filename
 *
 * Use JavaScriptCore to run JSLINT (from JSLint/jslint.js) on the
 * text read from stdin. The first two parameters can be useful to
 * substitute jshint for JSLint.
 *
 * While the (optional) filename parameter is not used as a filename
 * (e.g. we never end up calling open(2) on it), it is included in
 * the output (so that the output for multipe files is distinct).
 *
 */

/*jslint plusplus: true */
/*jshint plusplus: false */
/*globals readline, load, print */

(function(global, args) {
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
        jsLintObjName = (args[1] || 'JSHINT'),
        pathname = (args[2] || '<stdin>'),
        JSHINT, i, err;
    load(jsLintPath);
    JSHINT = global[jsLintObjName];
    if (JSHINT(readStdin(), null)) {
        print(pathname + ': Passed ' + jsLintObjName);
    } else {
        for (i = 0; i < JSHINT.errors.length; i++) {
            err = JSHINT.errors[i];
            print(pathname + ':' + err.line + ' ' + err.reason);
        }
    }
}(this, arguments));
