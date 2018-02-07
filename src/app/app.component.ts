import {  AfterViewInit, Component, OnInit } from '@angular/core';
import { CornerstoneService } from './services/cornerstone.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  imageData: any;

  constructor(public csS: CornerstoneService) { }

  ngOnInit() {
  	for (const i of ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18']) {
      this.csS.fetchDicomImage(`http://localhost:4300/assets/dicom/CT0000${i}.dcm`)
      .subscribe(res => this.imageData = res);
    }
  }
}
