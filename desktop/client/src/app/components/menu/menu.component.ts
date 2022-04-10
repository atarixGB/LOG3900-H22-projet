import { Component } from '@angular/core';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(public profileSettingsService: ProfileSettingsService) {}
}
