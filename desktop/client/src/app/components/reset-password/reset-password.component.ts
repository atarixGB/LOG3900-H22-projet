import { Component, HostListener, OnInit } from '@angular/core';
import { ResetPasswordService } from '@app/services/reset-password/reset-password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email: string;
  emailExists: boolean;
  isValidEmail: boolean;

  constructor(public resetPasswordService: ResetPasswordService) {
    this.email = "";
  }

  ngOnInit(): void {
  }

  @HostListener('document:keyup.enter', ['$event'])
  send(): void {
    console.log(this.email);
    if(this.checkEmail()) {
      this.isValidEmail = true;
      this.resetPasswordService.confirmEmail(this.email);
      // TODO : Confirmer que le courriel a été envoyé
    } else {
      this.isValidEmail = false;
    }

  }

  private checkEmail(): boolean {
    const regex = /\S+@\S+\.\S+/;
    const isValid = regex.test(this.email);
    return isValid && this.isValidInput(this.email);
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
}

}
