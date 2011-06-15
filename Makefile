JSMIN = jsmin

VBB_MINJS = view-bookmarklets-bookmarklet.min.js
ALL_MINJS = $(VBB_MINJS)
ALL_HTML = view-bookmarklets-bookmarklet.html

OUTPUTS = $(ALL_HTML) $(ALL_MINJS)

all: $(ALL_HTML)

%.html: %.html.in $(ALL_MINJS)
	<$< >$@.tmp \
	    sed "s/@VBB_MINJS@/$$( \
		sed -e '/^$$/d' \
		    -e 's/\"/\&quot;/g' \
		    -e 's|\([&\/]\)|\\\1|g' \
		    -e '$$q' \
		    -e 's/$$/\\/' \
		    "$(VBB_MINJS)")/" && \
	mv "$@.tmp" "$@"

%.min.js: %.js
	<$< >$@.tmp \
	    $(JSMIN) && \
	mv "$@.tmp" "$@"

clean:
	rm -f $(OUTPUTS) $(patsubst %,%.tmp,$(OUTPUTS))
