import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {title: 'Blog'},
    loadComponent: () => import('./post-list/post-list.component').then(c => c.PostListComponent)
  },
  {
    path: '',
    data: {title: 'Blog'},
    loadComponent: () => import('./post/post.component').then(c => c.PostComponent)
  }
];
