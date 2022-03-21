import { Injectable } from '@angular/core';
import * as sounds from '@app/constants/soundPaths';

@Injectable({
  providedIn: 'root'
})
export class SoundEffectsService {

  constructor() { }

  playSuccessSound(): void {
    let audio = new Audio();
    audio.src = sounds.SUCCESS;
    audio.load();
    audio.play();
  }

  playFailureSound(): void {
    let audio = new Audio();
    audio.src = sounds.FAILURE;
    audio.load();
    audio.play();
  }

  playSendMsgSound(): void {
    let audio = new Audio();
    audio.src = sounds.SEND_MSG;
    audio.load();
    audio.play();
  }

  playDrawSound(): void {
    let audio = new Audio();
    audio.src = sounds.DRAW;
    audio.load();
    audio.play();
  }
}
