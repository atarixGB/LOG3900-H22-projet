import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { ProfileService } from '@app/services/profile/profile.service';
import { StoryService } from '@app/services/story/story.service';

@Component({
    selector: 'app-file-menu',
    templateUrl: './file-menu.component.html',
    styleUrls: ['./file-menu.component.scss'],
})
export class FileMenuComponent {

    constructor(public dialog: MatDialog, public storyService: StoryService, public albumGalleryService: AlbumGalleryService, public profileService: ProfileService) {}
}
