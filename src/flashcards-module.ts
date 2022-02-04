import * as fs from "fs";
import * as papa from "papaparse";
import * as path from "path";
import * as yargs from "yargs";

import { FlashcardsCreator } from "./flashcards-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for flashcards.
 */
export class FlashcardsModule implements yargs.CommandModule {
  public command = "flashcards <input> <output>";
  public describe =
    "Converts csv input to h5p flashcard content. The headings for the columns \
                     should be: question, answer, [tip], [image] (image is the URL of an image to include)";
  public builder = (y: yargs.Argv) =>
    y
      .positional("input", { describe: "csv input file" })
      .positional("output", {
        describe: "h5p output file including .h5p extension",
      })
      .option("l", {
        describe: "language for translations in h5p content",
        default: "en",
        type: "string",
      })
      .option("d", { describe: "CSV delimiter", default: ";", type: "string" })
      .option("e", { describe: "encoding", default: "UTF-8", type: "string" })
      .option("t", {
        describe: "title of the content",
        default: "Flashcards",
        type: "string",
      })
      .option("description", {
        describe: "description of the content",
        default: "Write in the answers to the questions.",
        type: "string",
      });

  public handler = async (argv) => {
    await this.runFlashcards(
      argv.input,
      argv.output,
      argv.t,
      argv.e,
      argv.d,
      argv.l,
      argv.description
    );
  };

  private async runFlashcards(
    csvfile: string,
    outputfile: string,
    title: string,
    encoding: BufferEncoding,
    delimiter: string,
    language: string,
    description: string
  ): Promise<void> {
    console.log("Creating flashcards content type.");
    csvfile = csvfile.trim();
    outputfile = outputfile.trim();

    let csv = fs.readFileSync(csvfile, encoding);
    let csvParsed = papa.parse(csv, {
      header: true,
      delimiter,
      skipEmptyLines: true,
    });
    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", language);
    let flashcardsCreator = new FlashcardsCreator(
      h5pPackage,
      csvParsed.data as any,
      description,
      title,
      path.dirname(csvfile)
    );
    await flashcardsCreator.create();
    flashcardsCreator.savePackage(outputfile);
  }
}
