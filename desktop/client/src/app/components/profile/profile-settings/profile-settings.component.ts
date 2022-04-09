import { AfterContentInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarImportModalComponent } from '@app/components/avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '@app/components/avatar/avatar-selection-modal/avatar-selection-modal.component';
import { ChatTheme } from '@app/constants/chat-themes';
import { LoginService } from '@app/services/login/login.service';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements AfterContentInit {

  constructor(
    public profileSettingsService: ProfileSettingsService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public soundEffectsService: SoundEffectsService) {

    console.log(this.profileSettingsService.currentChatThemeId);
    this.profileSettingsService.getUserInfos();


  }

  ngAfterContentInit(): void {
    this.profileSettingsService.getUserInfoFromProfile();
  }

  openAvatarSelectionModal(): void {
    this.dialog.open(AvatarSelectionModalComponent, {});
  }

  openAvatarImportModal(): void {
    this.dialog.open(AvatarImportModalComponent, {});
  }

  changeTheme(themeId: ChatTheme): void {
    this.profileSettingsService.newChatThemeId = themeId;
  }

  onCancel(): void {
    this.router.navigate([`../profile/${this.loginService.username}`], { relativeTo: this.route });
  }
}
