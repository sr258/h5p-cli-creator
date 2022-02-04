import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pFlashcardsContent } from "./models/h5p-flashcards-content";
import { H5pImage } from "./models/h5p-image";

export class FlashcardsCreator extends ContentCreator<H5pFlashcardsContent> {
  constructor(
    h5pPackage: H5pPackage,
    private data: Array<{
      question: string;
      answer: string;
      image?: string;
      tip?: string;
    }>,
    private description: string,
    private title: string,
    sourcePath: string
  ) {
    super(h5pPackage, sourcePath);
  }

  protected contentObjectFactory(): H5pFlashcardsContent {
    return new H5pFlashcardsContent();
  }

  protected async addContent(
    contentObject: H5pFlashcardsContent
  ): Promise<void> {
    contentObject.cards = new Array();

    let imageCounter = 0;

    for (const line of this.data) {
      const card = {
        answer: line.answer,
        text: line.question,
      };
      if (line.image) {
        try {
          let ret: { extension: string; buffer: Buffer; image: H5pImage };
          if (
            !line.image.startsWith("http://") &&
            !line.image.startsWith("https://")
          ) {
            ret = await H5pImage.fromLocalFile(
              path.join(this.sourcePath, line.image)
            );
          } else {
            ret = await H5pImage.fromDownload(line.image);
          }
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

      if (line.tip) {
        card["tip"] = line.tip;
      }
      contentObject.cards.push(card);
    }
  }

  protected addSettings(contentObject: H5pFlashcardsContent) {
    contentObject.caseSensitive = false;
    contentObject.showSolutionsRequiresInput = true;

    contentObject.description = this.description;
    this.h5pPackage.h5pMetadata.title = this.title;
    this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}${extension}`;
  }
}
