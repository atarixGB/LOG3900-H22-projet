import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor(public profileService: ProfileService) {}

    ngOnInit(): void {}
}
