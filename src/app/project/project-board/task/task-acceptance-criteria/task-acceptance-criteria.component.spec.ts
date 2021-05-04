import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAcceptanceCriteriaComponent } from './task-acceptance-criteria.component';

describe('TaskAcceptanceCriteriaComponent', () => {
  let component: TaskAcceptanceCriteriaComponent;
  let fixture: ComponentFixture<TaskAcceptanceCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAcceptanceCriteriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAcceptanceCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
