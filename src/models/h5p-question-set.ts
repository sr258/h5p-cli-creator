import { H5pImage } from "./h5p-image";

export class H5PQuestionSet {
  public question: "H5P.MultiChoice"| "H5P.DragQuestion" | "H5P.Blanks" | "H5P.MarkTheWords"| "H5P.DragText" | "H5P.TrueFalse" | "H5P.Essay"
  public image?: H5pImage;
  public answer: string = "";
  public tip?: string;
  public text: string = "";
}
