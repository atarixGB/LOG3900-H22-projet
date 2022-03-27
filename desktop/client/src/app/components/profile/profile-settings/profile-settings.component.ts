import { AfterContentInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImportModalComponent } from '@app/components/avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '@app/components/avatar/avatar-selection-modal/avatar-selection-modal.component';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements AfterContentInit {

    constructor(public profileSettingsService: ProfileSettingsService, public dialog: MatDialog, public soundEffectsService: SoundEffectsService) {}

    ngAfterContentInit(): void {
        this.profileSettingsService.getUserInfoFromProfile();
    }

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }    
}
