import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '@app/services/chat/chat.service';
import { LoginService } from '@app/services/login/login.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(public chatService: ChatService, public profileService: ProfileService, public loginService: LoginService, private router: Router) { }

  ngOnInit(): void {}

  onMyProfileBtn(): void {
    console.log("Current profil", this.loginService.username)
    console.log("Current route", this.router.url)
    this.router.navigate([`../profile/${this.loginService.username}`]);
  }
}
