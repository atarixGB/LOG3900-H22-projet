import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@app/services/login/login.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements AfterViewInit, OnInit {

  constructor(public profileService: ProfileService, public loginService: LoginService, private route: ActivatedRoute) {
    this.profileService.isCurrentUserProfile = loginService.username == this.route.snapshot.paramMap.get('username');
    console.log("is displayed profile mine?",this.profileService.isCurrentUserProfile);
  }

  ngOnInit(): void {
    this.getProfileStatistics();
  }

  ngAfterViewInit(): void {
    this.profileService.getUserProfileInfos(this.route.snapshot.paramMap.get('username'));
  }

  private getProfileStatistics(): void {
    this.profileService.getUserProfileStatistics(this.route.snapshot.paramMap.get('username'));
  }
}
