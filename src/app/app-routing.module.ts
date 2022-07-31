import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/question',
    pathMatch: 'full',
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog-routing.module').then(m => m.routes)
  },
  {
    path: 'question',
    loadChildren: () => import('./question-box/question-box-routing.module').then(m => m.routes)
  },
  {
    path: 'NotFound',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/NotFound'
  }
];
