import { H5pAudio } from "./h5p-audio";
import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";
import { H5pMatchAudio } from "./h5p-match-audio";
import { H5pMatchImage } from "./h5p-match-image";

export class H5PMemoryGameContent extends H5pContent {
  public title: string;
  public memorygame: {
    image?: H5pImage;
    alt_text: string;
    audio?: H5pAudio;
    match?: H5pMatchImage;
    matchAlt?: string;
    matchAudio?: H5pMatchAudio;
    description?: string;
  }[];
  public behaviour: {
    useGrid?: boolean;
    allowRetry: boolean;
  };
}
