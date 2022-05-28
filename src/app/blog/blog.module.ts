import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatCardModule } from '@angular/material/card';
import { MarkdownSummaryPipe } from './markdown-summary.pipe';


@NgModule({
  declarations: [PostListComponent, PostComponent, MarkdownSummaryPipe],
  imports: [
    CommonModule,
    BlogRoutingModule,
    MarkdownModule,
    MatCardModule
  ]
})
export class BlogModule {
}
