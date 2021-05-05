import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCriteriaModalComponent } from './update-criteria-modal.component';

describe('UpdateCriteriaModalComponent', () => {
  let component: UpdateCriteriaModalComponent;
  let fixture: ComponentFixture<UpdateCriteriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCriteriaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCriteriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
