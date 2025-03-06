import { ComponentFixture, TestBed } from '@angular/core/testing';
import  { EvaluationComponent } from './evaluation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Ensure HttpClient module for service testing
import { EvaluationService } from 'src/app/services/evaluation.service'; // Adjust the path as necessary

describe('EvaluationComponent', () => {
  let component: EvaluationComponent;
  let fixture: ComponentFixture<EvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluationComponent], // Ensure the component is declared
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule to mock HTTP calls
      providers: [EvaluationService] // Provide the service if necessary
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
