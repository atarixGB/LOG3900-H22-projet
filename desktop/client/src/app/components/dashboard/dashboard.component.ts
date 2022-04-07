import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInAnimation } from '@app/constants/animations';
import { CreateDrawingDialogComponent } from '@app/components/editor/create-drawing-dialog/create-drawing-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  displayCreateNewDrawingDialog(): void {
    this.router.navigate(['../editor'], { relativeTo: this.route });
    this.dialog.open(CreateDrawingDialogComponent, {
      width: "50%",
      disableClose: true
    });
  }

}
