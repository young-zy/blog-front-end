import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { UserService } from '../../common/user.service';
import { Observable, Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {

  questionLoading = false;

  preview = false;

  questionId = -1;

  question: Question | undefined;

  private subscriptions: Array<Subscription> = [];

  answerContentControl = this.formBuilder.nonNullable.control(
    '',
    {
      validators: [Validators.required]
    }
  );

  constructor(private questionApi: QuestionApiService,
              private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private markdownService: MarkdownService,
              private route: ActivatedRoute) {
  }

  get isLoggedIn(): Observable<boolean> {
    return this.userService.loginState;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.url.subscribe(next => {
        console.log(next);
      })
    );
    this.subscriptions.push(
      this.route.params.subscribe(next => {
        this.questionId = next.questionId;
        this.loadQuestion();
      })
    );
    this.markdownService.renderer.heading = (text, level) => {
      // const encodedText = encodeURI(text);
      // const escapedText = encodedText.toLowerCase().replace(/[^\w]+/g, '-');
      return `
              <h${level} id="${text}" class="marked-header">
                ${text}
                <a title="Link to this heading" aria-hidden="true" class="head-link" href="${this.router.url}#${text}">
                  <i class="material-icons">link</i>
                </a>
              </h${level}>`;
    };
  }

  private loadQuestion(): void {
    this.questionLoading = true;
    this.questionApi.getQuestion(this.questionId).subscribe(next => {
        this.question = next;
        this.questionLoading = false;
      },
      error => {
        console.log(error);
        if (error.status === 404) {
          this.router.navigate(['/NotFound'], {skipLocationChange: true}).then();
        }
      });
  }

  handlePreviewChange(change: MatCheckboxChange): void {
    this.preview = change.checked;
  }

  handleSubmit(): void {
    if (!this.answerContentControl.valid) {
      return;
    }
    if (this.questionId === -1) {
      return;
    }
    this.questionApi.answerQuestion(this.questionId, this.answerContentControl.value).subscribe(
      () => {
        this.snackBar.open('回答成功', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.answerContentControl.reset();
        this.loadQuestion();
      },
      error => {
        this.snackBar.open('回答失败', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
