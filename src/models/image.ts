import axios from 'axios';
import { H5pContent } from "./h5p-content";
import { extname } from 'path';
import { toBuffer } from '../helpers';

export class H5pCopyrightInformation {
  license: string;
  source: string;
  author: string;
  title: string;
  version: string;
} 

export class H5pImage extends H5pContent {
  path: string;
  mime: string;
  copyright: H5pCopyrightInformation = new H5pCopyrightInformation();
  width: number;
  height: number;

  /**
   * Downloads the image at the URL and fills an H5pImage objects with some metadata data of the image.
   * @param url The url to download from.
   * @returns the H5PImage object, the buffer containing the raw image data and the file extension of the URL 
   */
  public static async fromDownload(url: string) : Promise<{ image: H5pImage, buffer: Buffer, extension: string }> {
    var response = await axios.get(url, { "responseType": "arraybuffer" });
    if (response.status !== 200) {
      throw new Error(`Error: Could not download image at ${url}!`);
    }
    let i = new H5pImage();
    i.mime = response.headers['content-type'];
    i.copyright.license = 'U';
    return { image: i, buffer: toBuffer(response.data), extension: extname(url)};
  }
}