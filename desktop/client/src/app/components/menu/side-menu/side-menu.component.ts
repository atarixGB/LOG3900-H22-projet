import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {}
}
