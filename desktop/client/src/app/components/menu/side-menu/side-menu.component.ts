import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DraftDialogComponent } from '@app/components/editor/draft-dialog/draft-dialog.component';
import { ChatService } from '@app/services/chat/chat.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { StampService } from '@app/services/editor/tools/stamp/stamp.service';
import { LoginService } from '@app/services/login/login.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(public chatService: ChatService, public profileService: ProfileService, public stampService: StampService, public drawingService: DrawingService, public loginService: LoginService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {}

  onMyProfileBtn(): void {
    console.log("Current profil from login", this.loginService.username);
    console.log("Current route", this.router.url);
    this.profileService.isCurrentUserProfile = true;
    this.profileService.getUserProfileInfos(this.loginService.username);
    this.router.navigate([`../profile/${this.loginService.username}`]);
  }

  onDraftBnt(): void {
    this.stampService.isEnabled = true;
    this.router.navigate([`../editor`]);
    this.dialog.open(DraftDialogComponent, {
      disableClose: true
    });
  }
}
