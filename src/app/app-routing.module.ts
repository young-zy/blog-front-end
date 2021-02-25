import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/question',
    pathMatch: 'full',
  },
  {
    path: 'question',
    loadChildren: () => import('./question-box/question-box.module').then(m => m.QuestionBoxModule)
  },
  {
    path: 'NotFound',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/NotFound'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
