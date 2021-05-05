import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEpicsComponent } from './edit-epics.component';

describe('EditEpicsComponent', () => {
  let component: EditEpicsComponent;
  let fixture: ComponentFixture<EditEpicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEpicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEpicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
