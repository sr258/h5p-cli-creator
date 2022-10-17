import { H5pImage } from "./h5p-image";
import { H5pAudio } from "./h5p-audio";
import { H5pMatchAudio } from "./h5p-match-audio";
import { H5pMatchImage } from "./h5p-match-image";

export class H5PMemoryGame {
  public image: H5pImage;
  public alt_text: string = "";
  public audio?: H5pAudio;
  public match?: H5pMatchImage;
  public matchAlt?: string = "";
  public matchAudio?: H5pMatchAudio;
}
