// src/app/tutor-pfe/tutor-pfe.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PfeService } from 'src/pfe.service';
import { Etat, PFE, PfeTask } from 'src/pfe';

@Component({
  selector: 'app-tutor-pfe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor-pfe.component.html',
  styleUrls: ['./tutor-pfe.component.scss']
})
export class TutorPfeComponent implements OnInit {
  projects: PFE[] = [];
  selectedProject: PFE | null = null;
  newState: Etat | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  tutorId: number = 1; // Static tutor ID as per your setup

  constructor(private pfeService: PfeService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.pfeService.getAllProjetsForTutor(this.tutorId).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading projects: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  selectProject(project: PFE): void {
    this.selectedProject = { ...project }; // Create a copy to avoid direct mutation
    this.newState = this.selectedProject.etat;
  }

  evaluateProject(projectId: number): void {
    if (!this.newState) {
      this.errorMessage = 'Please select a state to evaluate.';
      return;
    }
    this.isLoading = true;
    this.pfeService.evaluerProjet(projectId, this.newState).subscribe({
      next: (updatedProject) => {
        this.projects = this.projects.map(p => p.id === updatedProject.id ? updatedProject : p);
        this.selectedProject = updatedProject;
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error evaluating project: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isTaskOverdue(task: PfeTask): boolean {
    const now = new Date();
    const deadline = new Date(task.deadline);
    return !task.completed && deadline < now;
  }

  getEtat(): Etat[] {
    return Object.values(Etat);
  }

}
