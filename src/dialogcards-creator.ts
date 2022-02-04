import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pAudio } from "./models/h5p-audio";
import { H5PDialogCardsContent } from "./models/h5p-dialog-cards-content";
import { H5pImage } from "./models/h5p-image";

export class DialogCardsCreator extends ContentCreator<H5PDialogCardsContent> {
  constructor(
    h5pPackage: H5pPackage,
    private data: Array<{
      front: string;
      back: string;
      image?: string;
      audio?: string;
    }>,
    private mode: "repetition" | "normal",
    sourcePath: string
  ) {
    super(h5pPackage, sourcePath);
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
    let audioCounter = 0;

    for (const line of this.data) {
      const card = {
        text: line.front,
        answer: line.back,
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
      if (line.audio) {
        try {
          let ret: { extension: string; buffer: Buffer; audio: H5pAudio };
          if (
            !line.audio.startsWith("http://") &&
            !line.audio.startsWith("https://")
          ) {
            ret = await H5pAudio.fromLocalFile(
              path.join(this.sourcePath, line.audio)
            );
          } else {
            ret = await H5pAudio.fromDownload(line.audio);
          }
          let filename = this.getFilenameForAudio(
            audioCounter++,
            ret.extension
          );
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.audio.path = filename;
          card["audio"] = [ret.audio];
          console.log(
            `Downloaded audio from ${line.audio}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          card["audio"] = undefined;
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
      scaleTextNotCard: false,
    };
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}${extension}`;
  }

  private getFilenameForAudio(counter: number, extension: string) {
    return `audios/${counter}${extension}`;
  }
}
