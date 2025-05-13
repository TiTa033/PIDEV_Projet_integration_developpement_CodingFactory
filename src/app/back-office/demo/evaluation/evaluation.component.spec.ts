import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationComponent } from './evaluation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EvaluationService } from '../../../services/evaluation.service'; // Adjusted path

describe('EvaluationComponent', () => {
  let component: EvaluationComponent;
  let fixture: ComponentFixture<EvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluationComponent],
      imports: [HttpClientTestingModule],
      providers: [EvaluationService]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});