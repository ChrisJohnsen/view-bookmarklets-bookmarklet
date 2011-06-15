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

gh-pages:
	git clone --shared --branch gh-pages . gh-pages

dirty-check-ghp: gh-pages
	@assert_not_dirty() { \
		cd "$$1"; \
		pf="$${1+($$1)}"; \
		git update-index -q --refresh; \
		git diff-files --quiet || \
		    { echo "$$pf"'Working tree is dirty.'; return 1; }; \
		git diff-index --quiet --cached HEAD || \
		    { echo "$$pf"'Index is dirty.'; return 1; }; \
		return 0; \
	}; \
	assert_not_dirty && assert_not_dirty gh-pages

update-ghp: dirty-check-ghp $(ALL_HTML)
	rev=$$(git rev-parse HEAD) && \
	set -- $^ && shift && \
	cp "$$@" gh-pages && \
	cd gh-pages && \
	git add --update && \
	git commit -m 'generated by '"$$rev" && \
	git push
