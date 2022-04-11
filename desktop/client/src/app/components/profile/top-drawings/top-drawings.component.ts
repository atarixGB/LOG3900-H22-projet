import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-top-drawings',
  templateUrl: './top-drawings.component.html',
  styleUrls: ['./top-drawings.component.scss']
})
export class TopDrawingsComponent implements OnInit {
  numberOfDrawingsToDisplay: number;
  drawingsToDisplay: IDrawing[];

  constructor(public profileService: ProfileService, public albumGalleryService: AlbumGalleryService, private route: ActivatedRoute, private router: Router) {
    this.drawingsToDisplay = [];
  }

  ngOnInit(): void {
    this.albumGalleryService.fetchTopDrawings(this.profileService.username);
  }

  ngOnDestroy(): void {
    this.drawingsToDisplay = [];
    this.albumGalleryService.topDrawingsData = [];
  }

  displayDrawings(quantity: number): void {
    this.numberOfDrawingsToDisplay = quantity;
    this.drawingsToDisplay = [];

    if (this.numberOfDrawingsToDisplay == -1) {
      this.drawingsToDisplay = this.albumGalleryService.topDrawingsData;
    } else {
      for (let i = 0; i < this.numberOfDrawingsToDisplay; i++) {
        if ( this.albumGalleryService.topDrawingsData[i] != undefined) {
          this.drawingsToDisplay.push(this.albumGalleryService.topDrawingsData[i]);
        }
      }
    }
  }

  backToProfil(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

  getUserProfileInfos(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

}
