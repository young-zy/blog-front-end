import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  public linkList = [
    {
      href: 'https://kalacloud.com',
      text: '卡拉云低代码工具'
    }
  ];

  ngOnInit(): void {
  }

}
