import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private title = new ReplaySubject<string>(1);
  currentTitle = this.title.asObservable();

  constructor(private titleService: Title) {
    this.setTitle('blog');
  }

  public setTitle(newTitle: string): void {
    this.title.next(newTitle);
    this.titleService.setTitle(newTitle);
  }

}
