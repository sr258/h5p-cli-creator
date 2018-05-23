#!usr/bin/env node

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as papa from 'papaparse';
import * as yargs from 'yargs';
import { H5pPackage } from './h5p-package';
import { H5pFlashcardsCreator } from './h5p-flashcards-creator';

async function runFlashcards(csvfile: string, outputfile: string, description: string, encoding: string, delimiter: string, language: string): Promise<void> {
  csvfile = csvfile.trim();
  outputfile = outputfile.trim();

  var csv = fs.readFileSync(csvfile, encoding);
  var csvParsed = papa.parse(csv, { header: true, delimiter: delimiter, skipEmptyLines: true });
  let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", language);
  let flashcardsCreator = new H5pFlashcardsCreator(h5pPackage, csvParsed.data);
  flashcardsCreator.setDescription(description);
  await flashcardsCreator.create();
  flashcardsCreator.savePackage(outputfile);
}

function main() {
  yargs
    .command('flashcards <input> <output>', 'convert csv input to h5p flashcard content',
      (y: yargs.Argv) => y.positional('input', { describe: 'csv input file'})
                          .positional('output', {describe: 'h5p output file'})
                          .option('l', { describe: 'language for translations in h5p content', default: 'en', type: 'string'})
                          .option('d', { describe: 'CSV delimiter', default: ';', type: 'string'})
                          .option('e', { describe: 'encoding', default: 'UTF-8', type: 'string'})
                          .option('n', { describe: 'name/description of the content', default: 'Flashcards', type: 'string'})
      ,async (argv) => { await runFlashcards(argv.input, argv.output, argv.n, argv.e, argv.d, argv.l) });
  yargs.parse();
}

try {
  main();
}
catch (error) {
  console.log(chalk.default.red(error));
}
