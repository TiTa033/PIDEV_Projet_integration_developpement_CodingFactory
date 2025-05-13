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
  // Données originales
  allCertifications: Certification[] = [];
  // Données filtrées et paginées
  certifications: Certification[] = [];
  
  editingCertification: Certification | null = null;
  newCertification: Certification = {
    nom: '',
    organisme: '',
    dateObtention: ''
  };

  // OCR
  selectedPdf: File | null = null;
  ocrResult: string | null = null;
  isOcrLoading = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  
  // Filtres
  searchTerm = '';
  sortField: keyof Certification | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  private certificationService = inject(CertificationService);

  ngOnInit(): void {
    this.getCertifications();
  }

  getCertifications() {
    this.certificationService.getCertifications().subscribe((data) => {
      this.allCertifications = data;
      this.totalItems = data.length;
      this.applyFilters();
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

  onPdfSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdf = file;
    } else {
      alert('Veuillez sélectionner un fichier PDF valide');
      this.selectedPdf = null;
    }
  }

verifyCertification(): void {
  if (!this.selectedPdf) {
    alert('Veuillez sélectionner un fichier PDF');
    return;
  }

  this.isOcrLoading = true;
  this.ocrResult = null;

  this.certificationService.verifyCertificationFromPdf(this.selectedPdf)
    .subscribe({
      next: (result) => {
        this.ocrResult = result;
        this.isOcrLoading = false;
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        this.ocrResult = `Erreur lors de la vérification: ${err.status} - ${err.statusText}`;
        this.isOcrLoading = false;
        
        // Affichez plus de détails d'erreur si disponibles
        if (err.error) {
          try {
            const errorObj = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
            this.ocrResult += `\nDétails: ${errorObj.message || JSON.stringify(errorObj)}`;
          } catch (e) {
            this.ocrResult += `\nDétails: ${err.error}`;
          }
        }
      }
    });
}

  // Fonctions de filtrage et tri
  applyFilters() {
    let filtered = [...this.allCertifications];
    
    // Filtre de recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cert => 
        (cert.nom?.toLowerCase().includes(term) || 
        cert.organisme?.toLowerCase().includes(term) ||
        cert.dateObtention?.toLowerCase().includes(term)) ?? false
      );
    }
    
    // Tri
    if (this.sortField) {
      filtered.sort((a, b) => {
        const valueA = a[this.sortField as keyof Certification] ?? '';
        const valueB = b[this.sortField as keyof Certification] ?? '';
        
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    this.totalItems = filtered.length;
    
    // Pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.certifications = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  sort(field: keyof Certification) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Statistiques simples
  get stats() {
    return {
      total: this.allCertifications.length,
      byOrganisme: this.countBy('organisme'),
      byYear: this.countByYear()
    };
  }

  private countBy(field: keyof Certification): {[key: string]: number} {
    return this.allCertifications.reduce((acc, cert) => {
      const key = cert[field] as string;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
  }

  private countByYear(): {[key: string]: number} {
    return this.allCertifications.reduce((acc, cert) => {
      const year = cert.dateObtention ? cert.dateObtention.split('-')[0] : 'Inconnu';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}