import { FlashcardsContent, Flashcard } from './models/flashcards-content';
import { H5pPackage } from './h5p-package';
import { H5pContentCreator } from './h5p-content-creator';
import axios from 'axios';
import { extname } from 'path';
import { toBuffer } from './helpers';

export class H5pFlashcardsCreator extends H5pContentCreator<FlashcardsContent> {
  constructor(h5pPackage: H5pPackage, private data: { question: string, answer: string, image?: string, tip?: string }[]) {
    super(h5pPackage);
  }

  protected contentObjectFactory(): FlashcardsContent {
    return new FlashcardsContent();
  }

  private async downloadFile(url: string): Promise<ArrayBuffer> {
    var response = await axios.get(url, { "responseType": "arraybuffer" });
    if (response.status !== 200) {
      throw new Error(`Error: Could not download image at ${url}!`);
    }
    return response.data;
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}.${extension}`;
  }

  protected addContent(contentObject: FlashcardsContent) {
    contentObject.description = "my automatic description";
    contentObject.cards = new Array();

    let imageCounter = 0;

    for (let line of this.data) {
      let card = {
        text: line.question,
        answer: line.answer
      };
      /*if (line.image && line.image !== '') {
        try {
          var image = await this.downloadFile(line.image);
          var filename = this.getFilenameForImage(imageCounter++, extname(line.image));
          this.h5pPackage.addContentFile(filename, toBuffer(image));
          card['image'] = filename;  
        }
        catch (exc) { console.log(exc); }
      }*/
      if (line.tip && line.tip !== '') {
        card['tip'] = line.tip;
      }
      contentObject.cards.push(card);
    }
  }

  protected addSettings(contentObject: FlashcardsContent) {
    contentObject.caseSensitive = false;
    contentObject.showSolutionsRequiresInput = true;
  }
}