import { FlashcardsContent, Flashcard } from './models/flashcards-content';
import { H5pPackage } from './h5p-package';
import { H5pContentCreator } from './h5p-content-creator';
import { H5pImage } from './models/image';

export class H5pFlashcardsCreator extends H5pContentCreator<FlashcardsContent> {
  constructor(h5pPackage: H5pPackage, private data: { question: string, answer: string, image?: string, tip?: string }[]) {
    super(h5pPackage);
  }

  protected contentObjectFactory(): FlashcardsContent {
    return new FlashcardsContent();
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}.${extension}`;
  }

  protected async addContent(contentObject: FlashcardsContent): Promise<void> {
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

  protected addSettings(contentObject: FlashcardsContent) {
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