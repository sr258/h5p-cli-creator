#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { QuestionSetModule } from "./questionset-module"
import { MemoryGameModule} from "./memorygame-module";

try {
  yargs
    .command(new FlashcardsModule())
    .command(new DialogCardsModule())
    .command(new QuestionSetModule())
    .command(new MemoryGameModule())
    .help().argv;
} catch (error) {
  console.error(error);
}
