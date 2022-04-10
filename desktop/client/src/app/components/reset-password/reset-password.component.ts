import { Component, OnDestroy } from '@angular/core';
import { PasswordService } from '@app/services/password/password.service';
import { NAME_MAX_LENGTH } from '@app/constants/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordSnackbarComponent } from './password-snackbar/password-snackbar.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy {
  readonly MAX_LENGTH = NAME_MAX_LENGTH;
  readonly SNACKBAR_DURATION = 5;
  uniqueCode: string;
  areEquals: boolean;
  isLengthValid: boolean;
  isEmpty: boolean;

  constructor(public passwordService: PasswordService, private snackbar: MatSnackBar) {
    this.areEquals = true;
    this.isLengthValid = true;
    this.isEmpty = true;

    console.log(this.uniqueCode)
    console.log(this.passwordService.codeIsValid)
  }

  ngOnDestroy(): void {
    this.passwordService.codeIsValid = false;
    this.passwordService.emailExists = true;
    this.passwordService.email = "";
    this.passwordService.newPassword = "";
    this.passwordService.confirmedPassword = "";
  }

  verifyCode(): void {
    this.passwordService.verifyCode(Number(this.uniqueCode));

  }

  changePassword(): void {
    if (this.checkPassword()) {
      this.passwordService.changePassword().then(() => {
        this.snackbar.openFromComponent( PasswordSnackbarComponent,{
          duration: this.SNACKBAR_DURATION * 1000,
        })
      });
    }
  }

  private checkPassword(): boolean {
    this.areEquals = this.passwordService.newPassword == this.passwordService.confirmedPassword;
    this.isLengthValid = this.passwordService.newPassword.length <= NAME_MAX_LENGTH
    this.isEmpty = this.isEmptyOrSpaces(this.passwordService.newPassword);
    return this.areEquals && this.isLengthValid && !this.isEmpty;
  }

  private isEmptyOrSpaces(str: string): boolean {
    return str === null || str.match(/^ *$/) !== null;
}

}
