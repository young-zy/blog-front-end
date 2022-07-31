import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [
    MatCardModule,
    MatButtonModule
  ],
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
