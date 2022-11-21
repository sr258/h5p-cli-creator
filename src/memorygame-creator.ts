import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pAudio } from "./models/h5p-audio";
import { H5PMemoryGameContent} from "./models/h5p-memory-game-content";
import { H5pImage } from "./models/h5p-image";
import { H5pMatchAudio } from "./models/h5p-match-audio";
import { H5pMatch} from "./models/h5p-match";

export class MemoryGameCreator extends ContentCreator<H5PMemoryGameContent> {
  constructor(
    h5pPackage: H5pPackage,
    private data: Array<{
      imageAlt: string;
      image?: string;
      audio?: string;
      match?: string;
      matchAlt?: string;
      matchAudio?: string;
      description?: string;
    }>,
    sourcePath: string
  ) {
    super(h5pPackage, sourcePath);
  }

  /**
   * Sets the description displayed when showing the memory game.
   * @param description
   */
  public setTitle(title: string) {
    this.h5pPackage.h5pMetadata.title = title;
    this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
  }

  protected contentObjectFactory(): H5PMemoryGameContent {
    return new H5PMemoryGameContent();
  }

  protected async addContent(
    contentObject: H5PMemoryGameContent
  ): Promise<void> {
    contentObject.cards = new Array();

    let imageCounter = 0;
    let audioCounter = 0;
    let matchCounter = 0;
    let matchAudioCounter = 0;

    for (const line of this.data) {
      const cards = {
        imageAlt: line.imageAlt,
        matchAlt: line.matchAlt,
        description: line.description,
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
          cards["image"] = ret.image;
          console.log(
            `Downloaded image from ${line.image}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          cards["image"] = undefined;
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
          cards["audio"] = [ret.audio];
          console.log(
            `Downloaded audio from ${line.audio}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          cards["audio"] = undefined;
        }
      }
      if (line.match) {
        try {
          let ret: { extension: string; buffer: Buffer; match: H5pMatch };
          if (
            !line.match.startsWith("http://") &&
            !line.match.startsWith("https://")
          ) {
            ret = await H5pMatch.fromLocalFile(
              path.join(this.sourcePath, line.match)
            );
          } else {
            ret = await H5pMatch.fromDownload(line.match);
          }
          let filename = this.getFilenameForMatch(
            matchCounter++,
            ret.extension
          );
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.match.path = filename;
          cards["match"] = ret.match;
          console.log(
            `Downloaded match from ${line.match}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          cards["match"] = undefined;
        }
      }
      if (line.matchAudio) {
        try {
          let ret: { extension: string; buffer: Buffer; matchAudio: H5pAudio };
          if (
            !line.audio.startsWith("http://") &&
            !line.audio.startsWith("https://")
          ) {
            ret = await H5pMatchAudio.fromLocalFile(
              path.join(this.sourcePath, line.matchAudio)
            );
          } else {
            ret = await H5pMatchAudio.fromDownload(line.matchAudio);
          }
          let filename = this.getFilenameForMatchAudio(
            matchAudioCounter++,
            ret.extension
          );
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.matchAudio.path = filename;
          cards["matchAudio"] = [ret.matchAudio];
          console.log(
            `Downloaded matchAudio from ${line.matchAudio}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          cards["matchAudio"] = undefined;
        }
      }
      contentObject.cards.push(cards);
    }
  }

  protected addSettings(contentObject: H5PMemoryGameContent) {
    contentObject.behaviour = {
      useGrid: true,
      allowRetry: true,
    };
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/image-${counter}${extension}`;
  }

  private getFilenameForAudio(counter: number, extension: string) {
    return `audios/audio-${counter}${extension}`;
  }

  private getFilenameForMatch(counter: number, extension: string) {
    return `images/match-${counter}${extension}`;
  }

  private getFilenameForMatchAudio(counter: number, extension: string) {
    return `audios/matchAudio-${counter}${extension}`;
  }
}
