# === Makefile pre Vue 3 projekt ===
# Použitie: make dev, make build, make clean, make pack

# Cesty
SRC_DIR := src
SERVER_DIR := server/server.js server/stats.json server/questions.json server/questions2.json
DIST_DIR := dist
ARCHIVE := xmelchm00_xcholel00_source.zip

# Default target
.PHONY: help
help:
	@echo "Makefile commands:"
	@echo "  make dev      - spusti dev server"
	@echo "  make build    - vytvor build projektu"
	@echo "  make clean    - vymaž dist"
	@echo "  make pack     - zbali všetky súbory do tar.gz"

# Dev server
.PHONY: dev
dev:
	npm install
	npm run dev

# Build
.PHONY: build
build:
	npm install
	npm run build

# Clean
.PHONY: clean
clean:
	rm -rf $(DIST_DIR) $(ARCHIVE)

# Pack all files we know
.PHONY: pack
pack: clean
	zip -r $(ARCHIVE) \
		$(SRC_DIR) \
		$(SERVER_DIR)
	@echo "Projekt zbaleny do $(ARCHIVE)"
