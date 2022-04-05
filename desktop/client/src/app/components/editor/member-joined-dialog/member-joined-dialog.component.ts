import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-joined-dialog',
  templateUrl: './member-joined-dialog.component.html',
  styleUrls: ['./member-joined-dialog.component.scss']
})
export class MemberJoinedDialogComponent implements OnInit {
  username: string;

  constructor() { }

  ngOnInit(): void {
  }

}
