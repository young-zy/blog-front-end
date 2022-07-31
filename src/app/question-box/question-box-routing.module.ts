import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    data: {title: 'Question-Box'},
    loadComponent: () => import('./question-list/question-list.component').then(c => c.QuestionListComponent)
  },
  {
    path: ':questionId',
    data: {title: 'Question-Box'},
    loadComponent: () => import('./question/question.component').then(c => c.QuestionComponent)
  }
];
