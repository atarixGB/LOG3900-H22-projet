import { Component } from '@angular/core';
import { LoginService } from '@app/services/login/login.service';
import { ChatService } from '@app/services/chat/chat.service'
@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss']
})
export class ChatMenuComponent {

  constructor(private loginService: LoginService, private chatService: ChatService) { }

  joinDefaultChannel(): void {
    this.chatService.username = this.loginService.username;
    this.chatService.connectUser();
  }
}
