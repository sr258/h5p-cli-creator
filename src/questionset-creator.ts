import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pAudio } from "./models/h5p-audio";
import { H5PQuestionSetContent} from "./models/h5p-question-set-content";
import { H5pImage } from "./models/h5p-image";

export class QuestionSetCreator extends ContentCreator<H5PQuestionSetContent> {
  constructor(
    h5pPackage: H5pPackage,
    private data: Array<{
      question: "H5P.MultiChoice"| "H5P.DragQuestion" | "H5P.Blanks" | "H5P.MarkTheWords"| "H5P.DragText" | "H5P.TrueFalse" | "H5P.Essay"
      front: string;
      back: string;
      image?: string;
      audio?: string;
    }>,
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

  protected contentObjectFactory(): H5PQuestionSetContent {
    return new H5PQuestionSetContent();
  }

  protected async addContent(
    contentObject: H5PQuestionSetContent
  ): Promise<void> {
    contentObject.questionset = new Array();

    let imageCounter = 0;
    let audioCounter = 0;

    for (const line of this.data) {
      const card = {
        question: line.question,
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
      contentObject.questionset.push(card);
    }
  }

  protected addSettings(contentObject: H5PQuestionSetContent) {
    contentObject.behaviour = {
      enableRetry: true,
      disableBackwardsNavigation: false,
    };
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/${counter}${extension}`;
  }

  private getFilenameForAudio(counter: number, extension: string) {
    return `audios/${counter}${extension}`;
  }
}
