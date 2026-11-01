import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    MatToolbarModule
  ],
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}
