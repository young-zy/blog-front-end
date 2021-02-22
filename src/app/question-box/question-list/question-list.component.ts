import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

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

  get questionContentControl(): FormControl{
    return this.questionForm.get('questionContent') as FormControl;
  }

  get emailControl(): FormControl{
    return this.questionForm.get('email') as FormControl;
  }

  questionForm = this.formBuilder.group({
    questionContent: [undefined, [Validators.required]],
    email: [undefined, [Validators.email]]
  });

  constructor(private questionApi: QuestionApiService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // load page and size from url
    this.route.queryParamMap.subscribe(value => {
      this.currentPage = parseInt(value.get('page') || '1', 10);
      this.pageSize = parseInt( value.get('size') || '10', 10 );
      this.loadQuestions();
    });
  }

  private loadQuestions(): void{
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

  handlePageEvent(pageEvent: PageEvent): void{
    this.currentPage = pageEvent.pageIndex;
    if (pageEvent.previousPageIndex !== pageEvent.pageIndex || this.pageSize !== pageEvent.pageSize){
      this.pageSize = pageEvent.pageSize;
      // jump to new page
      this.router.navigate(['/question'], {queryParams: {page: this.currentPage + 1, size: this.pageSize}} ).then();
    }
  }

  handleFilterChange(newValue: string): void{
    this.filter = newValue;
    this.loadQuestions();
  }

  handleQuestionClick(questionId: number): void{
    this.router.navigate([`/question/${questionId}`]).then();
  }

  handleNewQuestion(): void{
    if (!this.questionForm.valid) {
      return;
    }
    let email: string | undefined = this.emailControl.value;
    if (email === ''){
      email = undefined;
    }
    this.questionApi.newQuestion(this.questionContentControl.value, email).subscribe(
      () => {
        this.questionForm.reset();
        this.loadQuestions();
      },
      error => {
        console.log(error);
    });
  }
}
