import { Directive, ElementRef, HostListener,  Input, OnInit } from '@angular/core';

import Hammer from 'hammerjs';
import * as dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core/dist/cornerstone.js';
import * as cornerstoneTools from 'cornerstone-tools/dist/cornerstoneTools.js';

cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;

@Directive({
  selector: '[cornerstone]',
})

export class CornerstoneDirective implements OnInit {

  element:  any;

  imageList = [];

  currentIndex = 0;

  @Input('image')
  set image(imageData: any) {
    // console.log('setting image data:', imageData);

    if (imageData) {
      if (!this.imageList.filter(img => img.imageId === imageData.imageId).length) {
        this.imageList.push(imageData);
      }

      if (imageData.imageId) {
        this.displayImage(imageData);
      }
      // console.log(this.imageList);
    }
  }

  constructor(public elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnInit () {
  // Retrieve the DOM element itself
  this.element = this.elementRef.nativeElement;

  // Enable the element with Cornerstone
  cornerstone.enable(this.element);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    cornerstone.resize(this.element, true);
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event) {
    event.preventDefault();

    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

    if(delta > 0){
      this.currentIndex ++;
      if( this.currentIndex > this.imageList.length) {
        this.currentIndex = this.imageList.length-1;
      }
    } else {
      this.currentIndex --;
      if(this.currentIndex < 0){
        this.currentIndex = 0;
      }
    }

    this.image = this.imageList
    .filter( img => img.imageId === `wadouri:http://localhost:4300/assets/dicom/CT00000${this.currentIndex}.dcm`)[0];
  }

  displayImage(image) {
    cornerstone.displayImage(this.element, image);

    // cornerstoneTools.mouseInput.enable(this.element);
    // cornerstoneTools.mouseWheelInput.enable(this.element);

    // cornerstoneTools.pan.activate(this.element, 2);
    // cornerstoneTools.zoom.activate(this.element, 4);
  }
}