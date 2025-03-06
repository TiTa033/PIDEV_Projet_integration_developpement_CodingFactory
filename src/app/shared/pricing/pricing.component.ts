import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationService } from 'src/app/services/certification.service';
import { Certification } from 'src/app/models/certification';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  certifications: Certification[] = [];
  editingCertification: Certification | null = null;
  newCertification: Certification = {
    nom: '',
    organisme: '',
    dateObtention: ''
};
private certificationService = inject(CertificationService);

  ngOnInit(): void {
    this.getCertifications();
  }

  getCertifications() {
    this.certificationService.getCertifications().subscribe((data) => {
      this.certifications = data;
    });
  }
}