import { H5pContent } from "./h5p-content";

export class H5PDragAndDropContent extends H5pContent {
   public title: string;
   public settings: {
      size: {
         width: number;
         height: number;
      }
   };
   public task: {
      elements: {
         x: number;
         y: number;
         width: number;
         height: number;
         dropZones: Array<string>;
         type: {
            params: { text: string };
         };
         backgroundOpacity: number;
         multiple: boolean;
      }[];
      dropZones: {
         x: number;
         y: number;
         width: number;
         height: number;
         correctElements: Array<string>;
         showLabel: boolean;
         backgroundOpacity: number;
         tipsAndFeedback?: { tip?: string };
         single: boolean;
         autoAlign: boolean;
         label: string;
         type: {
            library: string;
         };
      }[];
   };
   public behaviour: {
      enableRetry?: boolean;
      enableCheckButton?: boolean;
      singlePoint?: boolean;
      applyPenalties ?: boolean;
      enableScoreExplanation?: boolean;
      dropZoneHighlighting?: "dragging" | "always" | "never";
      enableFullScreen?: boolean;
      showScorePoints?: boolean;
      showTitle?: boolean;
   };
}
