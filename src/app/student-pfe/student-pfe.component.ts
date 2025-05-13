// src/app/components/student-pfe/student-pfe.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PFE, PfeTask } from '../pfe';
import { PfeService } from '../pfe.service';

@Component({
  selector: 'app-student-pfe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-pfe.component.html',
  styleUrls: ['./student-pfe.component.scss']
})
export class StudentPfeComponent implements OnInit {
  project: PFE | null = null;
  selectedFile: File | null = null;
  plagiarismResult: any | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  etudiantId: number = 1; // Static student ID as per DataInitializer

  constructor(private pfeService: PfeService) {}

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject(): void {
    this.isLoading = true;
    this.pfeService.getProjetByEtudiant(this.etudiantId).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading project: ' + err.message;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.includes('pdf')) {
        this.errorMessage = 'Please upload a PDF file.';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.plagiarismResult = null; // Reset plagiarism result when a new file is selected
    }
  }

  checkPlagiarism(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to check for plagiarism.';
      return;
    }
    this.isLoading = true;
    this.pfeService.checkPlagiarism(this.selectedFile).subscribe({
      next: (result) => {
        this.plagiarismResult = result;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Error checking plagiarism: ' + err.error.message;
        this.isLoading = false;
      }
    });
  }

  uploadReport(projetId: number): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }
    this.isLoading = true;
    this.pfeService.deposerRapport(projetId, this.selectedFile).subscribe({
      next: (updatedProject) => {
        this.project = updatedProject;
        this.selectedFile = null;
        this.plagiarismResult = null;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Error uploading report: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  isTaskOverdue(task: PfeTask): boolean {
    const now = new Date();
    const deadline = new Date(task.deadline);
    return !task.completed && deadline < now;
  }
}