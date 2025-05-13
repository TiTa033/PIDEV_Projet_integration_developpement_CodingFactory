import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EvaluationComponent implements OnInit {
getPageNumbers(): any {
throw new Error('Method not implemented.');
}
totalPages() {
throw new Error('Method not implemented.');
}
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  editedEvaluationId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  loading: boolean = false;
  
  editingEvaluation: Evaluation = this.createEmptyEvaluation();
  newEvaluation: Evaluation = this.createEmptyEvaluation();

  sortColumn: string = 'dateEvaluation';
  sortDirection: 'asc' | 'desc' = 'desc';
  activeFilter: 'all' | 'upcoming' | 'completed' = 'all';
  searchTerm: string = '';
  
  private evaluationService = inject(EvaluationService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadEvaluations();
  }

  private createEmptyEvaluation(): Evaluation {
    return {
      idEvaluation: 0,
      sujet: '',
      note: null,
      dateEvaluation: new Date(),
      location: '',
      latitude: 0,
      longitude: 0
    };
  }

  private safeDateParse(date: any): Date {
    try {
      if (date instanceof Date) return date;
      if (typeof date === 'string' || typeof date === 'number') {
        return new Date(date);
      }
      return new Date();
    } catch {
      return new Date();
    }
  }

  loadEvaluations(): void {
    this.loading = true;
    this.evaluationService.getAllEvaluations().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations.map(evaluation => ({
          ...evaluation,
          dateEvaluation: this.safeDateParse(evaluation.dateEvaluation)
        }));
        this.filterEvaluations(this.activeFilter);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading evaluations', err);
        this.toastr.error('Erreur lors du chargement des évaluations');
        this.loading = false;
      }
    });
  }

  addEvaluation(): void {
    if (!this.validateEvaluation(this.newEvaluation)) return;

    this.evaluationService.addEvaluation(this.newEvaluation).subscribe({
      next: () => {
        this.toastr.success('Évaluation ajoutée avec succès');
        this.loadEvaluations();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding evaluation', err);
        this.toastr.error(err.message || 'Erreur lors de l\'ajout');
      }
    });
  }

  private validateEvaluation(evaluation: Evaluation): boolean {
    if (!evaluation.sujet || !evaluation.location) {
      this.toastr.warning('Sujet et lieu sont obligatoires');
      return false;
    }

    if (evaluation.note !== null) {
      if (evaluation.note < 0 || evaluation.note > 20) {
        this.toastr.warning('La note doit être entre 0 et 20');
        return false;
      }
      
      if (evaluation.dateEvaluation > new Date()) {
        this.toastr.warning('Une évaluation future ne peut pas avoir de note');
        return false;
      }
    }
    return true;
  }

  public resetForm(): void {
    this.newEvaluation = this.createEmptyEvaluation();
  }

  startEdit(evaluation: Evaluation): void {
    this.editedEvaluationId = evaluation.idEvaluation || 0;
    this.editingEvaluation = {...evaluation};
  }

  updateEvaluation(): void {
    if (!this.editedEvaluationId) return;
    if (!this.validateEvaluation(this.editingEvaluation)) return;

    this.evaluationService.updateEvaluation(this.editingEvaluation).subscribe({
      next: () => {
        this.toastr.success('Évaluation mise à jour avec succès');
        this.loadEvaluations();
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Error updating evaluation', err);
        this.toastr.error(err.message || 'Erreur lors de la mise à jour');
      }
    });
  }

  cancelEdit(): void {
    this.editedEvaluationId = null;
    this.resetEditingForm();
  }

  private resetEditingForm(): void {
    this.editingEvaluation = this.createEmptyEvaluation();
  }

  deleteEvaluation(id?: number): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette évaluation?')) {
      this.evaluationService.deleteEvaluation(id).subscribe({
        next: () => {
          this.toastr.success('Évaluation supprimée avec succès');
          this.loadEvaluations();
        },
        error: (err) => {
          console.error('Error deleting evaluation', err);
          this.toastr.error('Erreur lors de la suppression');
        }
      });
    }
  }

  filterEvaluations(status: 'all' | 'upcoming' | 'completed'): void {
    this.activeFilter = status;
    const now = new Date();
    
    this.filteredEvaluations = this.evaluations.filter(e => {
      const evalDate = this.safeDateParse(e.dateEvaluation);
      
      if (status === 'upcoming') {
        return evalDate > now && (e.note === null || e.note === undefined);
      } else if (status === 'completed') {
        return evalDate <= now || (e.note !== null && e.note !== undefined);
      }
      return true;
    });
    
    this.totalItems = this.filteredEvaluations.length;
    this.currentPage = 1;
    this.sortData();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.sortData();
  }

  private sortData(): void {
    this.filteredEvaluations.sort((a, b) => {
      let valA = a[this.sortColumn as keyof Evaluation];
      let valB = b[this.sortColumn as keyof Evaluation];

      if (this.sortColumn === 'dateEvaluation') {
        valA = new Date(valA as string).getTime();
        valB = new Date(valB as string).getTime();
      }

      if (valA == null) return this.sortDirection === 'asc' ? 1 : -1;
      if (valB == null) return this.sortDirection === 'asc' ? -1 : 1;
      
      return this.sortDirection === 'asc' 
        ? valA > valB ? 1 : -1 
        : valA < valB ? 1 : -1;
    });
  }

  formatDateForInput(date: Date): string {
    if (!date) return '';
    const d = this.safeDateParse(date);
    return d.toISOString().substring(0, 10);
  }
  
  onDateChange(dateString: string, formType: 'new' | 'edit'): void {
    const date = dateString ? this.safeDateParse(dateString) : new Date();
    if (formType === 'new') {
      this.newEvaluation.dateEvaluation = date;
    } else {
      this.editingEvaluation.dateEvaluation = date;
    }
  }

  filterBySearch(): void {
    if (!this.searchTerm) {
      this.filterEvaluations(this.activeFilter);
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredEvaluations = this.evaluations.filter(e => 
      e.sujet.toLowerCase().includes(term) || 
      e.location.toLowerCase().includes(term) ||
      (e.note && e.note.toString().includes(term))
    );
    
    this.totalItems = this.filteredEvaluations.length;
    this.currentPage = 1;
  }

  // Pagination methods
  get paginatedEvaluations(): Evaluation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvaluations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  // Export methods
  exportToCSV(): void {
    const data = this.filteredEvaluations.map(e => ({
      Sujet: e.sujet,
      Note: e.note ?? '-',
      Date: this.formatDateForDisplay(e.dateEvaluation),
      Lieu: e.location,
      Latitude: e.latitude,
      Longitude: e.longitude
    }));

    const csv = this.convertToCSV(data);
    this.downloadFile(csv, 'evaluations.csv', 'text/csv');
  }

  exportToExcel(): void {
    const data = this.filteredEvaluations.map(e => ({
      Sujet: e.sujet,
      Note: e.note ?? '-',
      Date: this.formatDateForDisplay(e.dateEvaluation),
      Lieu: e.location,
      Latitude: e.latitude,
      Longitude: e.longitude
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Evaluations': worksheet }, SheetNames: ['Evaluations'] };
    XLSX.writeFile(workbook, 'evaluations.xlsx');
  }

  private convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray as any);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }

  private downloadFile(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private formatDateForDisplay(date: Date): string {
    if (!date) return '';
    const d = this.safeDateParse(date);
    return d.toLocaleDateString('fr-FR');
  }

  // Map related methods
  showOnMap(latitude: number, longitude: number): void {
    if (!latitude || !longitude) {
      this.toastr.warning('Coordonnées non disponibles');
      return;
    }
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  }

  // Statistics
  get averageNote(): number {
    const completed = this.evaluations.filter(e => e.note !== null && e.note !== undefined);
    if (completed.length === 0) return 0;
    const sum = completed.reduce((acc, curr) => acc + (curr.note || 0), 0);
    return parseFloat((sum / completed.length).toFixed(2));
  }

  get upcomingCount(): number {
    const now = new Date();
    return this.evaluations.filter(e => 
      this.safeDateParse(e.dateEvaluation) > now && 
      (e.note === null || e.note === undefined)
    ).length;
  }
}