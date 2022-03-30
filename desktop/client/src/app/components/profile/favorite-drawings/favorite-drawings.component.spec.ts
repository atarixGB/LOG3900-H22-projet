import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteDrawingsComponent } from './favorite-drawings.component';

describe('FavoriteDrawingsComponent', () => {
  let component: FavoriteDrawingsComponent;
  let fixture: ComponentFixture<FavoriteDrawingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteDrawingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteDrawingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
