import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GET_ALL_USER_DRAWINGS_URL, GET_DRAWING_URL } from '@app/constants/api-urls';
import { CNV_HEIGTH, CNV_WIDTH } from '@app/constants/constants';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { StampService } from '@app/services/editor/tools/stamp/stamp.service';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-stamp-selection-dialog',
  templateUrl: './stamp-selection-dialog.component.html',
  styleUrls: ['./stamp-selection-dialog.component.scss']
})
export class StampSelectionDialogComponent implements OnInit {

  drawings: IDrawing[];

  constructor(private dialogRef: MatDialogRef<StampSelectionDialogComponent>, private httpClient: HttpClient, private profileService: ProfileService, public stampService: StampService) {
    this.drawings = [];
  }

  ngOnInit(): void {
    this.httpClient.get<IDrawing[]>(GET_ALL_USER_DRAWINGS_URL + `/${this.profileService.username}`).subscribe(
      (drawings: IDrawing[]) => {
        this.drawings = drawings;
        this.drawings.forEach(drawing => {
          this.httpClient.get(`${GET_DRAWING_URL}/${drawing._id}`).subscribe(
            (result: IDrawing) => {
              drawing.data = result.data;
            }
          );
        });
      }
    );
  }

  setStamp(drawing: IDrawing): void {
    this.stampService.img = new Image(CNV_WIDTH / 10, CNV_HEIGTH / 10);
    this.stampService.img.src = "data:image/png;base64," + drawing.data;
    this.dialogRef.close();
  }
}
