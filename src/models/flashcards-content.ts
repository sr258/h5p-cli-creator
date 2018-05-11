import { Image } from './image';

export class FlashcardsContent {
  description: string;
  cards: {
    image?: Image;
    answer: string;
    tip: string;
    text: string;
  };
  showSolutionsRequiresInput: boolean;
  caseSensitive: true;
}