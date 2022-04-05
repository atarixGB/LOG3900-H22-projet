import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-left-dialog',
  templateUrl: './member-left-dialog.component.html',
  styleUrls: ['./member-left-dialog.component.scss']
})
export class MemberLeftDialogComponent implements OnInit {
  username: string;

  constructor() {}

  ngOnInit(): void {
  }

}
