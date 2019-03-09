import * as death from "death";
import * as express from "express";
import * as fs from "fs-extra";
import * as papa from "papaparse";
import * as sanitize from "sanitize-filename";

import { FlashcardsCreator } from "./flashcards-creator";
import { H5pPackage } from "./h5p-package";

const ON_DEATH = death({ uncaughtException: true });

const port = 3000;
const workingDir = "working_directory";

let createDirectoryIfNecessary = async (dir) => {
  if (!(await fs.exists(dir))) {
    await fs.mkdir(dir);
  }
};

let createWorkingDirectories = async () => {
  await createDirectoryIfNecessary(workingDir);
};

ON_DEATH((signal, err) => {
  fs.removeSync(workingDir);
  process.exit();
});

(async () => {
  await fs.remove(workingDir);
  await createWorkingDirectories();
  let app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("src/static"));

  app.post("/csv2h5p", async (req, res) => {
    let h5p_csv = req.body.h5p_csv;
    let h5p_language = req.body.h5p_language;
    let h5p_csv_delimiter = req.body.h5p_csv_delimiter;
    let h5p_name = req.body.h5p_name;

    const outputfile = workingDir + "/" + sanitize(h5p_name) + ".h5p";

    let csvParsed = papa.parse(h5p_csv, { header: true, delimiter: h5p_csv_delimiter, skipEmptyLines: true });
    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", h5p_language);
    let flashcardsCreator = new FlashcardsCreator(h5pPackage, csvParsed.data);
    flashcardsCreator.setDescription(h5p_name);
    await flashcardsCreator.create();
    await flashcardsCreator.savePackage(outputfile);

    res.download(outputfile, async () => {
      await fs.remove(outputfile);
    });
  });

  app.listen(port, () => {
    console.log("listening on port " + port);
  });
})();
