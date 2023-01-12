#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { FindTheWordsModule } from "./findthewords-module";

try {
   yargs
      .command(new FlashcardsModule())
      .command(new DialogCardsModule())
      .command(new FindTheWordsModule())
      .help().argv;
} catch (error) {
   console.error(error);
}
