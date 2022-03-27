import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-members-list-dialog',
  templateUrl: './members-list-dialog.component.html',
  styleUrls: ['./members-list-dialog.component.scss']
})
export class MembersListDialogComponent implements OnInit {

  constructor(public albumGalleryService: AlbumGalleryService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  getUserProfileInfos(username:string): void {
    console.log("Get info of", username);
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

}
