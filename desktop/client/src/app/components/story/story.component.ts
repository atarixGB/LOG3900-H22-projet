import { Component, OnInit } from '@angular/core';
import { avatars } from '@app/interfaces-enums/avatar-list';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { IUser } from '@app/interfaces-enums/IUser';
import { IProgressBar } from '@app/interfaces-enums/IProgress-bar';
import { interval, Observable, Subscription } from 'rxjs';

const DURATION = 5;
const INTERVAL_MS = 100;

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  user: IUser;
  stories: IDrawing[];
  progressBars: IProgressBar[];
  currentStoryIndex: number;

  sub: Subscription;
  timer$: Observable<number>

  constructor() {
    this.stories = [];
    this.progressBars = [];
    this.currentStoryIndex = 0;
    this.timer$ = interval(INTERVAL_MS);
    this.loadFakeDataForTests();
    this.startTimer();
  }

  // Dont forget to delete this
  loadFakeDataForTests(): void {
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
      this.progressBars.push({progress: 0});
    }
  }

  ngOnInit(): void {
  }

  changeStory(increment: number): void {
    this.sub.unsubscribe();
    this.progressBars.forEach(bar => {
      bar.progress = 0;
    });

    if (this.currentStoryIndex != 0 && this.currentStoryIndex != this.stories.length - 1 ||
        this.currentStoryIndex == 0 && increment > 0 ||
        this.currentStoryIndex == this.stories.length - 1 && increment < 0) {
      this.currentStoryIndex = this.currentStoryIndex + increment;
      this.startTimer(); 
    } else if (this.currentStoryIndex == this.stories.length - 1 && increment > 0) {
      // close dialog
    }
  }

  startTimer() {
    this.sub = this.timer$.subscribe((intervalNb) => {
      let sec = (intervalNb + 1) / 10; // 10 because triggered every tenths of a second
      
      this.progressBars[this.currentStoryIndex].progress =  sec * 100 / DURATION;
      if (sec === DURATION) {
        this.sub.unsubscribe();
        this.changeStory(1);
      }
    });
  }

}
