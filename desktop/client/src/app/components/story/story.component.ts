import { Component } from '@angular/core';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { IUser } from '@app/interfaces-enums/IUser';
import { IProgressBar } from '@app/interfaces-enums/IProgress-bar';
import { interval, Observable, Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { StoryService } from '@app/services/story/story.service';
import { ActivatedRoute, Router } from '@angular/router';

const DURATION = 5;
const INTERVAL_MS = 100;

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent {
  user: IUser;
  stories: IDrawing[];
  progressBars: IProgressBar[];
  currentStoryIndex: number;

  sub: Subscription;
  timer$: Observable<number>

  constructor(private dialogRef: MatDialogRef<StoryComponent>, public storyService: StoryService, private router: Router, private route: ActivatedRoute) {
    this.progressBars = [];
    this.user = this.storyService.selectedUser;
    this.stories = this.storyService.userStories.get(this.user) as IDrawing[];
    for (let i = 0; i < this.stories.length; i++) {
      this.progressBars.push({progress: 0});
    }
    this.currentStoryIndex = 0;
    this.timer$ = interval(INTERVAL_MS);
    this.startTimer();
  }

  changeStory(increment: number): void {

    this.sub.unsubscribe();
    this.progressBars.forEach(bar => {
      bar.progress = 0;
    });

    if(this.stories.length == 1 || this.currentStoryIndex == this.stories.length - 1 && increment > 0) {
      this.dialogRef.close();
    } else if (this.currentStoryIndex != 0 && this.currentStoryIndex != this.stories.length - 1 ||
        this.currentStoryIndex == 0 && increment > 0 ||
        this.currentStoryIndex == this.stories.length - 1 && increment < 0) {
      this.currentStoryIndex = this.currentStoryIndex + increment;
      this.startTimer();
    }
  }

  startTimer() {
    this.sub = this.timer$.subscribe((intervalNb) => {
      let sec = (intervalNb + 1) / 10; // because triggered every tenths of a second
      this.progressBars[this.currentStoryIndex].progress =  sec * 100 / DURATION;
      if (sec === DURATION) {
        this.sub.unsubscribe();
        this.changeStory(1);
      }
    });
  }

  getUserProfileInfos(username: string): void {
    this.dialogRef.close();
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }

}
