import axios from "axios";
import * as imageSize from "buffer-image-size";
import { lookup } from "mime-types";
import * as fs from "fs";

import { extname } from "path";
import { toBuffer } from "../helpers";
import { H5pContent } from "./h5p-content";
import { H5pCopyrightInformation } from "./h5p-copyright-information";

export class H5pMatch extends H5pContent {
  /**
   * Downloads the image at the URL and fills an H5pImage objects with some metadata data of the image.
   * @param url The url to download from.
   * @returns the H5PImage object, the buffer containing the raw image data and the file extension of the URL
   */
  public static async fromDownload(url: string): Promise<{
    match: H5pMatch;
    buffer: Buffer;
    extension: string;
  }> {
    let response = await axios.get(url, { responseType: "arraybuffer" });
    if (response.status !== 200) {
      throw new Error(`Error: Could not download image at ${url}!`);
    }
    let i = new H5pMatch();
    i.mime = response.headers["content-type"];
    i.copyright.license = "U";
    const buffer = toBuffer(response.data);
    const dim = imageSize(buffer);
    i.width = dim.width;
    i.height = dim.height;
    return {
      match: i,
      buffer,
      extension: extname(url),
    };
  }

  public static async fromLocalFile(path: string): Promise<{
    match: H5pMatch;
    buffer: Buffer;
    extension: string;
  }> {
    let i = new H5pMatch();
    i.mime = lookup(path) || "match";
    i.copyright.license = "U";
    const buffer = fs.readFileSync(path);
    const dim = imageSize(buffer);
    i.width = dim.width;
    i.height = dim.height;
    return {
      match: i,
      buffer,
      extension: extname(path),
    };
  }

  public path: string;
  public mime: string;
  public copyright: H5pCopyrightInformation = new H5pCopyrightInformation();
  public width: number;
  public height: number;
}
