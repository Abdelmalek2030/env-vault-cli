PREFIX ?= /usr/local
BINDIR ?= $(PREFIX)/bin
MANDIR ?= $(PREFIX)/share/man/man1

.PHONY: all check test fuzz bench install uninstall

all: check test

check:
	npm run lint

test:
	npm test

fuzz:
	npm run fuzz

bench:
	npm run bench

install:
	install -d $(DESTDIR)$(BINDIR)
	install -m 0755 index.js $(DESTDIR)$(BINDIR)/env-vault
	install -d $(DESTDIR)$(MANDIR)
	install -m 0644 man/env-vault.1 $(DESTDIR)$(MANDIR)/env-vault.1

uninstall:
	rm -f $(DESTDIR)$(BINDIR)/env-vault
	rm -f $(DESTDIR)$(MANDIR)/env-vault.1
