import { Component, OnDestroy } from '@angular/core';
import { PasswordService } from '@app/services/password/password.service';
import { NAME_MAX_LENGTH } from '@app/constants/constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy {
  readonly MAX_LENGTH = NAME_MAX_LENGTH;
  uniqueCode: string;
  areEquals: boolean;
  isLengthValid: boolean;

  constructor(public passwordService: PasswordService) {
    this.areEquals = true;
    this.isLengthValid = true;

    console.log(this.uniqueCode)
    console.log(this.passwordService.codeIsValid)
  }

  ngOnDestroy(): void {
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
      this.passwordService.changePassword();
    }
  }

  private checkPassword(): boolean {
    this.areEquals = this.passwordService.newPassword == this.passwordService.confirmedPassword;
    this.isLengthValid = this.passwordService.newPassword.length <= NAME_MAX_LENGTH
    return this.areEquals && this.isLengthValid;
  }

}
