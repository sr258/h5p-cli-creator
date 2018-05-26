import * as fs from 'fs';
import * as papa from 'papaparse';
import * as yargs from 'yargs';

import { H5pFlashcardsContent, H5pFlashcard } from './models/h5p-flashcards-content';
import { H5pPackage } from './h5p-package';
import { H5pImage } from './models/h5p-image';
import { ContentCreator } from './content-creator';

class H5pFlashcardsCreator extends ContentCreator<H5pFlashcardsContent> {
  constructor(h5pPackage: H5pPackage, private data: { question: string, answer: string, image?: string, tip?: string }[]) {
    super(h5pPackage);
  }

  protected contentObjectFactory(): H5pFlashcardsContent {
    return new H5pFlashcardsContent();
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}.${extension}`;
  }

  protected async addContent(contentObject: H5pFlashcardsContent): Promise<void> {
    contentObject.cards = new Array();

    let imageCounter = 0;

    for (let line of this.data) {
      let card = {
        text: line.question,
        answer: line.answer
      };
      if (line.image && line.image !== '') {
        try {
          var ret = await H5pImage.fromDownload(line.image);
          var filename = this.getFilenameForImage(imageCounter++, ret.extension);
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.image.path = filename;
          card['image'] = ret.image;
          console.log(`Downloaded image from ${line.image}. (${ret.buffer.byteLength} bytes)`);
        }
        catch (exc) {
          console.error(exc);
          card['image'] = undefined;
        }
      }
      if (line.tip && line.tip !== '') {
        card['tip'] = line.tip;
      }
      contentObject.cards.push(card);
    }
  }

  protected addSettings(contentObject: H5pFlashcardsContent) {
    contentObject.caseSensitive = false;
    contentObject.showSolutionsRequiresInput = true;
  }

  /**
   * Sets the description displayed when showing the flashcards.
   * @param description 
   */
  public setDescription(description: string) {
    this.content.description = description;
  }
}

/**
 * This is the yargs module for flashcards.
 */
export class FlashcardsModule implements yargs.CommandModule {
  private async runFlashcards(csvfile: string, outputfile: string, description: string, encoding: string, delimiter: string, language: string): Promise<void> {
    console.log('Creating flashcards content type.');
    csvfile = csvfile.trim();
    outputfile = outputfile.trim();

    var csv = fs.readFileSync(csvfile, encoding);
    var csvParsed = papa.parse(csv, { header: true, delimiter: delimiter, skipEmptyLines: true });
    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", language);
    let flashcardsCreator = new H5pFlashcardsCreator(h5pPackage, csvParsed.data);
    flashcardsCreator.setDescription(description);
    await flashcardsCreator.create();
    flashcardsCreator.savePackage(outputfile);
  }

  command = 'flashcards <input> <output>';
  describe = 'Converts csv input to h5p flashcard content. The headings for the columns should be: question, answer, [tip], [image] (image is the URL of an image to include)';
  builder = (y: yargs.Argv) => y.positional('input', { describe: 'csv input file' })
    .positional('output', { describe: 'h5p output file including .h5p extension' })
    .option('l', { describe: 'language for translations in h5p content', default: 'en', type: 'string' })
    .option('d', { describe: 'CSV delimiter', default: ';', type: 'string' })
    .option('e', { describe: 'encoding', default: 'UTF-8', type: 'string' })
    .option('n', { describe: 'name/description of the content', default: 'Flashcards', type: 'string' });
  handler = async (argv) => { await this.runFlashcards(argv.input, argv.output, argv.n, argv.e, argv.d, argv.l) };
}