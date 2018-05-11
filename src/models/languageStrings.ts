import * as AdmZip from 'adm-zip';

export class LanguageStrings {
  constructor(private semantics: object, private languageFile = null) {

  }

  public static fromLibrary(zip: AdmZip, libraryName: string, majorVersion: number, minorVersion: number, languageCode: string): LanguageStrings {
    let libraryDirectory = `${libraryName}-${majorVersion}.${minorVersion}`;
    let semanticsEntry = zip.getEntry(libraryDirectory + '/semantics.json');

    let langObject: object = null;
    if (languageCode !== "en") {
      let langEntry = zip.getEntry(libraryDirectory + `/language/${languageCode}.json`);
      langObject = JSON.parse(langEntry.getData().toString());
    }
    return new LanguageStrings(JSON.parse(semanticsEntry.getData().toString()), langObject);
  }

  public get(name: string) {
    for (let key in this.semantics) {
      if (this.semantics[key]['name'] === undefined || this.semantics[key]['name'] !== name)
        continue;
      if (this.languageFile === null || this.languageFile.semantics[key]['default'] === undefined) {
        return this.semantics[key]['default'];
      }
      else {        
        return this.languageFile.semantics[key]['default'];
      }
    }
  }

  public getCommonStrings(): { name: string, value: string }[] {
    let list: { name: string, value: string }[] = new Array();

    for (let key in this.semantics) {
      if (this.semantics[key]['name'] !== undefined && this.semantics[key]['common'] === true) {
        list.push({ name: this.semantics[key]['name'], value: this.get(this.semantics[key]['name']) });
      }
    }

    return list;
  }
}
