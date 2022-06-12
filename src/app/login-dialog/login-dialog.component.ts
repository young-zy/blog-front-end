import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../common/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  private nonNullableFormBuilder = this.formBuilder.nonNullable;

  loginForm = this.nonNullableFormBuilder.group({
    username: this.nonNullableFormBuilder.control(
      '',
      {
        validators: [Validators.required, this.usernameExistsValidator.bind(this)],
      }
    ),
    password: this.nonNullableFormBuilder.control(
      '',
      {
        validators: [Validators.required, this.passwordValidator.bind(this)],
      }
    ),
  });

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  get usernameControl(): FormControl<string> {
    return this.loginForm.controls.username;
  }

  private usernameExists = true;
  private passwordIncorrect = false;

  get passwordControl(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  usernameExistsValidator(control: AbstractControl): ValidationErrors | null {
    const res = this.usernameExists ? null : {usernameNotExist: control.value};
    this.usernameExists = true;
    return res;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const res = this.passwordIncorrect ? {passwordIncorrect: control.value} : null;
    this.passwordIncorrect = false;
    return res;
  }

  formSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    this.usernameExists = true;
    this.passwordIncorrect = false;
    this.userService.login(this.usernameControl.value, this.passwordControl.value).subscribe({
      next: () => {
        console.log('login success');
        this.snackBar.open('登录成功', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.dialogRef.close();
      },
      error: error => {
        console.log(error);
        console.log('login failed');
        if (error.error.message === 'username does not exist') {
          this.usernameExists = false;
          this.usernameControl.updateValueAndValidity();
        } else if (error.error.message === 'username or password incorrect') {
          this.passwordIncorrect = true;
          this.passwordControl.updateValueAndValidity();
        } else {
          this.snackBar.open('some thing bad happened', 'Dismiss', {
            duration: 3000
          });
        }
      }
    });
  }
}
