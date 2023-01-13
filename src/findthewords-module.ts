import * as fs from "fs";
import * as papa from "papaparse";
import * as yargs from "yargs";
import * as path from "path";

import { FindTheWordsCreator } from "./findthewords-creator";

import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for findthewords.
 */
export class FindTheWordsModule implements yargs.CommandModule {
   public command = "findthewords <input> <output>";
   public describe =
      "Converts csv input to h5p find the words content. The headings for the column \
                     should be: words";
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
            describe: "title of the content",
            default: "Find the Words",
            type: "string",
         })
         .option("description", {
            describe: "description of the content",
            default: "Find the words from the grid",
            type: "string",
         });


   public handler = async (argv) => {
      await this.runFindTheWords(

         argv.input,
         argv.output,
         argv.n,
         argv.e,
         argv.d,
         argv.l,
         argv.description
      );
   };

   private async runFindTheWords(
      csvfile: string,
      outputfile: string,
      title: string,
      encoding: BufferEncoding,
      delimiter: string,
      language: string,
      description: string
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
         "H5P.FindTheWords",
         language
      );
      let findthewordscreator = new FindTheWordsCreator(
         h5pPackage,
         csvParsed.data as any,
         description,
         title,
         path.dirname(csvfile)
      );
      await findthewordscreator.create();
      findthewordscreator.savePackage(outputfile);
   }
}
