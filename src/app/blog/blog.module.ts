import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { PostListComponent } from './post-list/post-list.component';


@NgModule({
  declarations: [PostListComponent],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule {
}
