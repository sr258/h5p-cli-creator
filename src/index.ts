#!usr/bin/env node

import * as chalk from 'chalk';
import { H5pPackage } from './h5p-package';
import { createFlashCards } from './h5p-flashcards-creator';

const file = 'content.csv';

async function main(): Promise<void> {
  try {
    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", "de");    
    createFlashCards(h5pPackage);
  }
  catch (error) {
    console.log(chalk.default.red(error));
    return;
  }
}

main();

