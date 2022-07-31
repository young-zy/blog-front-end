import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { UserService } from '../../common/user.service';
import { Observable, Subscription } from 'rxjs';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-question',
  templateUrl: './question.component.html',
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    FlexLayoutModule,
    CommonModule,
    MatDividerModule,
    MarkdownModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
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

  constructor(
    private questionApi: QuestionApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private markdownService: MarkdownService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
  ) {
  }

  get isLoggedIn(): Observable<boolean> {
    return this.userService.loginState$;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(next => {
        this.questionId = next.questionId;
        this.loadQuestion();
      })
    );
    this.markdownService.renderer.heading = (text, level) => {
      const url = `${location.origin}${location.pathname}#${text}`;
      const sanitizedURL = this.domSanitizer.sanitize(SecurityContext.URL, url);
      return `
              <h${level} id="${text}" class="marked-header">
                ${text}
                <a title="Link to this heading" aria-hidden="true" class="head-link" href="${sanitizedURL}">
                  <i class="material-icons">link</i>
                </a>
              </h${level}>`;
    };
  }

  handleSubmit(): void {
    if (!this.answerContentControl.valid) {
      return;
    }
    if (this.questionId === -1) {
      return;
    }
    this.questionApi.answerQuestion(this.questionId, this.answerContentControl.value).subscribe({
      next: () => {
        this.snackBar.open('回答成功', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.answerContentControl.reset();
        this.loadQuestion();
      },
      error: error => {
        this.snackBar.open('回答失败', undefined, {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        console.log(error);
      }
    });
  }

  handlePreviewChange(change: MatCheckboxChange): void {
    this.preview = change.checked;
  }

  private loadQuestion(): void {
    this.questionLoading = true;
    this.questionApi.getQuestion(this.questionId).subscribe({
      next: next => {
        this.question = next;
        this.questionLoading = false;
      },
      error: error => {
        console.log(error);
        if (error.status === 404) {
          this.router.navigate(['/NotFound'], {skipLocationChange: true}).then();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
