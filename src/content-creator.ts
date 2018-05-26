import { H5pPackage } from "./h5p-package";
import { H5pContent } from "./models/h5p-content";

/**
 * Classes derived from this class can utilize the infrastructure provided here to create content.
 * @template T the h5p content type to create
 */
export abstract class ContentCreator<T extends H5pContent> {  
  public constructor(protected h5pPackage: H5pPackage) {
    this.clearPackageContent();
    this.content = this.contentObjectFactory();
   }
  
  /**
   * Change the properties of this object.
   */
  protected content : T;

  /**
   * Instanciated the object of type T.
   * @returns content object 
   */
  protected abstract contentObjectFactory() : T;

  /**
   * Add the content to the content object here.
   * @param contentObject 
   */
  protected abstract async addContent(contentObject: T) : Promise<void>;

  /**
   * Add settings you want to specify here.
   * @param contentObject 
   */
  protected abstract addSettings(contentObject: T);

  private clearPackageContent() {
    this.h5pPackage.clearContent();
  }

  /**
   * This method creates the content for the h5p package by calling the abstract methods of this class. It also
   * adds languages strings in the language specified in the H5P Package.  If you want to add
   * content besides the 'content/content.json' file you have to add these files to the package manually by accessing 
   * the h5pPackage property.
   * @returns the content object
   */
  public async create() : Promise<H5pContent> {    
    await this.addContent(this.content);
    this.addSettings(this.content);
    this.h5pPackage.languageStrings.addAllToContent(this.content);
    this.h5pPackage.addMainContentFile(JSON.stringify(this.content));  
    return this.content;
  }

  /**
   * Stores the h5p package at the file specified.
   * @param path 
   */
  public async savePackage(path: string) : Promise<void> {
    await this.h5pPackage.savePackage(path);
  }
}