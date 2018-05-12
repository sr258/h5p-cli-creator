import { Image } from './image';
import { H5pContent } from './h5p-content';

export class FlashCard{  
    image?: Image;
    answer: string = "";
    tip?: string;
    text: string = ""; 
}

export class FlashcardsContent extends H5pContent {
  description: string = "";
  cards: FlashCard[] = [];
  showSolutionsRequiresInput: boolean = false;
  caseSensitive: boolean = true;
}