import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { avatars } from '../../../interfaces-enums/avatar-list';


@Component({
  selector: 'app-avatar-selection-modal',
  templateUrl: './avatar-selection-modal.component.html',
  styleUrls: ['./avatar-selection-modal.component.scss']
})
export class AvatarSelectionModalComponent implements OnInit {
  avatarList: string[] = avatars;
  nbRows: number = 3;
  nbColumns: number = 3;
  selectedAvatar: number = 0;

  constructor(private dialogRef: MatDialogRef<AvatarSelectionModalComponent>) {}

  ngOnInit(): void {
      this.dialogRef.updateSize('75%', '60%');
  }

  selectAvatar(selected: number): void {
      this.clearSelection();
      const div = document.getElementById(selected.toString());
      if (div) div.className = 'selected';
      this.selectedAvatar = selected;
  }

  clearSelection(): void {
      const div = document.getElementById(this.selectedAvatar.toString());
      if (div) div.className = '';
  }

  confirmAvatar(): void {
      // Send selected avatar to related services using this.selectedAvatar
      console.log('Avatar ', this.selectedAvatar, ' à été selectionné!');
      this.dialogRef.close();
  }

}
