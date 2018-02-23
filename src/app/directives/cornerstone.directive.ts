import { Directive, ElementRef, HostListener, EventEmitter, OnInit, Input, Output } from '@angular/core';

import Hammer from 'hammerjs';
import * as dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core/dist/cornerstone.js';
import * as cornerstoneMath from 'cornerstone-math/dist/cornerstoneMath.js';
import * as cornerstoneTools from 'cornerstone-tools/dist/cornerstoneTools.js';

cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

@Directive({
  selector: '[cornerstone]',
})

export class CornerstoneDirective implements OnInit {

  element:  any;

  imageList = [];
  imageListId = [];
  headers: Array<string> = [];

  currentIndex = 0;
  @Output() headersUpdated: EventEmitter<Array<String>> = new EventEmitter();

  @Input('image')
  set image(imageData: any) {
    // console.log('setting image data:', imageData);

    if (imageData) {
      if (!this.imageList.filter(img => img.imageId === imageData.imageId).length) {
        this.imageList.push(imageData);
        this.imageListId.push(imageData.imageId);
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
    .filter( img => img.imageId === `wadouri:https://corner-1.herokuapp.com/assets/dicom/CT00000${this.currentIndex}.dcm`)[0];
  }

  displayImage(image) {
    var stack = {
      currentImageIdIndex : 0,
      imageIds: this.imageListId
    };

    cornerstone.displayImage(this.element, image);

    // enable inputs
    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.mouseWheelInput.enable(this.element);
    cornerstoneTools.touchInput.enable(this.element);

    // Set the stack as tool state
    cornerstoneTools.addStackStateManager(this.element, ['stack']);
    cornerstoneTools.addToolState(this.element, 'stack', stack);

    // mouse
    // cornerstoneTools.wwwc.activate(this.element, 2) // left click
    cornerstoneTools.pan.activate(this.element, 2) // middle click
    cornerstoneTools.zoom.activate(this.element, 1) // right click
    // cornerstoneTools.zoomWheel.activate(this.element); // middle mouse wheel

    // touch / gesture
    // cornerstoneTools.wwwcTouchDrag.activate(this.element) // - Drag
    cornerstoneTools.zoomTouchPinch.activate(this.element) // - Pinch
    cornerstoneTools.panMultiTouch.activate(this.element) // - Multi (x2)
    cornerstoneTools.stackScrollTouchDrag.activate(this.element) // - Multi (x2) Drag
  getImageHeaders (image) {
    try {
      /** Parse the byte array to get a DataSet object that has the parsed contents */
      var dataSet = dicomParser.parseDicom(image.data.byteArray/*, options */);

      /** access a string element */
      this.headers['allImages'] = this.imageList.length;
      this.headers['currentImage'] = this.currentIndex;
      this.headers['patientName'] = dataSet.string('x00100010');
      this.headers['patientAge'] = dataSet.string('x00101010');
      this.headers['studyDate'] = dataSet.string('x00080020');
      this.headers['studyInstanceUid'] = dataSet.string('x0020000d');
      this.headers['bodyPartExamined'] = dataSet.string('x00180015');
      this.headers['institution​Name'] = dataSet.string('x00080080');
      this.headers['physicianName'] = dataSet.string('x00080090');

      this.headersUpdated.emit(this.headers);

    } catch (ex) {
      console.log('Error parsing byte stream', ex);
    }
  }
}
