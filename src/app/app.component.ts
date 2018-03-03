import {  AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { CornerstoneService } from './services/cornerstone.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @Input() imageStore: Array<string>;

  imageData: any;
  imagePath: string = window.location.origin + '/assets/dicom/';
  imageHeaders: Array<string>;

  constructor(public csS: CornerstoneService) { }

  ngOnInit() {
   /** from local */
    if (this.imageData === undefined) {
      this.imageStore = ['CT000000.dcm','CT000001.dcm','CT000002.dcm','CT000003.dcm','CT000004.dcm','CT000005.dcm','CT000006.dcm','CT000007.dcm','CT000008.dcm','CT000009.dcm','CT000010.dcm','CT000011.dcm','CT000012.dcm','CT000013.dcm','CT000014.dcm','CT000015.dcm','CT000016.dcm','CT000017.dcm','CT000018.dcm'];
    }

   this.getImageData(this.imageStore);
  }

  updateHeaders(headerData: Array<string>){
    this.imageHeaders = headerData;
  }

  getImageData (imageArray: Array<string>) {
    imageArray.forEach(image => {
      this.csS.fetchDicomImage(`${this.imagePath}${image}`)
      .subscribe(res => this.imageData = res);
    })
  }
}
