import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PUBLIC_ALBUM } from '@app/constants/constants';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { LoginService } from '@app/services/login/login.service';
import { AlbumSettingsDialogComponent } from './album-settings-dialog/album-settings-dialog.component';
import { MembersListDialogComponent } from './members-list-dialog/members-list-dialog.component';
import { RequestsDialogComponent } from './requests-dialog/requests-dialog.component';

@Component({
  selector: 'app-drawings-view',
  templateUrl: './drawings-view.component.html',
  styleUrls: ['./drawings-view.component.scss']
})
export class DrawingsViewComponent {
  isCurrentAlbumMine: boolean;
  isPublicAlbum: boolean;

  constructor(
    public albumGalleryService: AlbumGalleryService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public collaborationService: CollaborationService,
    private drawingService: DrawingService) {
    this.isCurrentAlbumMine = this.loginService.username == albumGalleryService.currentAlbum.owner;
    this.isPublicAlbum = albumGalleryService.currentAlbum.name == PUBLIC_ALBUM.name;
  }

  ngAfterViewInit(): void {
    this.albumGalleryService.fetchDrawingsFromSelectedAlbum(this.albumGalleryService.currentAlbum);
  }

  viewMembersList(): void {
    this.dialog.open(MembersListDialogComponent, {});
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(AlbumSettingsDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.router.navigate(['../my-albums'], { relativeTo: this.route });
    })
  }

  viewRequests(): void {
    this.dialog.open(RequestsDialogComponent, {});
  }

  leaveAlbumButton(): void {
    console.log("Leaving album");
    this.albumGalleryService.leaveAlbum(this.albumGalleryService.currentAlbum);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }

  deleteAlbumButton(): void {
    console.log(`Deleted album id : ${this.albumGalleryService.currentAlbum._id}`);
    this.albumGalleryService.deleteAlbum(this.albumGalleryService.currentAlbum._id);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }

  onLikeBtn(drawing: IDrawing): void {
    console.log(`Le dessin ${drawing.name} a été aimé par ${this.loginService.username}.`);
    this.albumGalleryService.likeDrawing(drawing);
  }

  onShareBtn(drawing: IDrawing): void {
    console.log(`Partage du dessin ${drawing.name} sur Dropbox ou OneDrive...`);
  }

  getUserProfileInfos(username: string): void {
    console.log("Get info of", username);
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

  enterCollab(drawing: IDrawing): void {
    this.albumGalleryService.currentDrawing = drawing;
    this.drawingService.setCurrentDrawing(drawing);
    this.collaborationService.joinCollab(drawing._id);
  }

  openChangeNameDialog(drawing: IDrawing): void {
    console.log("Change name...");

  }

  openChangeAlbumDialog(drawing: IDrawing): void {
    console.log("Change album...");

  }

  openDeleteConfirmationDialog(drawing: IDrawing): void {
    console.log("Delete drawing...");

  }
}
