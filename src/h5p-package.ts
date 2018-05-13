import axios from 'axios';
import * as chalk from 'chalk';
import * as jszip from 'jszip';
import * as fs from 'fs';
import { H5pLanguageStrings } from './h5p-languageStrings';
import { ECANCELED } from 'constants';

/**
 * H5P Package
 */
export class H5pPackage {
  private h5pHubUrl = 'https://api.h5p.org/v1/';
  private packageZip: jszip;
  private h5pData: any;
  public languageStrings: H5pLanguageStrings;

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
    console.log(`Downloaded content type ${this.contentTypeName} from H5P hub. (${data.byteLength} bytes).`);
    this.packageZip = await jszip.loadAsync(this.toBuffer(data));
  }

  private getLibraryInformation(name: string): { name: string, majorVersion: number, minorVersion: number } {
    for (var dep of this.h5pData.preloadedDependencies) {
      if (dep.machineName === name)
        return { name: dep.machineName, majorVersion: +dep.majorVersion, minorVersion: +dep.minorVersion };
    }
  }

  /**
   * Initializes the h5p package
   * @param language the code of the language to use the language strings for
   */
  private async initialize(language: string): Promise<void> {
    this.h5pData = JSON.parse(await this.packageZip.file('h5p.json').async("text"));
    var libInfo = this.getLibraryInformation(this.h5pData.mainLibrary);
    this.languageStrings = await H5pLanguageStrings.fromLibrary(this.packageZip, libInfo.name, libInfo.majorVersion, libInfo.minorVersion, language);
  }

  /**
   * Factory method to fetch a package for a content type from the h5p hub and load its content into memory.
   * @param contentTypeName the name of the content type to download
   * @param language the code of the language to use the language strings for
   * @returns the newly created package object
   */
  public static async createFromHub(contentTypeName: string, language: string): Promise<H5pPackage> {
    let pack = new H5pPackage(contentTypeName);
    await pack.download();
    await pack.initialize(language);
    return pack;
  }

  /**
   * Removes all content from the package.
   */
  public clearContent(): void {
    this.packageZip.remove('content');
  }

  /**
   * Creates a content.json in the package containing the passed string.
   * @param json 
   */
  public addMainContentFile(json: string): void {
    this.packageZip.file('content/content.json', Buffer.from(json));
  }

  /**
   * Stores the package to the disk
   * @param path 
   * @returns 
   */
  public async savePackage(path: string): Promise<void> {
    var file = await this.packageZip.generateAsync({ type: "nodebuffer" });
    fs.writeFileSync(path, file);
    console.log(`Stored H5P package at ${path}.`)
  }
}