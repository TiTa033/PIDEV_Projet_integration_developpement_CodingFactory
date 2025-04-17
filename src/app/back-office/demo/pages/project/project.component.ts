// ✅ No import for FormData here! Make sure of that.

import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from 'src/app/shared/services/project.service';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { CommonModule, DatePipe } from '@angular/common'; // ✅ Import CommonModule


@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  imports: [    CommonModule, // ✅ This is what fixes *ngFor and *ngIf issues

    FormsModule,
    DatePipe
  ],
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  project: any = {
    id: null,
    projectName: '',
    projectDescription: '',
    tags: '',
    files: []
  };
  projects: any[] = [];
  selectedFiles: File[] = [];
  isFormVisible: boolean = false;
  keepOldFiles: boolean = true;
  isProjectDetailsVisible = false;
  filePaths: string[] = [];
  searchQuery: string = '';  // For binding the search input


  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (response) => this.projects = response,
      (error) => console.error('Error fetching projects', error)
    );
  }

  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetProject();
    }
  }

  resetProject(): void {
    this.project = {
      id: null,
      projectName: '',
      projectDescription: '',
      tags: '',
      files: []
    };
    this.selectedFiles = [];
  }

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    const formData = new FormData() as FormData;
    formData.append('projectName', this.project.projectName);
    formData.append('projectDescription', this.project.projectDescription);
    formData.append('tags', this.project.tags);

    for (let file of this.selectedFiles) {
      formData.append('files', file);
    }

    if (this.project.id) {
      this.updateProject();
    } else {
      this.projectService.addProject(formData).subscribe(
        (response) => {
          console.log('Project added successfully', response);
          this.loadProjects();
          this.isFormVisible = false;
          this.resetProject();
        },
        (error) => console.error('Error adding project', error)
      );
    }
  }

  updateProject(): void {
    const { projectName, projectDescription, tags } = this.project;
    const filesToSend = this.selectedFiles.length > 0 ? this.selectedFiles : [];

    this.projectService.updateProject(
      this.project.id,
      projectName,
      projectDescription,
      tags,
      filesToSend,
      this.keepOldFiles
    ).subscribe(
      (response) => {
        console.log('Project updated successfully', response);
        this.loadProjects();
        this.isFormVisible = false;
        this.resetProject();
      },
      (error) => console.error('Error updating project', error)
    );
  }

  selectProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe(
      (response) => {
        this.project = response;
        this.selectedFiles = this.project.files || [];
        this.isProjectDetailsVisible = true;
      },
      (error) => console.error('Error fetching project details', error)
    );
  }

  selectProjectForUpdate(project: any): void {
    this.project = { ...project };
    this.isFormVisible = true;
    this.selectedFiles = this.project.files || [];
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(
        () => {
          console.log(`Project with ID ${id} deleted successfully`);
          this.loadProjects();
        },
        (error) => console.error('Error deleting project', error)
      );
    }
  }

  loadProjectById(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe(
      (response) => {
        console.log('Project fetched:', response);
        this.project = response;
      },
      (error) => console.error('Error fetching project', error)
    );
  }

  downloadProjectFiles(projectId: number): void {
    this.projectService.downloadProjectFiles(projectId).subscribe(
      (fileBlob: Blob) => {
        const filename = `project_${projectId}_files.zip`;
        const file = new Blob([fileBlob], { type: 'application/zip' });
        saveAs(file, filename);
      },
      (error) => console.error('Error downloading project files:', error)
    );
  }
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.projectService.searchProjects(this.searchQuery).subscribe(
        (response) => {
          this.projects = response;
        },
        (error) => console.error('Error fetching search results', error)
      );
    } else {
      this.loadProjects();  // Reload all projects if search query is empty
    }
  }

}
