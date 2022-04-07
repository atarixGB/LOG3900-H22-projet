import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-top-drawings',
  templateUrl: './top-drawings.component.html',
  styleUrls: ['./top-drawings.component.scss']
})
export class TopDrawingsComponent implements OnInit {

  constructor(public profileService: ProfileService, public albumGalleryService: AlbumGalleryService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.albumGalleryService.fetchTopDrawings(this.profileService.username);
  }

  ngOnDestroy(): void {
    this.albumGalleryService.topDrawingsData = [];
  }

  backToProfil(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

}
