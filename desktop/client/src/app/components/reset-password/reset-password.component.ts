import { Component, HostListener, OnInit } from '@angular/core';
import { PasswordService } from '@app/services/password/password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  uniqueCode: number;

  constructor(public passwordService: PasswordService) {}

  ngOnInit(): void {
  }

  @HostListener('document:keyup.enter', ['$event'])
  verifyCode(): void {
    this.passwordService.verifyCode(this.uniqueCode);
  }

  @HostListener('document:keyup.enter', ['$event'])
  changePassword(): void {
    this.passwordService.changePassword();
  }

}
