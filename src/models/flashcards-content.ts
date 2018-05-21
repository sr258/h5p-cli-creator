import { H5pImage } from './image';
import { H5pContent } from './h5p-content';

export class Flashcard{  
    image?: H5pImage;
    answer: string = "";
    tip?: string;
    text: string = ""; 
}

export class FlashcardsContent extends H5pContent {
  description: string = "";
  cards: Flashcard[] = [];
  showSolutionsRequiresInput: boolean = false;
  caseSensitive: boolean = true;
}