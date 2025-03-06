import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationService } from 'src/app/services/certification.service';
import { Certification } from 'src/app/models/certification';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
})
export class CertificationComponent implements OnInit {
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

  addCertification() {
    if (!this.newCertification.nom || !this.newCertification.organisme || !this.newCertification.dateObtention) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    this.certificationService.addCertification(this.newCertification).subscribe(() => {
      this.getCertifications();
      this.newCertification = { nom: '', organisme: '', dateObtention: '' };
    });
  }

  deleteCertification(idCertification?: number) {
    if (!idCertification) return;

    this.certificationService.deleteCertification(idCertification).subscribe(() => {
      this.getCertifications();
    });
  }

  editCertification(certification: Certification) {
    this.editingCertification = { ...certification };
  }

  updateCertification() {
    if (!this.editingCertification) return;

    this.certificationService.updateCertification(this.editingCertification).subscribe(() => {
      this.getCertifications();
      this.editingCertification = null;
    });
  }

  cancelEdit() {
    this.editingCertification = null;
  }
}