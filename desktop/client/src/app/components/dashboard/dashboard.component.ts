import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInAnimation } from '@app/constants/animations';
import { CreateDrawingDialogComponent } from '@app/components/editor/create-drawing-dialog/create-drawing-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@app/interfaces-enums/IUser';
import { StoryComponent } from '../story/story.component';
import { StoryService } from '@app/services/story/story.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class DashboardComponent implements AfterViewInit {

  constructor(public storyService: StoryService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.storyService.getUserStories();
  }

  displayStoriesDialog(user: IUser): void {
    this.storyService.getStoriesData(user);
    this.storyService.selectedUser = user;
    this.dialog.open(StoryComponent, {
      width: "40%",
      height: "90%"
    });
  } 

  displayCreateNewDrawingDialog(): void {
    this.router.navigate(['../editor'], { relativeTo: this.route });
    this.dialog.open(CreateDrawingDialogComponent, {
      width: "50%",
      disableClose: true
    });
  }

}
