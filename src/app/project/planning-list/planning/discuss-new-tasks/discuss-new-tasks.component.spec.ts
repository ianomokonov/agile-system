import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussNewTasksComponent } from './discuss-new-tasks.component';

describe('DiscussNewTasksComponent', () => {
  let component: DiscussNewTasksComponent;
  let fixture: ComponentFixture<DiscussNewTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussNewTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussNewTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
