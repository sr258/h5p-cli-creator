import { FlashcardsContent, FlashCard } from './models/flashcards-content';
import { H5pPackage } from './h5p-package';

export function createFlashCards(h5pPackage: H5pPackage) {
  let content = new FlashcardsContent();
  content.caseSensitive = false;
  content.description = "my automatic description";
  content.showSolutionsRequiresInput = true;
  content.cards = new Array();
  content.cards.push({ text: "text 1", answer: "answer 1" });
  content.cards.push({ text: "text 2", answer: "answer 2" });
  content.cards.push({ text: "text 3", answer: "answer 3" });
  content.cards.push({ text: "text 4", answer: "answer 4" });
  content.cards.push({ text: "text 5", answer: "answer 5" });  
  h5pPackage.languageStrings.addAllToContent(content);
  h5pPackage.clearContent();
  h5pPackage.addSimpleContentFile(JSON.stringify(content));
  h5pPackage.savePackage('./test.h5p');
}