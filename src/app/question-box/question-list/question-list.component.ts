import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
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
    MatListModule,
    MatChipsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
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

  private nonNullableFormBuilder = this.formBuilder.nonNullable;

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
              private recaptchaV3Service: ReCaptchaV3Service,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
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
    this.currentPage = pageEvent.pageIndex;
    if (pageEvent.previousPageIndex !== pageEvent.pageIndex || this.pageSize !== pageEvent.pageSize) {
      this.pageSize = pageEvent.pageSize;
      // jump to new page
      this.router.navigate(['/question'], {queryParams: {page: this.currentPage + 1, size: this.pageSize}}).then();
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
    const recaptchaSubscription = this.recaptchaV3Service.execute('newQuestion')
      .subscribe({
        next: token => {
          recaptchaSubscription.unsubscribe();
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
          recaptchaSubscription.unsubscribe();
        }
      });
  }

  private loadQuestions(): void {
    this.questionListLoading = true;
    this.questionApi.getQuestions(this.currentPage, this.pageSize, this.filter).subscribe({
      next: data => {
        this.questionList = data.questions;
        this.totCount = data.totalCount;
        this.questionListLoading = false;
      },
      error: error => {
        console.log(error);
      }
    });
  }
}
