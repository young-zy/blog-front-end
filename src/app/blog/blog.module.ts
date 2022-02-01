import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';
import { TocComponentComponent } from './toc-component/toc-component.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatCardModule } from '@angular/material/card';
import { MarkdownSummaryPipe } from './markdown-summary.pipe';


@NgModule({
  declarations: [PostListComponent, PostComponent, TocComponentComponent, MarkdownSummaryPipe],
  imports: [
    CommonModule,
    BlogRoutingModule,
    MarkdownModule,
    MatCardModule
  ]
})
export class BlogModule {
}
