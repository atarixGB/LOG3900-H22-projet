import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '@app/services/chat/chat.service';
import { LoginService } from '@app/services/login/login.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(public chatService: ChatService, public loginService: LoginService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {}

  onMyProfileBtn(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }
}
