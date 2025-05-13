import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorPfeComponent } from './tutor-pfe.component';

describe('TutorPfeComponent', () => {
  let component: TutorPfeComponent;
  let fixture: ComponentFixture<TutorPfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorPfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorPfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
