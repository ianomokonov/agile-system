import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleFileUploaderComponent } from './multiple-file-uploader.component';

describe('MultipleFileUploaderComponent', () => {
  let component: MultipleFileUploaderComponent;
  let fixture: ComponentFixture<MultipleFileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleFileUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
