import { H5pAudio } from "./h5p-audio";
import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";
import {  } from "module";

export class H5PQuestionSetContent extends H5pContent {
  public title: string;
  public question: "H5P.MultiChoice"| "H5P.DragQuestion" | "H5P.Blanks" | "H5P.MarkTheWords"| "H5P.DragText" | "H5P.TrueFalse" | "H5P.Essay";
  public description: string;
  public questionset: {
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
    quickProgression?: boolean;
  };
}
