import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionBoxRoutingModule } from './question-box-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuestionComponent } from './question/question.component';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule } from 'ngx-markdown';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [QuestionListComponent, QuestionComponent],
  imports: [
    CommonModule,
    QuestionBoxRoutingModule,
    MatCardModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule,
    MatRippleModule,
    MatChipsModule,
    MatSelectModule,
    MarkdownModule.forChild(),
    ReactiveFormsModule,
    MatCheckboxModule
  ]
})
export class QuestionBoxModule { }
