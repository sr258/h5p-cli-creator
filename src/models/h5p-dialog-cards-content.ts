import { H5pAudio } from "./h5p-audio";
import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";

export class H5PDialogCardsContent extends H5pContent {
  public title: string;
  public mode: "normal" | "repetition";
  public description: string;
  public dialogs: {
    audio?: H5pAudio;
    text: string;
    answer: string;
    image?: H5pImage;
    imageAltText?: string;
  }[];
  public behaviour: {
    enableRetry?: boolean;
    disableBackwardsNavigation?: boolean;
    scaleTextNotCard: boolean;
    randomCards: boolean;
    maxProficiency?: 3 | 4 | 5 | 6 | 7;
    quickProgression?: boolean;
  };
}
