import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    MatToolbarModule,
    FlexLayoutModule,
    CommonModule
  ],
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor() {
  }

  public linkList = [
    {
      href: 'https://kalacloud.com',
      text: '卡拉云低代码工具'
    }
  ];

}
