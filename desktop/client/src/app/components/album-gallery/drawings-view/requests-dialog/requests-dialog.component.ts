import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { LoginService } from '@app/services/login/login.service';

@Component({
  selector: 'app-requests-dialog',
  templateUrl: './requests-dialog.component.html',
  styleUrls: ['./requests-dialog.component.scss']
})
export class RequestsDialogComponent implements OnInit {

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  ngOnDestroy(): void {
    this.albumGalleryService.myAlbums = []
  }

  checkIfMembershipRequestEmpty(): boolean {
    return this.albumGalleryService.currentAlbum.membershipRequests.length == 0;
  }

  acceptButton(memberName: string): void {
    this.albumGalleryService.acceptUser(memberName);
  }

  declineButton(memberName: string): void {
    this.albumGalleryService.declineUser(memberName);
  }

}
