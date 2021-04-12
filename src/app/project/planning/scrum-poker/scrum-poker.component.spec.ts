import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumPokerComponent } from './scrum-poker.component';

describe('ScrumPokerComponent', () => {
  let component: ScrumPokerComponent;
  let fixture: ComponentFixture<ScrumPokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrumPokerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrumPokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
