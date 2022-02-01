import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {
    path: '',
    data: {title: 'Blog'},
    component: PostListComponent
  },
  {
    path: '',
    data: {title: 'Blog'},
    component: PostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
