import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8089/PIDEV/course';

  constructor(private http: HttpClient) {}

  // Get all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/retrieve-all-courses`);
  }

  // Add a new course
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/add-course`, course);
  }

  // Delete a course by id
  deleteCourse(idCourse: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-course/${idCourse}`);
  }

  // Update an existing course
  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/update-course`, course);
  }

  // Rate a course
  rateCourse(courseId: number, rating: number): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/rate-course/${courseId}/${rating}`, {});
  }
}