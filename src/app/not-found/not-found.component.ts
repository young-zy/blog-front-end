import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  constructor(
    private location: Location,
    private router: Router
  ) {
  }

  backToIndex(): void {
    this.router.navigate(['/']).then();
  }

  backToLastPage(): void {
    this.location.back();
  }

}
