import { H5pContent } from "./h5p-content";

export class H5PFindTheWordsContent extends H5pContent {
  public taskDescription: string = "";
  public wordList: string;
  public behaviour: {
    orientations: {
      horizontal: boolean;
      horizontalBack: boolean;
      vertical: boolean;
      verticalUp: boolean;
      diagonal: boolean;
      diagonalBack: boolean;
      diagonalUp: boolean;
      diagonalUpBack: boolean;
    };
    fillPool: string;
    preferOverlap: boolean;
    showVocabulary: boolean;
    enableShowSolution: boolean;
    enableRetry: boolean;
  };
}
