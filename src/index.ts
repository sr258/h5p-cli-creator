#!usr/bin/env node

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as papa from 'papaparse';
import * as commander from 'commander';
import { H5pPackage } from './h5p-package';
import { H5pFlashcardsCreator } from './h5p-flashcards-creator';

async function runFlashcards(cmd: string, csvfile: string, outputfile: string, description: string) : Promise<void>  {  
  csvfile = csvfile.trim();
  outputfile = outputfile.trim();
  
  var csv = fs.readFileSync(csvfile, <string>commander.encoding);
  var csvParsed = papa.parse(csv, { header: true, delimiter: <string>commander.delimiter, skipEmptyLines: true });
  let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", <string>commander.language);    
  let flashcardsCreator = new H5pFlashcardsCreator(h5pPackage, csvParsed.data);
  flashcardsCreator.setDescription(description);
  await flashcardsCreator.create();
  flashcardsCreator.savePackage(outputfile);
}

async function main() {
  commander
  .version('0.1.0')
  .option('-l --language [language]', 'language for translations in h5p content', 'en')
  .option('-d --delimiter [delimiter]>', 'CSV delimiter', ';')
  .option('-e --encoding [encoding]', 'encoding', 'UTF-8')
  .command("flashcards <input.csv> <output.h5p>", "Generates flashcards in the H5P.Flashcards module. ")
  .option('-n --name <name>', 'name/description of the content', 'Flashcards')
  .option('-r, --reverse', 'switches front and back side')
  .option('-b, --bidirectional', 'creates two cards for each entry, one with reversed sides')
  .option('-H, --nohints', 'created flashcards don\'t have hints, even if they are in the source table')
  .option('-I, --noimages', 'created flashcards don\'t have images, even if the URLs are in the source table')
  .action(runFlashcards);
//  .parse(process.argv);
  await runFlashcards('flashcards', './tests/flash1.csv', './test.h5p', 'Flashcards');
  console.log('Finished creating package.');
}

try {
  main();
}
catch (error) {
  console.log(chalk.default.red(error));
}
