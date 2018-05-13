#!usr/bin/env node

import * as chalk from 'chalk';
import { H5pPackage } from './h5p-package';
import { H5pFlashcardsCreator } from './h5p-flashcards-creator';

const file = 'content.csv';

async function main(): Promise<void> {
  try {
    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", "de");    
    let flashcardsCreator = new H5pFlashcardsCreator(h5pPackage);
    flashcardsCreator.create();
    flashcardsCreator.savePackage('./test.h5p');
  }
  catch (error) {
    console.log(chalk.default.red(error));
    return;
  }
}

main();

