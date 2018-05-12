import { H5pContent } from "./h5p-content";

export class Image extends H5pContent {
  path: string;
  mime: string;
  copyright: {
    license: string;
    source: string;
    author: string;
    title: string;
    version: string;
  }
  width: number;
  height: number;
}