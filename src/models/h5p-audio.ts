import axios from "axios";
import { lookup } from "mime-types";
import * as fs from "fs";

import { extname } from "path";
import { toBuffer } from "../helpers";
import { H5pContent } from "./h5p-content";
import { H5pCopyrightInformation } from "./h5p-copyright-information";

export class H5pAudio extends H5pContent {
  /**
   * Downloads the audio at the URL and fills an H5pAudio objects with some metadata data of the image.
   * @param url The url to download from.
   * @returns the H5PAudio object, the buffer containing the raw audio data and the file extension of the URL
   */
  public static async fromDownload(
    url: string
  ): Promise<{ audio: H5pAudio; buffer: Buffer; extension: string }> {
    let response = await axios.get(url, { responseType: "arraybuffer" });
    if (response.status !== 200) {
      throw new Error(`Error: Could not download audio at ${url}!`);
    }
    let a = new H5pAudio();
    a.mime = response.headers["content-type"].replace(
      "audio/mp3",
      "audio/mpeg"
    );
    a.copyright.license = "U";
    return {
      audio: a,
      buffer: toBuffer(response.data),
      extension: extname(url),
    };
  }

  public static async fromLocalFile(
    path: string
  ): Promise<{ audio: H5pAudio; buffer: Buffer; extension: string }> {
    let a = new H5pAudio();
    a.mime = (lookup(path) || "image").replace("audio/mp3", "audio/mpeg");
    a.copyright.license = "U";
    const buffer = fs.readFileSync(path);
    return {
      audio: a,
      buffer,
      extension: extname(path),
    };
  }

  public path: string;
  public mime: string;
  public copyright: H5pCopyrightInformation = new H5pCopyrightInformation();
}
