import { H5pImage } from './h5p-image';
import { H5pContent } from './h5p-content';

export class H5pFlashcard{  
    image?: H5pImage;
    answer: string = "";
    tip?: string;
    text: string = ""; 
}

export class H5pFlashcardsContent extends H5pContent {
  description: string = "";
  cards: H5pFlashcard[] = [];
  showSolutionsRequiresInput: boolean = false;
  caseSensitive: boolean = true;
}