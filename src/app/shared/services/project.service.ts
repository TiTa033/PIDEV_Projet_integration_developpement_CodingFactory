import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  projectName: string;
  projectDescription: string;
  tags: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8085/project/projects';  // Adjust URL as necessary

  constructor(private http: HttpClient) {}

  // Get all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/all-projects`);
  }

  // Get a specific project by ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/get-project/${id}`);
  }

  // Add a new project
  addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/add-project`, formData);
  }

  // Update an existing project
  updateProject(id: number, projectName: string, projectDescription: string, tags: string, files: File[], keepOldFiles: boolean): Observable<Project> {
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('tags', tags);

    // Add files to FormData
    for (let file of files) {
      formData.append('files', file);
    }

    // Pass FormData to the backend (no need to build this in the component)
    return this.http.put<Project>(`${this.apiUrl}/update-project/${id}`, formData, {
      params: { keepOldFiles: String(keepOldFiles) }
    });
  }


  // Delete a project by ID
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-project/${id}`);
  }

  // Search projects by tag
  searchProjectsByTag(tag: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/searchByTag`, {
      params: { tag }
    });
  }

  // Get files for a project (downloadable files)
  getProjectFiles(projectId: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/${projectId}/files`, {
      responseType: 'blob' as 'json' // Ensure it's returned as a Blob
    });
  }

  // Download all files for a project as a zip
  downloadProjectFiles(projectId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${projectId}/download`, {
      responseType: 'blob'
    });
  }
  searchProjects(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }
}
