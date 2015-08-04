SRC_FILES = $(shell find src -name '*.js')
LIB_FILES = $(patsubst src/%.js, lib/%.js, $(SRC_FILES))

all: lib dist doc

clean:
	rm -r lib dist doc

doc: dist
	jsdoc -r -d ./doc ./dist/*.js
	@touch doc

lib: $(SRC_FILES)
	babel --out-dir=lib --source-maps=true --module=umdStrict --stage=0 src
	@touch lib

dist: lib $(LIB_FILES)
	@mkdir -p dist
	browserify lib/index.js -o dist/mr-angular-i18n.raw.js --standalone=MrAngularI18n --extension=js --debug \
		--exclude fd-angular-core \
		--exclude mr-util
	cat dist/mr-angular-i18n.raw.js | exorcist dist/mr-angular-i18n.js.map > dist/mr-angular-i18n.js
	rm dist/mr-angular-i18n.raw.js
	@touch dist

deploy: doc
	@bash ./script/deploy-docs.sh

.PHONEY: all clean deploy
