#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { FindTheWordsModule } from "./findthewords-module";
import { DragAndDropModule } from './draganddrop-module';

try {
   yargs
      .command(new FlashcardsModule())
      .command(new DialogCardsModule())
      .command(new FindTheWordsModule())
      .command(new DragAndDropModule())
      .help().argv;
} catch (error) {
   console.error(error);
}
