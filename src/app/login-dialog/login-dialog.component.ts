import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../common/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  get usernameControl(): UntypedFormControl {
    return this.loginForm.get('username') as UntypedFormControl;
  }

  get passwordControl(): UntypedFormControl {
    return this.loginForm.get('password') as UntypedFormControl;
  }

  private usernameExists = true;
  private passwordIncorrect = false;

  loginForm = this.formBuilder.group({
    username: [undefined, [Validators.required, this.usernameExistsValidator.bind(this)]],
    password: [undefined, [Validators.required, this.passwordValidator.bind(this)]]
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  usernameExistsValidator(control: AbstractControl): ValidationErrors | null{
    const res = this.usernameExists ? null : {usernameNotExist: control.value};
    this.usernameExists = true;
    return res;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null{
    const res = this.passwordIncorrect ? {passwordIncorrect: control.value} : null;
    this.passwordIncorrect = false;
    return res;
  }

  ngOnInit(): void {
  }

  formSubmit(): void{
    if (!this.loginForm.valid){
      return;
    }
    this.usernameExists = true;
    this.passwordIncorrect = false;
    this.userService.login(this.usernameControl.value, this.passwordControl.value).subscribe(
      () => {
        console.log('login success');
        this.snackBar.open('登录成功', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.dialogRef.close();
      },
      error => {
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
    );
  }

}
