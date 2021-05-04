import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAcceptanceTestsComponent } from './task-acceptance-tests.component';

describe('TaskAcceptanceTestsComponent', () => {
  let component: TaskAcceptanceTestsComponent;
  let fixture: ComponentFixture<TaskAcceptanceTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAcceptanceTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAcceptanceTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
