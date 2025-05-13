import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPfeComponent } from './student-pfe.component';

describe('StudentPfeComponent', () => {
  let component: StudentPfeComponent;
  let fixture: ComponentFixture<StudentPfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
