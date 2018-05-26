import { H5pContent } from "./h5p-content";
import { H5pFlashcard } from "./h5p-flashcard";
import { H5pImage } from "./h5p-image";

export class H5pFlashcardsContent extends H5pContent {
  public description: string = "";
  public cards: H5pFlashcard[] = [];
  public showSolutionsRequiresInput: boolean = false;
  public caseSensitive: boolean = true;
}
