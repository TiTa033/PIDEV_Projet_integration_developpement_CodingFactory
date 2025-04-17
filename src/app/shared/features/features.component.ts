import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/services/project.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  project: any = {
    id: null,
    projectName: '',
    projectDescription: '',
    tags: '',
    files: []
  };
  projects: any[] = [];
  selectedFiles: File[] = [];
  isFormVisible: boolean = false; // Control form visibility
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
      (response) => {
        this.projects = response;
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible; // Toggle the visibility
    if (!this.isFormVisible) {
      this.resetProject(); // Reset form when hiding
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
      // Update existing project
      this.updateProject();
    } else {
      // Add new project
      this.projectService.addProject(formData).subscribe(
        (response) => {
          console.log('Project added successfully', response);
          this.loadProjects();
          this.isFormVisible = false; // Hide the form after successful addition
          this.resetProject(); // Reset the form after successful addition
        },
        (error) => {
          console.error('Error adding project', error);
        }
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
      this.keepOldFiles // This should be a boolean value
    ).subscribe(
      (response) => {
        console.log('Project updated successfully', response);
        this.loadProjects();
        this.isFormVisible = false; // Hide the form after successful update
        this.resetProject(); // Reset the form after successful update
      },
      (error) => {
        console.error('Error updating project', error);
      }
    );
  }

  selectProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe(
      (response) => {
        this.project = response; // Store project details
        this.selectedFiles = this.project.files || []; // Store file paths
        this.isProjectDetailsVisible = true; // Show the details section/modal
      },
      (error) => {
        console.error('Error fetching project details', error);
      }
    );
  }

  selectProjectForUpdate(project: any): void {
    this.project = { ...project }; // Clone project data to avoid reference issues
    this.isFormVisible = true; // Show the form for editing
    this.selectedFiles = this.project.files || []; // Load existing files if any
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(
        () => {
          console.log(`Project with ID ${id} deleted successfully`);
          this.loadProjects(); // Refresh project list after deletion
        },
        (error) => {
          console.error('Error deleting project', error);
        }
      );
    }
  }

  loadProjectById(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe(
      (response) => {
        console.log('Project fetched:', response);
        this.project = response; // Store the project data
      },
      (error) => {
        console.error('Error fetching project', error);
      }
    );
  }

  // New method to trigger download of project files
  downloadProjectFiles(projectId: number): void {
    this.projectService.downloadProjectFiles(projectId).subscribe(
      (fileBlob: Blob) => {
        const filename = `project_${projectId}_files.zip`; // Customize the filename
        const file = new Blob([fileBlob], { type: 'application/zip' });
        saveAs(file, filename); // Trigger the download
      },
      (error) => {
        console.error('Error downloading project files:', error);
      }
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
