import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/question',
    pathMatch: 'full',
  },
  {
    path: 'question',
    // component: QuestionListComponent
    loadChildren: () => import('./question-box/question-box.module').then(m => m.QuestionBoxModule)
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
