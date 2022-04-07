import { Component, HostListener, OnDestroy } from '@angular/core';
import { PasswordService } from '@app/services/password/password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy {
  uniqueCode: number;

  constructor(public passwordService: PasswordService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.passwordService.codeIsValid = false;
    this.passwordService.email = "";
  }

  @HostListener('document:keyup.enter', ['$event'])
  verifyCode(): void {
    this.passwordService.verifyCode(this.uniqueCode);
  }

  changePassword(): void {
    if (this.passwordService.checkNewPassword()) {
      this.passwordService.changePassword();
    } else {
      console.log("Les mots de passe sont différents.")
    }
  }

}
