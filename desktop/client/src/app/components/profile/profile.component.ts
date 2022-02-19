import { AfterViewInit, Component } from '@angular/core';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements AfterViewInit {
    constructor(public profileService: ProfileService) {}

    ngAfterViewInit(): void {
        this.profileService.loadProfileInfo();
    }
}
