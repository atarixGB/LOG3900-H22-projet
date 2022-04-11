import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-like-snackbar',
  templateUrl: './like-snackbar.component.html',
  styleUrls: ['./like-snackbar.component.scss']
})
export class LikeSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

}
