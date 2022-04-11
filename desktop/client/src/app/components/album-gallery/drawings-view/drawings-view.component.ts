import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PUBLIC_ALBUM } from '@app/constants/constants';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { LoginService } from '@app/services/login/login.service';
import { AlbumSettingsDialogComponent } from './album-settings-dialog/album-settings-dialog.component';
import { ChangeAlbumDialogComponent } from './change-album-dialog/change-album-dialog.component';
import { ChangeDrawingNameDialogComponent } from './change-drawing-name-dialog/change-drawing-name-dialog.component';
import { DeleteDrawingDialogComponent } from './delete-drawing-dialog/delete-drawing-dialog.component';
import { LikeSnackbarComponent } from './like-snackbar/like-snackbar.component';
import { MembersListDialogComponent } from './members-list-dialog/members-list-dialog.component';
import { RequestsDialogComponent } from './requests-dialog/requests-dialog.component';

@Component({
  selector: 'app-drawings-view',
  templateUrl: './drawings-view.component.html',
  styleUrls: ['./drawings-view.component.scss']
})
export class DrawingsViewComponent implements AfterViewInit {
  readonly SNACKBAR_DURATION = 5;
  isCurrentAlbumMine: boolean;
  isPublicAlbum: boolean;

  constructor(
    public albumGalleryService: AlbumGalleryService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public collaborationService: CollaborationService,
    private drawingService: DrawingService) {
    this.isCurrentAlbumMine = window.localStorage.getItem("username") == albumGalleryService.currentAlbum.owner;
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
    this.albumGalleryService.leaveAlbum(this.albumGalleryService.currentAlbum);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }

  deleteAlbumButton(): void {
    this.albumGalleryService.deleteAlbum(this.albumGalleryService.currentAlbum._id);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }

  onLikeBtn(drawing: IDrawing): void {
    let data = {
      drawingName: drawing.name,
      isAlreadyLiked: false
    }

    this.albumGalleryService.updateLikes(drawing);

    setTimeout(()=> {
      console.log("this.albumGalleryService.isAlreadyLike", this.albumGalleryService.isAlreadyLike)
      data.isAlreadyLiked = this.albumGalleryService.isAlreadyLike

      const snackBarRef = this.snackbar.openFromComponent( LikeSnackbarComponent,{
        duration: this.SNACKBAR_DURATION * 1000,
        data: data,
      })

      snackBarRef.afterDismissed().subscribe(()=> {
        this.ngAfterViewInit();
      })
    }, 200)

  }

  // onShareBtn(drawing: IDrawing): void {
  //   console.log(`Partage du dessin ${drawing.name} sur Dropbox ou OneDrive...`);
  // }

  getUserProfileInfos(username: string): void {
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

  enterCollab(drawing: IDrawing): void {
    this.albumGalleryService.currentDrawing = drawing;
    this.drawingService.setCurrentDrawing(drawing);
    this.collaborationService.joinCollab(drawing._id);
    localStorage.setItem('currentDrawingName', drawing.name);
  }

  openChangeNameDialog(drawing: IDrawing): void {
    this.dialog.open(ChangeDrawingNameDialogComponent, {
      data: drawing
    });
  }

  openChangeAlbumDialog(drawing: IDrawing): void {
    this.dialog.open(ChangeAlbumDialogComponent, {
      data: drawing
    });
  }

  openDeleteConfirmationDialog(drawing: IDrawing): void {
    this.dialog.open(DeleteDrawingDialogComponent, {
      data: drawing,
    });
  }

  drawingIsMine(drawing: IDrawing): boolean {
    return drawing.owner == this.loginService.username;
  }
}
