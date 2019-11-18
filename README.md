# h5p-cli-creator

This is a command line utility that allows you to mass create H5P content from input files using the command line. It is written in TypeScript and runs on NodeJS, meaning it's platform independent. Currently, only the *Flashcards* content type is supported, but you can use the infrastructure provided here to add functionality for other content types. Pull requests are welcomed!

**Warning: This project is work-in-progress. Expect changes.**

## Run
* install [NodeJS](https://nodejs.org/)
* [clone this repository](https://help.github.com/articles/cloning-a-repository/) into a directory on your computer
* execute these commands from the command line at the directory you've cloned into:
* `npm install` to install dependencies
* `npm run build` to transpile typescript to javascript
* `node ./dist/index.js` to execute program
* `node ./dist/index.js --help` to get help
* `node ./dist/index.js flashcards --help` to get help for creating flashcards

## Example calls
`node ./dist/index.js flashcards ./myflashcards.csv ./outputfile.h5p -l=de -n="Meine Karteikarten"`

Reads the file `myflashcards.csv` in the current directory and outputs a h5p file with the filename `outputfile.h5p` in the current directory. The language strings will be set to German and the description displayed when studying the flashcards will be 'Meine Karteikarten'.

`node ./dist/index.js dialogcards ./tests/dialog1.csv ./outputfile.h5p -l=de -n="Meine Karteikarten" -m="repetition"`

## Coding conventions
All classes that exist in the actual H5P libraries or content types start with `H5p`, e.g. `H5pImage`. All classes that are part of the creator and don't exist in external libraries or content types don't start with this prefix.
