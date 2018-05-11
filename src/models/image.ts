export class Image {
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