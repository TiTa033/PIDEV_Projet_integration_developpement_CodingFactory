import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificationComponent } from './certification.component';
import { CertificationService } from 'src/app/services/certification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CertificationComponent', () => {
  let component: CertificationComponent;
  let fixture: ComponentFixture<CertificationComponent>;
  let mockService: jasmine.SpyObj<CertificationService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('CertificationService', ['getCertifications', 'addCertification', 'deleteCertification', 'updateCertification']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [CertificationComponent],
      providers: [{ provide: CertificationService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load certifications on init', () => {
    const mockCertifications = [{ idCertification: 1, name: 'AWS', description: 'Cloud Certification', dateObtention: '2023-01-01' }];
    mockService.getCertifications.and.returnValue(of(mockCertifications));

    component.ngOnInit();
    expect(component.certifications.length).toBe(1);
    expect(component.certifications[0].name).toBe('AWS');
  });

  it('should add a certification', () => {
    const newCert = { name: 'Azure', description: 'Cloud Expert', dateObtention: '2024-06-01' };
    mockService.addCertification.and.returnValue(of(newCert));

    component.newCertification = newCert;
    component.addCertification();

    expect(mockService.addCertification).toHaveBeenCalledWith(newCert);
  });

  it('should delete a certification', () => {
    mockService.deleteCertification.and.returnValue(of(null));

    component.deleteCertification(1);
    expect(mockService.deleteCertification).toHaveBeenCalledWith(1);
  });

  it('should edit and update a certification', () => {
    const editedCert = { idCertification: 1, name: 'GCP', description: 'Google Cloud', dateObtention: '2023-05-10' };
    mockService.updateCertification.and.returnValue(of(editedCert));

    component.editCertification(editedCert);
    expect(component.editingCertification?.name).toBe('GCP');

    component.updateCertification();
    expect(mockService.updateCertification).toHaveBeenCalledWith(editedCert);
  });
});


