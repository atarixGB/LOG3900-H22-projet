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
    console.log(this.albumGalleryService.currentAlbum.membershipRequests);
  }

  acceptButton(memberName: string): void {
    console.log(`${memberName} has been accepted in the album ${this.albumGalleryService.currentAlbum.name} by ${this.loginService.username}`);
  }

  declineButton(memberName: string): void {
    console.log(`${memberName} has been refused in the album ${this.albumGalleryService.currentAlbum.name} by ${this.loginService.username}`);
  }

}
