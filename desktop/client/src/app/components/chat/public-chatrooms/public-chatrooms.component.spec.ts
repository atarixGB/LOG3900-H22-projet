import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicChatroomsComponent } from './public-chatrooms.component';

describe('PublicChatroomsComponent', () => {
  let component: PublicChatroomsComponent;
  let fixture: ComponentFixture<PublicChatroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicChatroomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicChatroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
