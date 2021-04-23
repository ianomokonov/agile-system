import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishDailyModalComponent } from './finish-daily-modal.component';

describe('FinishDailyModalComponent', () => {
  let component: FinishDailyModalComponent;
  let fixture: ComponentFixture<FinishDailyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishDailyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishDailyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
