import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { IUser } from '@app/interfaces-enums/IUser';
import { AdvancedResearchService } from '@app/services/advanced-research/advanced-research.service'
import { JoinRequestDialogComponent } from '../album-gallery/public-albums/join-request-dialog/join-request-dialog.component';

@Component({
  selector: 'app-advanced-research',
  templateUrl: './advanced-research.component.html',
  styleUrls: ['./advanced-research.component.scss']
})
export class AdvancedResearchComponent {
  searchBarInput: string;
  category: string;
  attribute: string;
  isValidInput: boolean;

  constructor(public advancedResearchService: AdvancedResearchService, public dialog: MatDialog) {
    this.searchBarInput = "";
    this.category = "albums";
    this.attribute = "name";
    this.isValidInput = false;
  }

  @HostListener('document:keyup.enter', ['$event'])
  onSearchBtn(): void {
    if (this.isOneKeywordOnly(this.searchBarInput)) {
      this.advancedResearchService.search(this.category, this.attribute, this.searchBarInput == "" ? null : this.searchBarInput)
    }
  }

  onCancelBtn(): void {
    this.searchBarInput = "";
    this.advancedResearchService.result = [];
  }

  changeCategory(value: string): void {
    this.advancedResearchService.result = [];
    this.category = value;

    if (this.category == "albums") {
      this.attribute = "name";
    } else if (this.category == "drawings") {
      this.attribute = "name"
    } else if (this.category == "users") {
      this.attribute = "identifier"
    }

    this.advancedResearchService.isAlbum = value == "albums";
    this.advancedResearchService.isDrawing = value == "drawings";
    this.advancedResearchService.isUser = value == "users";
  }

  changeAttribute(value: string): void {
    this.attribute = value;
  }

  onAlbumClick(album: IAlbum) : void {
    if (album != null) {
      this.dialog.open(JoinRequestDialogComponent, {
        data: album,
      });
    }
  }

  onDrawingClick(drawing: IDrawing) : void {
    console.log(drawing);
  }

  onUserClick(user: IUser) : void {
    console.log(user);
  }

  private isOneKeywordOnly(input: string): boolean {
    this.isValidInput = !(/\s/).test(input);
    return this.isValidInput;
  }
}
