import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  questionList: Question[] | undefined;

  questionListLoading = false;

  totCount = 0;

  currentPage = 1;

  pageSize = 10;

  filter = 'all';

  questionForm = this.formBuilder.nonNullable.group({
    questionContent: new FormControl(
      '',
      {
        validators: [Validators.required],
        nonNullable: true
      }
    ),
    email: new FormControl(
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
    this.questionApi.getQuestions(this.currentPage, this.pageSize, this.filter).subscribe(
      data => {
        this.questionList = data.questions;
        this.totCount = data.totalCount;
        this.questionListLoading = false;
      },
      error => {
        console.log(error);
      }
    );
  }
}
