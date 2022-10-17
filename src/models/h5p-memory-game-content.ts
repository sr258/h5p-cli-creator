import { H5pAudio } from "./h5p-audio";
import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";
import {  } from "module";

export class H5PMemoryGameContent extends H5pContent {
  public title: string;
  public memorygame: {
    image: string;
    alt_text: string;
    audio?: string;
    match?: string;
    matchAlt?: string;
    matchAudio?: string;
  }[];
  public behaviour: {
    useGrid?: boolean;
    numCardsToUse?: number;
    allowRetry: boolean;
  };
}
