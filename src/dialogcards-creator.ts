import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5PDialogCardsContent } from "./models/h5p-dialog-cards-content";
import { H5pImage } from "./models/h5p-image";

export class DialogCardsCreator extends ContentCreator<H5PDialogCardsContent> {
  constructor(
    h5pPackage: H5pPackage,
    private data: Array<{
      front: string;
      back: string;
      image?: string;
    }>,
    private mode: "repetition" | "normal"
  ) {
    super(h5pPackage);
  }

  /**
   * Sets the description displayed when showing the flashcards.
   * @param description
   */
  public setTitle(title: string) {
    this.h5pPackage.h5pMetadata.title = title;
    this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
  }

  protected contentObjectFactory(): H5PDialogCardsContent {
    return new H5PDialogCardsContent();
  }

  protected async addContent(
    contentObject: H5PDialogCardsContent
  ): Promise<void> {
    contentObject.dialogs = new Array();

    let imageCounter = 0;

    for (const line of this.data) {
      const card = {
        text: line.front,
        answer: line.back
      };
      if (line.image) {
        try {
          let ret = await H5pImage.fromDownload(line.image);
          let filename = this.getFilenameForImage(
            imageCounter++,
            ret.extension
          );
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.image.path = filename;
          card["image"] = ret.image;
          console.log(
            `Downloaded image from ${line.image}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          card["image"] = undefined;
        }
      }
      contentObject.dialogs.push(card);
    }
    contentObject.mode = this.mode;
  }

  protected addSettings(contentObject: H5PDialogCardsContent) {
    contentObject.behaviour = {
      disableBackwardsNavigation: false,
      randomCards: true,
      scaleTextNotCard: false
    };
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}.${extension}`;
  }
}
