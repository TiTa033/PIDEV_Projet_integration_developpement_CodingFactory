import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStudentIdComponent } from './upload-student-id.component';

describe('UploadStudentIdComponent', () => {
  let component: UploadStudentIdComponent;
  let fixture: ComponentFixture<UploadStudentIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadStudentIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadStudentIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
