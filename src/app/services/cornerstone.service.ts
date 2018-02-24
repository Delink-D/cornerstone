import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/first';

import * as cornerstone from 'cornerstone-core/dist/cornerstone.js';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoader.js';
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader/dist/cornerstoneWebImageLoader.js';
import * as cornerstoneWADOImageLoaderWebWorker from 'cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderWebWorker.js';
import * as cornerstoneWADOImageLoaderCodecs from 'cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderCodecs.js';


@Injectable()

export class CornerstoneService {

  constructor() {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      webWorkerPath : '/assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
      taskConfiguration: {
        'decodeTask' : {
          codecsPath: 'cornerstoneWADOImageLoaderCodecs.js'
        }
      }
    });
  }

  fetchDicomImage(url: string): Observable<any> {
    console.log(`fetching ${url}`)
    return Observable.fromPromise(cornerstone.loadAndCacheImage(`wadouri:${url}`)).first();
  }
}
