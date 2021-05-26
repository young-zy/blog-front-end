import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {

  constructor() {
  }

  // base64textString: string;

  ngOnInit(): void {
  }

  uploadAvatarEvt(evt: any): void {
    const files = evt.target.files;
    const file = files[0];

    console.log(file);

    // if (files && file) {
    //   const reader = new FileReader();
    //
    //   reader.onload = this._handleReaderLoaded.bind(this);
    //
    //   reader.readAsBinaryString(file);
    // }
  }

  _handleReaderLoaded(readerEvt: any): void {
    // const binaryString = readerEvt.target.result;
    // this.base64textString = btoa(binaryString);
    // console.log('data:image/png;base64,' + btoa(binaryString));
  }

}
