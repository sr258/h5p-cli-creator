import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pFlashcardsContent  } from "./models/h5p-flashcards-content";
import { H5pImage } from "./models/h5p-image";

export class H5pFlashcardsCreator extends ContentCreator<H5pFlashcardsContent> {
  constructor(h5pPackage: H5pPackage,
              private data: Array<{ question: string, answer: string, image?: string, tip?: string }>) {
    super(h5pPackage);
  }

  /**
   * Sets the description displayed when showing the flashcards.
   * @param description
   */
  public setDescription(description: string) {
    this.content.description = description;
  }

  protected contentObjectFactory(): H5pFlashcardsContent {
    return new H5pFlashcardsContent();
  }

  protected async addContent(contentObject: H5pFlashcardsContent): Promise<void> {
    contentObject.cards = new Array();

    let imageCounter = 0;

    for (const line of this.data) {
      const card = {
        answer: line.answer,
        text: line.question,
      };
      if (line.image && line.image !== "") {
        try {
          let ret = await H5pImage.fromDownload(line.image);
          let filename = this.getFilenameForImage(imageCounter++, ret.extension);
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.image.path = filename;
          card["image"] = ret.image;
          console.log(`Downloaded image from ${line.image}. (${ret.buffer.byteLength} bytes)`);
        } catch (exc) {
          console.error(exc);
          card["image"] = undefined;
        }
      }
      if (line.tip && line.tip !== "") {
        card["tip"] = line.tip;
      }
      contentObject.cards.push(card);
    }
  }

  protected addSettings(contentObject: H5pFlashcardsContent) {
    contentObject.caseSensitive = false;
    contentObject.showSolutionsRequiresInput = true;
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}.${extension}`;
  }
}
