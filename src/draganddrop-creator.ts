import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5PDragAndDropContent } from "./models/h5p-drag-and-drop-content";

export class DragAndDropCreator extends ContentCreator<H5PDragAndDropContent> {
   constructor(
      h5pPackage: H5pPackage,
      private data: Array<{
         label: string;
         correctDraggables: string;
         tip?: string;
      }>,
      sourcePath: string
   ) {
      super(h5pPackage, sourcePath);
   }

   protected addSettings(contentObject: H5PDragAndDropContent) {
      contentObject.settings = {
         size: {
            width: 400,
            height: 400
         }
      };
      contentObject.behaviour = {
         enableRetry: true,
         enableCheckButton: true,
         singlePoint: false,
         applyPenalties: false,
         enableScoreExplanation: false,
         dropZoneHighlighting: "dragging",
         enableFullScreen: false,
         showScorePoints: false,
         showTitle: false,

      };
   }
   /**
    * Sets the description displayed when showing the drag and drop.
    * @param description
    */
   public setTitle(title: string) {
      this.h5pPackage.h5pMetadata.title = title;
      this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
   }

   protected contentObjectFactory(): H5PDragAndDropContent {
      return new H5PDragAndDropContent();
   }

   protected async addContent(
      contentObject: H5PDragAndDropContent
   ): Promise<void> {
        contentObject.settings = {
         size: {
            width: 400,
            height: 400
         }
      }
      contentObject.task = { elements: new Array(), dropZones: new Array() };
      // console.log("CONTENT OBJECT:");
      // console.log(contentObject);
      // console.log("CONTENT OBJECT END");
      function getIndex(currentDraggables: Array<string>, totalDraggables: Array<string>) {
         const draggableIndex = [];
         for (const item of currentDraggables) {
            draggableIndex.push(totalDraggables.indexOf(item).toString());
         }
         return draggableIndex;
      }
      const draggables = [];
      const dropZones = [];
      // for (let line of this.data) {
      //    let currentDraggables = [...line.correctDraggables.split(',')]
      //    draggables.push(...line.correctDraggables.split(','));
         // let dropZone = {
         //    x: 0,
         //    y: 0,
         //    width: 14,
         //    height: 2.5 * Math.ceil(currentDraggables.length / 2),
         //    correctElements: getIndex(currentDraggables, draggables),
         //    showLabel: true,
         //    backgroundOpacity: 100,
         //    tipsAndFeedback: { tip: line.tip },
         //    single: false,
         //    autoAlign: true,
         //    label: `<div>${line.label}</div>\n`,
         //    type: { library: "H5P.DragQuestionDropzone 0.1" }
         // }
         let dropZone = {
            x: 0,
            y: 22.58064516129032,
            width: 11.875,
            height: 14.375,
            correctElements: ["0", "1", "2", "5", "7"],
            showLabel: true,
            backgroundOpacity: 100,
            tipsAndFeedback: { tip: "abc" },
            single: false,
            autoAlign: true,
            label: `<div>Warm</div>\n`,
            type: { library: "H5P.DragQuestionDropzone 0.1" }

         }
         // console.log("Draggables:");
         // console.log(getIndex(currentDraggables, draggables));
         // console.log(draggables);
         // console.log("Draggables end");

         contentObject.task.dropZones.push(dropZone);
         // dropZones.push(this.data.indexOf(line).toString());
      // }

      // for (let word of draggables) {
         // let draggable = {
         //    x: 50,
         //    y: 100,
         //    width: 5,
         //    height: 2.5,
         //    dropZones: dropZones,
         //    type: {
         //       params: { text: `<p>${word}</p>\n` }
         //    },
         //    backgroundOpacity: 100,
         //    multiple: false,
         // }
         let draggable = {
            x: 50,
            y: 100,
            width: 5,
            height: 2.5,
            dropZones: dropZones,
            type: {
               params: { text: `<p>text</p>\n` }
            },
            backgroundOpacity: 100,
            multiple: false,
         }
         // console.log("Single Draggable");
         // console.log(draggable);
         // console.log("Single draggable end");

         contentObject.task.elements.push(draggable);
      // }
      // console.log("Final object:");
      console.log(contentObject);
      // console.log(contentObject.task);

   }
}




