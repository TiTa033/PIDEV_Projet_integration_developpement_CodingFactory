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
      
      // Récupérer les QR Codes pour chaque certification
      this.certifications.forEach(cert => {
        if (cert.idCertification !== undefined) {
          this.certificationService.getQrCode(cert.idCertification).subscribe(qrData => {
            cert.qrCodeBase64 = 'data:image/png;base64,' + qrData;
          });
        }
      });      
    });
  }  

  share(certification: Certification) {
    const shareText = `Découvrez ma certification : ${certification.nom} obtenue chez ${certification.organisme}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareText)}`;
    window.open(linkedInUrl, '_blank');
  }  

  download(certification: Certification) {
    if (certification.idCertification) {
      this.certificationService.downloadCertification(certification.idCertification);
    }
  }  
}