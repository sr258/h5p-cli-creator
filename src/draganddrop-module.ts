import * as fs from "fs";
import * as papa from "papaparse";
import * as yargs from "yargs";
import * as path from "path";

import { DragAndDropCreator } from "./draganddrop-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for draganddrop.
 */
export class DragAndDropModule implements yargs.CommandModule {
  public command = "draganddrop <input> <output>";
  public describe =
    "Converts csv input to h5p drag and drop content. The headings for the columns \
                     should be: label, correctDraggables, and tip(optional)";
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
        describe: "name/title of the content",
        default: "Drag and Drop",
        type: "string",
      });

  public handler = async (argv) => {
    await this.runDraganddrop(
      argv.input,
      argv.output,
      argv.t,
      argv.e,
      argv.d,
      argv.l,
    );
  };

  private async runDraganddrop(
    csvfile: string,
    outputfile: string,
    title: string,
    encoding: BufferEncoding,
    delimiter: string,
    language: string,
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
      "H5P.DragAndDrop",
      language
    );
    let creator = new DragAndDropCreator(
      h5pPackage,
      csvParsed.data as any,
      path.dirname(csvfile)
    );
    await creator.create();
    creator.setTitle(title);
    creator.savePackage(outputfile);
  }
}
