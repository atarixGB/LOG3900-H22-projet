import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@app/services/login/login.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements AfterViewInit {

  constructor(public profileService: ProfileService, public loginService: LoginService, private route: ActivatedRoute) {
    this.profileService.isCurrentUserProfile = loginService.username == this.route.snapshot.paramMap.get('username');
    console.log("is displayed profile mine?",this.profileService.isCurrentUserProfile);
  }

  ngAfterViewInit(): void {
    this.profileService.getUserProfileInfos(this.route.snapshot.paramMap.get('username'));
  }
}
