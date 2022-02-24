import { AfterContentInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarImportModalComponent } from '@app/components/avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from '@app/components/avatar/avatar-selection-modal/avatar-selection-modal.component';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements AfterContentInit {

    constructor(public profileSettingsService: ProfileSettingsService, public dialog: MatDialog) {}

    ngAfterContentInit(): void {
        this.profileSettingsService.getUserInfoFromProfile();
        this.profileSettingsService.newUsername = "";
    }

    openAvatarSelectionModal(): void {
        this.dialog.open(AvatarSelectionModalComponent, {});
    }

    openAvatarImportModal(): void {
        this.dialog.open(AvatarImportModalComponent, {});
    }

    saveChanges(): void {
        if (this.profileSettingsService.isValidNewUsername()) {
            this.profileSettingsService.sendChangesToDB();
        } else {
            console.log('TO DO: Message erreur quand le username est invalid (dans profile-settings component)');
        }
    }        
}
