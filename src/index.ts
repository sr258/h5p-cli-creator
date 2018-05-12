#!usr/bin/env node

import * as chalk from 'chalk';
import { H5pPackage } from './h5p-package';

const file = 'content.csv';

async function main(): Promise<void> {
  try {
    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards");
  }
  catch (error) {
    console.log(chalk.default.red(error));
    return;
  }
}

main();

