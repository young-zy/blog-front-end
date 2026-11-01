import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PostApiService } from '../post-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../common/entities/post';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MarkdownSummaryPipe } from '../markdown-summary.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private routeSubscription?: Subscription;

  constructor(private postApiService: PostApiService,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(value => {
      this.currentPage = value.page;
      this.size = value.size;
      this.loadPosts();
    });
  }

  public loadPosts(): void {
    this.postApiService.getPostList(this.currentPage, this.size).subscribe(resp => {
      this.postList = resp.posts;
      this.totalCount = resp.totalCount;
      this.changeDetectorRef.markForCheck();
    });
  }
}
