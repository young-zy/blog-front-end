import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import TocObject from '../../common/entities/tocObject';

/**
 * toc service is used to generate toc list from markdown string
 */
@Injectable({
  providedIn: 'root'
})
export class TocServiceService {

  constructor() {
  }

  private tocListSource = new ReplaySubject<TocObject | null>(1);

  get tocList(): Observable<TocObject | null> {
    return this.tocListSource.asObservable();
  }
}
