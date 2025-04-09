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

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/retrieve-all-courses`);
  }

  rateCourse(courseId: number, rating: number): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/rate-course/${courseId}/${rating}`, {});
  }
}