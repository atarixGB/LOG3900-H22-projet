import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-favorite-drawings',
  templateUrl: './favorite-drawings.component.html',
  styleUrls: ['./favorite-drawings.component.scss']
})
export class FavoriteDrawingsComponent implements OnInit {

  constructor(public profileService: ProfileService, public albumGalleryService: AlbumGalleryService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.albumGalleryService.fetchFavoriteDrawings(this.profileService.username);
  }

  ngOnDestroy(): void {
    this.albumGalleryService.favoriteDrawingsData = [];
  }

  backToProfil(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

  getUserProfileInfos(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

}
