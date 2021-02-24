import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionComponent } from './question/question.component';


const routes: Routes = [
  {
    path: '',
    data: { title: 'Question-Box' },
    component: QuestionListComponent
  },
  {
    path: ':questionId',
    data: { title: 'Question-Box' },
    component: QuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionBoxRoutingModule { }
