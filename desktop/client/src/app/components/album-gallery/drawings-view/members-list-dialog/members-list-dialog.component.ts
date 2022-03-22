import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-members-list-dialog',
  templateUrl: './members-list-dialog.component.html',
  styleUrls: ['./members-list-dialog.component.scss']
})
export class MembersListDialogComponent implements OnInit {

  constructor(public albumGalleryService: AlbumGalleryService) { }

  ngOnInit(): void {
  }

}
