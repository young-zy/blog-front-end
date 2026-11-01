import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaV3Service } from '../../common/recaptcha-v3.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
  ]
})
export class QuestionListComponent implements OnInit {

  questionList: Question[] | undefined;

  questionListLoading = false;

  totCount = 0;

  currentPage = 1;

  pageSize = 10;

  filter = 'all';

  private nonNullableFormBuilder = inject(FormBuilder).nonNullable;

  questionForm = this.nonNullableFormBuilder.group({
    questionContent: this.nonNullableFormBuilder.control(
      '',
      {
        validators: [Validators.required],
      }
    ),
    email: this.nonNullableFormBuilder.control(
      '',
      {
        validators: [Validators.email],
      }
    ),
  });

  constructor(private questionApi: QuestionApiService,
              private recaptchaV3Service: RecaptchaV3Service,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  get questionContentControl(): FormControl {
    return this.questionForm.get('questionContent') as FormControl;
  }

  get emailControl(): FormControl<string | null> {
    return this.questionForm.controls.email;
  }

  ngOnInit(): void {
    // load page and size from url
    this.route.queryParamMap.subscribe(value => {
      this.currentPage = parseInt(value.get('page') || '1', 10);
      this.pageSize = parseInt(value.get('size') || '10', 10);
      this.loadQuestions();
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    const nextPage = pageEvent.pageIndex + 1;
    if (this.currentPage !== nextPage || this.pageSize !== pageEvent.pageSize) {
      this.router.navigate(['/question'], {
        queryParams: {page: nextPage, size: pageEvent.pageSize}
      }).then();
    }
  }

  handleFilterChange(newValue: string): void {
    this.filter = newValue;
    this.loadQuestions();
  }

  handleQuestionClick(questionId: number): void {
    this.router.navigate([`/question/${questionId}`]).then();
  }

  handleNewQuestion(): void {
    if (!this.questionForm.valid) {
      return;
    }
    let email: string | null = this.emailControl.value;
    if (email === '') {
      email = null;
    }
    this.recaptchaV3Service.execute('newQuestion')
      .subscribe({
        next: token => {
          this.questionApi.newQuestion(token, this.questionContentControl.value, email).subscribe({
            next: () => {
              this.questionForm.reset();
              this.loadQuestions();
            },
            error: error => {
              // show error to users
              this.snackBar.open('提交问题失败', 'Dismiss', {
                duration: 3000
              });
              console.log(error);
            }
          });
        }, error: error => {
          this.snackBar.open('failed to execute captcha action', 'Dismiss', {
            duration: 3000
          });
          console.log(error);
        }
      });
  }

  private loadQuestions(): void {
    this.questionListLoading = true;
    this.changeDetectorRef.markForCheck();
    this.questionApi.getQuestions(this.currentPage, this.pageSize, this.filter).subscribe({
      next: data => {
        this.questionList = data.questions;
        this.totCount = data.totalCount;
        this.questionListLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        this.questionListLoading = false;
        this.changeDetectorRef.markForCheck();
        console.log(error);
      }
    });
  }
}
