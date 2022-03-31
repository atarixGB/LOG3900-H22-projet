import { Component, OnInit } from '@angular/core';
import { avatars } from '@app/interfaces-enums/avatar-list';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { IUser } from '@app/interfaces-enums/IUser';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  user: IUser;
  stories: IDrawing[];
  currentStory: IDrawing;

  constructor() {
    this.stories = [];
    this.user = {
      identifier: 'Alexander Da Great',
      password: 'a',
      avatar: avatars[0],
      email: 'a',
    };

    
    for (let i = 0; i < 3; i++) {
      const drawing = {
        name: 'Drawing',
        owner: 'a',
        data: avatars[i],
      }
      this.stories.push(drawing);
    }
  }

  ngOnInit(): void {
    this.currentStory = this.stories[0];
  }

  changeStory(increment: number): void {
    const currentIndex = this.stories.indexOf(this.currentStory);
    if (currentIndex != 0 && currentIndex != this.stories.length - 1 || currentIndex == 0 && increment > 0 || currentIndex == this.stories.length - 1 && increment < 0) {
      this.currentStory = this.stories[currentIndex + increment]; 
    }
  }

}
