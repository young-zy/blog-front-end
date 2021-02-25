import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  backToIndex(): void {
    this.router.navigate(['/']).then();
  }

  backToLastPage(): void {
    this.location.back();
  }

}
