import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5PFindTheWordsContent } from "./models/h5p-find-the-words-content";

export class FindTheWordsCreator extends ContentCreator<H5PFindTheWordsContent> {
   constructor(
      h5pPackage: H5pPackage,
      private data: { words: string }[],
      sourcePath: string
   ) {
      super(h5pPackage, sourcePath);
   }
   protected addSettings(contentObject: H5PFindTheWordsContent) {
         contentObject.behaviour = {
            orientations: {
               horizontal: true,
               horizontalBack: true,
               vertical: true,
               verticalUp: true,
               diagonal: true,
               diagonalBack: true,
               diagonalUp: true,
               diagonalUpBack: true,
            },
            fillPool: "abcdefghijklmnopqrstuvwxyz",
            preferOverlap: true,
            showVocabulary: true,
            enableShowSolution: true,
            enableRetry: true,
         };
   }

   /**
    * Sets the description displayed when showing the flashcards.
    * @param description
    */
   public setTitle(title: string) {
      this.h5pPackage.h5pMetadata.title = title;
      this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
   }

   protected contentObjectFactory(): H5PFindTheWordsContent {
      return new H5PFindTheWordsContent();
   }

   protected async addContent(
      contentObject: H5PFindTheWordsContent
   ): Promise<void> {
      const words = [];
      for (const line of this.data) {
         words.push(line.words);
      }
      contentObject.wordList = words.join(",");
   }
}
