import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CandidatureService, Candidature } from 'src/app/services/candidature.service';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.service';
import { filter } from 'rxjs';
import { FilterPipe } from './pipe-filter/filter.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-candidature-management',
  standalone: true,
  templateUrl: './candidature-management.component.html',
  styleUrls: ['./candidature-management.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule,FilterPipe,NgxChartsModule,NgxPaginationModule]
})
export class CandidatureManagementComponent implements OnInit {
  candidatures: Candidature[] = [];
  users: User[] = [];
  selectedCandidature: Candidature | null = null;
  errorMessage: string = '';
  searchText: string = '';
  chartData: { name: string, value: number }[] = [];
  view: [number, number] = [700, 400]; // taille du graphique
  page: number = 1;

  // options ngx-charts
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  constructor(private candidatureService: CandidatureService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchCandidatures();
    this.fetchUsers();
    this.candidatureService.getStatByStatus().subscribe(data => {
      this.chartData = Object.entries(data).map(([status, count]) => ({
        name: status,
        value: count
      }));
    });
  
  }
 
  fetchCandidatures(): void {
    this.candidatureService.getAllCandidatures().subscribe(
      (data) => { this.candidatures = data;
        console.log('Fetched candidatures:', this.candidatures.length);
       },
      
      (error) => { this.errorMessage = 'Failed to load candidatures!'; }
    );
  }

  fetchUsers(): void {
    this.authService.getAllusers().subscribe(
      (data) => { this.users = data; },
      (error) => { this.errorMessage = 'Failed to load users!'; }
    );
  }

  deleteCandidature(id: number): void {
    if (confirm('Are you sure you want to delete this candidature?')) {
      this.candidatureService.deleteCandidature(id).subscribe(() => {
        this.fetchCandidatures();
      });
    }
  }
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe(() => {
        this.fetchUsers(); // Refresh the list after deletion
      });
    }
  }
  updateStatus(id: number, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as 'PENDING' | 'ACCEPTED' | 'REJECTED';
    this.candidatureService.updateStatus(id, newStatus).subscribe(() => {
      this.fetchCandidatures();
    });
  }

  viewDetails(candidature: Candidature): void {
    this.selectedCandidature = candidature;
  }
  downloadCvFile(id: number) {
    this.candidatureService.downloadCv(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv_${id}.pdf`; // Or use actual filename if you have it
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed', error);
    });
  }
}
