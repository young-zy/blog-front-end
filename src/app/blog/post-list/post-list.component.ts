import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostApiService } from '../post-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../common/entities/post';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MarkdownSummaryPipe } from '../markdown-summary.pipe';

@Component({
  standalone: true,
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  imports: [
    MatCardModule,
    CommonModule,
    MarkdownSummaryPipe
  ],
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  public postList: Post[] = [];

  public totalCount = 0;

  public currentPage = 1;

  public size = 10;

  public loading = false;

  private subscriptionArray: Subscription[] = [];

  constructor(private postApiService: PostApiService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.subscriptionArray.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    const subscription = this.route.queryParams.subscribe(value => {
      this.currentPage = value.page;
      this.size = value.size;
      this.loadPosts();
    });
    this.subscriptionArray.push(subscription);
  }

  public loadPosts(): void {
    this.postApiService.getPostList(this.currentPage, this.size).subscribe(resp => {
      this.postList = resp.posts;
      console.log(this.postList);
      this.totalCount = resp.totalCount;
    });
  }
}
