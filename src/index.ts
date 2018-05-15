#!usr/bin/env node

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as papa from 'papaparse';
import { H5pPackage } from './h5p-package';
import { H5pFlashcardsCreator } from './h5p-flashcards-creator';

const file = './tests/flash1.csv';
const fileDelimiter = ";";
const fileEncoding = "UTF-8";
const language = 'de';

async function main(): Promise<void> {
  try {
    var csv = fs.readFileSync(file, fileEncoding);
    var csvParsed = papa.parse(csv, { header: true, delimiter: fileDelimiter, skipEmptyLines: true });

    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", language);    
    let flashcardsCreator = new H5pFlashcardsCreator(h5pPackage, csvParsed.data);
    flashcardsCreator.create();
    flashcardsCreator.savePackage('./test.h5p');
  }
  catch (error) {
    console.log(chalk.default.red(error));
    return;
  }
}

main();

