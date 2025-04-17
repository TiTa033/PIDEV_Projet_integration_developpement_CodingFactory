import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CandidatureService, Candidature } from 'src/app/services/candidature.service';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.service';
import { FilterPipe } from './pipe-filter/filter.pipe';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartConfiguration, ChartType } from 'chart.js';
import { SubmissionStat } from 'src/app/submission-stats.model';

@Component({
  selector: 'app-candidature-management',
  standalone: true,
  templateUrl: './candidature-management.component.html',
  styleUrls: ['./candidature-management.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, FilterPipe, NgChartsModule, NgxPaginationModule]
})
export class CandidatureManagementComponent implements OnInit {
  candidatures: Candidature[] = [];
  users: User[] = [];
  selectedCandidature: Candidature | null = null;
  errorMessage: string = '';
  searchText: string = '';
  page: number = 1;
  statusFilter: string = '';
  stats: SubmissionStat[] = [];

  // ng2-charts config
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: '# of Submissions',
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private candidatureService: CandidatureService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchCandidatures();
    this.fetchUsers();
    this.loadStats();
  }

  loadStats() {
    this.candidatureService.getWeeklySubmissionStats().subscribe((stats: SubmissionStat[]) => {
      this.stats = stats;
      this.lineChartData.labels = stats.map(s => s.date);
      this.lineChartData.datasets[0].data = stats.map(s => s.count);
      this.chart?.update();
    });
  }

  filteredCandidatures(): Candidature[] {
    return this.candidatures.filter(c => {
      const matchesStatus = this.statusFilter ? c.status === this.statusFilter : true;
      const matchesSearch = this.searchText
        ? c.email.toLowerCase().includes(this.searchText.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }

  fetchCandidatures(): void {
    this.candidatureService.getAllCandidatures().subscribe(
      (data) => { this.candidatures = data; },
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
        this.fetchUsers();
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
      a.download = `cv_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed', error);
    });
  }
}
