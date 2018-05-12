import axios from 'axios';
import * as chalk from 'chalk';
import * as flashcards from './flashcards';
import * as AdmZip from 'adm-zip';
import { H5pLanguageStrings } from './models/languageStrings';

/**
 * H5P Package
 */
export class H5pPackage {
  private h5pHubUrl = 'https://api.h5p.org/v1/';
  private packageZip: AdmZip;

  private constructor(private contentTypeName: string) {

  }

  /**
   * Downloads the package from the h5p hub
   * @param contentTypeName The name of the package to download.
   * @returns The binary data of the package
   */
  private async downloadContentType(contentTypeName: string): Promise<ArrayBuffer> {
    var response = await axios.get(this.h5pHubUrl + "content-types/" + contentTypeName, { "responseType": "arraybuffer" });
    if (response.status !== 200) {
      throw new Error('Error: Could not download content type from H5P hub.');
    }
    return response.data;
  }

  private toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }

  /**
   * Downloads the h5p package from the hub and loads the content for further processing.
   * @returns download 
   */
  private async download(): Promise<void> {
    let data = await this.downloadContentType(this.contentTypeName);
    console.log(`Downloaded content type template from H5P hub. (${data.byteLength} bytes).`);
    this.packageZip = new AdmZip(this.toBuffer(data));    
  }  

  /**
   * Initializes the h5p package
   */
  private initialize() : void {
    let contentData = this.packageZip.getEntry('h5p.json').getData();
    var lang = H5pLanguageStrings.fromLibrary(this.packageZip, "H5P.Flashcards", 1, 5, "de");
  }

  /**
   * Factory method to fetch a package for a content type from the h5p hub and load its content into memory.
   * @param contentTypeName the name of the content type to download
   * @returns the newly created package object
   */
  public static async createFromHub(contentTypeName: string): Promise<H5pPackage> {
    let pack = new H5pPackage(contentTypeName);
    await pack.download();
    pack.initialize();
    return pack;
  }
}