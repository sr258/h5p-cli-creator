import { H5pImage } from "./h5p-image";

export class H5pFlashcard {
  public image?: H5pImage;
  public answer: string = "";
  public tip?: string;
  public text: string = "";
}
