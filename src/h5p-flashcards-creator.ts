import { FlashcardsContent, FlashCard } from './models/flashcards-content';
import { H5pPackage } from './h5p-package';
import { H5pContentCreator } from './h5p-content-creator';

export class H5pFlashcardsCreator extends H5pContentCreator<FlashcardsContent> {
  
  protected contentObjectFactory(): FlashcardsContent {
    return new FlashcardsContent();
  }
  
  protected addContent(contentObject: FlashcardsContent) {    
    contentObject.description = "my automatic description";
    contentObject.cards = new Array();
    contentObject.cards.push({ text: "text 1", answer: "answer 1" });
    contentObject.cards.push({ text: "text 2", answer: "answer 2" });
    contentObject.cards.push({ text: "text 3", answer: "answer 3" });
    contentObject.cards.push({ text: "text 4", answer: "answer 4" });
    contentObject.cards.push({ text: "text 5", answer: "answer 5" });  
  }
  
  protected addSettings(contentObject: FlashcardsContent) {
    contentObject.caseSensitive = false;
    contentObject.showSolutionsRequiresInput = true;
  }
}