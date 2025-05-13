import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface CourseForm extends Course {
  tagsInput: string;
}

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss'],
})
export default class SamplePageComponent implements OnInit {
  courses: Course[] = [];
  editingCourse: CourseForm | null = null;
  newCourse: CourseForm = { 
    idCourse: 0, 
    title: '', 
    description: '', 
    objectives: '', 
    tags: [], 
    rating: 0, 
    ratingCount: 0,
    tagsInput: ''
  }; 

  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.courseService.getAllCourses().subscribe((data) => {
      this.courses = data;
    });
  }

  addCourse() {
    this.convertTagsInput(this.newCourse);
    if (!this.validateCourse(this.newCourse)) {
      alert('Please fill in all fields correctly before adding a course.');
      return;
    }

    const { tagsInput, ...courseToAdd } = this.newCourse;
    this.courseService.addCourse(courseToAdd).subscribe(() => {
      this.getCourses();
      this.resetNewCourseForm();
    });
  }

  deleteCourse(idCourse?: number) {
    if (!idCourse) return;

    this.courseService.deleteCourse(idCourse).subscribe(() => {
      this.getCourses();
    });
  }

  editCourse(course: Course) {
    this.editingCourse = { 
      ...course,
      tagsInput: course.tags.join(', ')
    };
  }

  updateCourse() {
    if (!this.editingCourse || !this.validateCourse(this.editingCourse)) {
      alert('Please fill in all fields correctly before updating a course.');
      return;
    }

    this.convertTagsInput(this.editingCourse);
    const { tagsInput, ...courseToUpdate } = this.editingCourse;
    this.courseService.updateCourse(courseToUpdate).subscribe(() => {
      this.getCourses();
      this.editingCourse = null;
    });
  }

  cancelEdit() {
    this.editingCourse = null;
  }

  private convertTagsInput(course: CourseForm) {
    if (course.tagsInput) {
      course.tags = course.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }
  }

  private resetNewCourseForm() {
    this.newCourse = { 
      idCourse: 0, 
      title: '', 
      description: '', 
      objectives: '', 
      tags: [], 
      rating: 0, 
      ratingCount: 0,
      tagsInput: ''
    };
  }

  validateCourse(course: Course): boolean {
    return (
      course.title.trim().length >= 5 && course.title.trim().length <= 100 &&
      course.description.trim().length >= 10 && course.description.trim().length <= 500 &&
      course.objectives.trim().length >= 10 && course.objectives.trim().length <= 300 &&
      course.tags.length > 0 && // At least one tag
      course.rating >= 0 && course.rating <= 5 &&
      course.ratingCount >= 0
    );
  }
}