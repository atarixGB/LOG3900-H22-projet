import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent {
  @Output() usernameEvent = new EventEmitter<string>();

  username: string = '';

  setUsername(): void {
    this.usernameEvent.emit(this.username);
  }

}
