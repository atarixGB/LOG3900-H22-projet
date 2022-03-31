import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInAnimation } from '@app/constants/animations';
import { CreateDrawingDialogComponent } from '@app/components/editor/create-drawing-dialog/create-drawing-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@app/interfaces-enums/IUser';
import { avatars } from '@app/interfaces-enums/avatar-list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class DashboardComponent implements OnInit {
  users: IUser[];

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute) { 
    this.users = [];
    let templateUser: IUser = {
      identifier: 'a',
      password: 'a',
      avatar: avatars[0],
      email: 'a',
    }
    for(let i = 0; i < 3; i++) {
      this.users.push(templateUser);
    }
  }

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
