#!usr/bin/env node

import * as yargs from "yargs";
import { FlashcardsModule } from "./flashcards-module";

try {
  yargs
    .command(new FlashcardsModule())
    .help()
    .parse();
} catch (error) {
  console.error(error);
}
