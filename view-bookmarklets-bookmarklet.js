/*
 * view-bookmarklets-bookmarklet.js
 *
 * Define a single function: enableBookmarkletViewing()
 *
 * When run, it adds some hidden elements to the document and adds
 * 'click' event listeners to existing anchors with hrefs that start
 * with 'javascript:' (i.e. bookmarklets). The click event listener
 * extracts the JavaScript source from the anchor's href and
 * displays it by adjusting and revealing the elements that were
 * initially added to the document. The display temporarily overlays
 * the original view and has a link to disable the display
 * functionality (remove the click event handlers) and re-hide the
 * overlayed elements.
 *
 */

/*jslint browser: true, vars: true, plusplus: true, 'continue': true */
/*jshint plusplus: false */
/*globals unescape, enableBookmarkletViewing: true */

enableBookmarkletViewing = (function() {
    'use strict';

    function forEachJavaScriptAnchor(func) {
        var i, anchorList = document.getElementsByTagName('a');
        for(i = 0; i < anchorList.length; i++) {
            if (anchorList[i].href.search(/^javascript:/) !== -1) {
                func(anchorList[i]);
            }
        }
    }

    var displayTextarea;

    var displayBookmarkletSource =
        document.getElementById('vbb_textarea') ?
        document.getElementById('vbb_textarea').vbb_dbs :
        (function() {
        var style, overlay = document.createElement('div');
        style = overlay.style;
        style.font = '12px sans-serif';
        style.position = 'fixed';
        style.top = style.bottom = style.right = style.left = '0';
        style.background = '#bbb';
        style.color = '#000';
        style.display = 'none';
        function showOverlay(e) {
            e.stopPropagation();
            e.preventDefault();
            overlay.style.display = 'block';
        }
        function hideOverlay(e) {
            e.stopPropagation();
            e.preventDefault();
            overlay.style.display = 'none';
        }
        overlay.addEventListener('click', hideOverlay, false);

        var container = document.createElement('div');
        style = container.style;
        style.background = '#eee';
        style.margin = '50px';
        style.border = '5px solid #999';
        style['border-radius'] = '5px';
        style.padding = '1em';
        container.addEventListener('click',
                function(e) { e.stopPropagation(); },
                false);

        var instructionContainer = document.createElement('div');
        instructionContainer.style['font-size'] = '20px';

        var disableContainer = document.createElement('div');
        var disableLink = document.createElement('a');
        disableLink.textContent =
            'Tap or click here to disable bookmarklet viewing.';
        function disableViewing(e) {
            forEachJavaScriptAnchor(function(a) {
                a.removeEventListener('click',
                    displayBookmarkletSource, false);
            });
            hideOverlay(e);
        }
        disableLink.addEventListener('click', disableViewing, false);
        disableLink.href = '#';

        var returnText = document.createElement('div');
        returnText.style['margin-bottom'] = '5px';
        returnText.textContent =
            'Tap or click outside to return to page.';

        var displayTextarea = document.createElement('textarea');
        style = displayTextarea.style;
        style.width = '100%';
        style.height = '70%';
        displayTextarea.id = 'vbb_textarea';
        displayTextarea.vbb_dbs = function(e) {
            displayTextarea.value = unescape(this.href);
            showOverlay(e);
            displayTextarea.select();
        };

        disableContainer.insertBefore(disableLink, null);
        instructionContainer.insertBefore(disableContainer, null);
        instructionContainer.insertBefore(returnText, null);
        container.insertBefore(instructionContainer, null);
        container.insertBefore(displayTextarea, null);
        overlay.insertBefore(container, null);
        document.getElementsByTagName('body')[0].
            insertBefore(overlay, null);
        return displayTextarea.vbb_dbs;
    }());

    return function() {
        forEachJavaScriptAnchor(function(a) {
            a.addEventListener('click', displayBookmarkletSource, false);
        });
    };
}());
