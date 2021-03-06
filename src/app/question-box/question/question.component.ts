import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionApiService } from '../question-api.service';
import { Question } from '../../common/entities/question';
import { UserService } from '../../common/user.service';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  questionLoading = false;

  preview = false;

  questionId = -1;

  question: Question | undefined;

  constructor(private questionApi: QuestionApiService,
              private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {
  }

  answerContentControl = this.formBuilder.control(undefined, [Validators.required]);

  get isLoggedIn(): Observable<boolean> {
    return this.userService.loginState;
  }

  ngOnInit(): void {
    this.route.params.subscribe(next => {
      this.questionId = next.questionId;
      this.loadQuestion();
    });
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

  handlePreviewChange(change: MatCheckboxChange): void{
    this.preview = change.checked;
  }

  handleSubmit(): void{
    if (!this.answerContentControl.valid) {
      return;
    }
    if (this.questionId === -1){
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
}
