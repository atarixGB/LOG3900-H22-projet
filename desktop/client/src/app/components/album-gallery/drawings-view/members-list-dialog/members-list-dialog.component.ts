import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-members-list-dialog',
  templateUrl: './members-list-dialog.component.html',
  styleUrls: ['./members-list-dialog.component.scss']
})
export class MembersListDialogComponent {

  constructor(public albumGalleryService: AlbumGalleryService, private router: Router, private route: ActivatedRoute, public profileService: ProfileService) { }

  getUserProfileInfos(username:string): void {
    console.log("Get info of", username);
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

}
