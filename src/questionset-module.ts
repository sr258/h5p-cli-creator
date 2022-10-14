import * as fs from "fs";
import * as papa from "papaparse";
import * as yargs from "yargs";
import * as path from "path";

import { QuestionSetCreator } from "./questionset-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for dialogcards.
 */
export class QuestionSetModule implements yargs.CommandModule {
  public command = "questionset <input> <output>";
  public describe =
    "Converts csv input to h5p question set content. The headings for the columns \
                     should be: front, back, [image] (image is the URL of an image to include)";
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
      .option("n", {
        describe: "name/title of the content",
        default: "Question set",
        type: "string",
      })
      .option("m", {
        describe: "question type",
        default: "H5P.MultiChoice",
        type: "string",
        choices: ["H5P.MultiChoice","H5P.DragQuestion", "H5P.Blanks", "H5P.MarkTheWords", "H5P.DragText", "H5P.TrueFalse", "H5P.Essay"]
      });

  public handler = async (argv) => {
    await this.runQuestionSet(
      argv.input,
      argv.output,
      argv.n,
      argv.e,
      argv.d,
      argv.l,
      argv.m
    );
  };

  private async runQuestionSet(
    csvfile: string,
    outputfile: string,
    title: string,
    encoding: BufferEncoding,
    delimiter: string,
    language: string,
    question: "H5P.MultiChoice"| "H5P.DragQuestion" | "H5P.Blanks" | "H5P.MarkTheWords"| "H5P.DragText" | "H5P.TrueFalse" | "H5P.Essay"
  ): Promise<void> {
    console.log("Creating module content type.");
    csvfile = csvfile.trim();
    outputfile = outputfile.trim();

    let csv = fs.readFileSync(csvfile, { encoding });
    let csvParsed = papa.parse(csv, {
      header: true,
      delimiter,
      skipEmptyLines: true,
    });
    let h5pPackage = await H5pPackage.createFromHub(
      "H5P.QuestionSet",
      language
    );
    let creator = new QuestionSetCreator(
      h5pPackage,
      csvParsed.data as any,
      question,
      path.dirname(csvfile)
    );
    await creator.create();
    creator.setTitle(title);
    creator.savePackage(outputfile);
  }
}
