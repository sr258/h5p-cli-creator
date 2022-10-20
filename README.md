# h5p-cli-creator

This is a command line utility that allows you to mass create H5P content from input files using the command line. It is written in TypeScript and runs on NodeJS, meaning it's platform independent. Currently, it supports the *Flashcards* and *Dialog Cards* content type, but you can use the infrastructure provided here to add functionality for other content types. Pull requests are welcomed!

## Run
* Install [NodeJS](https://nodejs.org/)
* [clone this repository](https://help.github.com/articles/cloning-a-repository/) into a directory on your computer
* Execute these commands from the command line at the directory you've cloned into:
* `npm install` to install dependencies
* `npm run build` to transpile typescript to javascript
* `node ./dist/index.js --help` to get help
* `node ./dist/index.js flashcards --help` to get help for creating flashcards
* `node ./dist/index.js dialogcards --help` to get help for creating dialogcards
* `node ./dist/index.js questionset --help` to get help for creating questionset -- How to change question typ to multiple choice?
* `node ./dist/index.js memorygame --help` to get help for creating memorygame


## Example calls
`node ./dist/index.js flashcards ./tests/flash1.csv ./outputfile.h5p -l=de -t="Meine Karteikarten" --description="\"Schreibe die Übersetzungen in das Eingabefeld.\""`

Reads the file `flash1.csv` in the `tests` directory and outputs a h5p file with the filename `outputfile.h5p` in the current directory. The language strings will be set to German, the title 'Meine Karteikarten' and the description displayed when studying the flashcards will be 'Schreibe die Übersetzungen in das Eingabefeld.'

`node ./dist/index.js dialogcards ./tests/dialog1.csv ./outputfile.h5p -l=de -n="Meine Karteikarten" -m="repetition"`

Reads the file `dialog1.csv` in the `tests` directory and outputs a h5p file with the filename `outputfile.h5p` in the current directory. The language strings will be set to German and the title to 'Meine Karteikarten'.

dialogcardalttext.csv

node ./dist/index.js dialogcards ./tests/dialogcardalttext.csv ./dialogcards.h5p -l=de -n="Meine Karteikarten" -m="repetition"


`node ./dist/index.js questionset ./tests/questionset.csv ./questionset.h5p -l=de -t="Question set" --description="\"Question set description.\""`

Creates question set

`node ./dist/index.js memorygame ./tests/memorygame.csv ./memorygame.h5p -l=de -t="Memory Game" --description="\"Memory game description\""`

Creates memory game

## Coding conventions
All classes that exist in the actual H5P libraries or content types start with `H5p`, e.g. `H5pImage`. All classes that are part of the creator and don't exist in external libraries or content types don't start with this prefix.
