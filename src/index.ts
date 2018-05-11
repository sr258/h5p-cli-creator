#!usr/bin/env node

import axios from 'axios';
import * as chalk from 'chalk';
import * as flashcards from './flashcards';
import * as AdmZip from 'adm-zip';
import { LanguageStrings } from './models/languageStrings';

const h5pHub = 'https://api.h5p.org/v1/';
const file = 'content.csv';

async function downloadContentType(identifier: string): Promise<ArrayBuffer> {
  var response = await axios.get(h5pHub + "content-types/" + identifier, { "responseType": "arraybuffer" });
  if (response.status !== 200) {
    throw new Error('Error: Could not download content type from H5P hub.');
  }

  return response.data;
}

/*async function getIp() : Promise<void> {
  var response = await axios.get('https://httpbin.org/ip');
  console.log(chalk.default.cyan(`Your IP is ${response.data.origin}`));
}*/

function toBuffer(ab) {
  var buf = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

async function main(): Promise<void> {
  try {
    let data = await downloadContentType('H5P.Flashcards');
    console.log(`Downloaded content type template from H5P hub. (${data.byteLength} bytes).`);
    let zip = new AdmZip(toBuffer(data));
    let contentData = zip.getEntry('h5p.json').getData();
    //console.log(contentData.toString());
    var lang = LanguageStrings.fromLibrary(zip, "H5P.Flashcards", 1, 5, "de");   
  }
  catch (error) {
    console.log(chalk.default.red(error));
    return;
  }
}

main();

