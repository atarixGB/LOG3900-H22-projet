import { Component, OnInit } from '@angular/core';
import { PasswordService } from '@app/services/password/password.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(public passwordService: PasswordService) {}

  ngOnInit(): void {
  }

}
