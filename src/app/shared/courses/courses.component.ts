import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { MeteoService } from 'src/app/services/meteo.service';
import { TwilioService } from 'src/app/services/twilio.service';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  allCourses: Course[] = [];
  courses: Course[] = [];
  searchText: string = '';
  favorites: Course[] = [];
  topRatedCourses: Course[] = [];
  newComments: { [key: number]: string } = {};
  comments: { [key: number]: { user: string, text: string }[] } = {};
  visibleComments: { [key: number]: number } = {};
  editingComment: { [courseId: number]: { [index: number]: boolean } } = {};
  messages: { text: string; sender: string }[] = [];
  userMessage: string = '';
  weatherData: any = null;
  toPhoneNumber: string = '';
  messageBody: string = '';

  constructor(
    private courseService: CourseService,
    private chatbotService: ChatbotService,
    private meteoService: MeteoService,
    private twilioService: TwilioService
  ) {}
  currentPage: number = 1;
  pageSize: number = 3;
  totalPages: number =  10;

  ngOnInit() {
    this.getCourses();
    this.loadFavorites();
    this.loadComments();
    this.getWeather('Tunis');
  }

// Récupération et pagination des cours

  getCourses(): void {
    this.courseService.getAllCourses().subscribe((data: Course[]) => {
      this.allCourses = data.sort((a, b) => b.rating - a.rating);
      this.topRatedCourses = this.allCourses.filter(course => course.rating >= 4);
      this.totalPages = Math.ceil(this.allCourses.length / this.pageSize);
      this.paginateCourses();
    });
  }

  paginateCourses() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.courses = this.allCourses.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateCourses();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateCourses();
    }
  }

// Rating

  rateCourse(course: Course, rating: number) {
    course.rating = rating;
  }

// Recherche

  filteredCourses(): Course[] {
    if (!this.searchText.trim()) {
      return this.courses;
    }
    return this.courses.filter(course =>
      course.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

// Gestion des favoris

  toggleFavorite(course: Course): void {
    const index = this.favorites.findIndex(fav => fav.idCourse === course.idCourse);
    if (index === -1) {
      this.favorites.push(course);
    } else {
      this.favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  isFavorite(course: Course): boolean {
    return this.favorites.some(fav => fav.idCourse === course.idCourse);
  }

  loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

// Partage sur reseaux sociaux

  shareCourse(course: Course): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this course: ${course.title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

// Gestion des commentaires

  editComment(courseId: number, commentIndex: number): void {
    if (!this.editingComment[courseId]) {
      this.editingComment[courseId] = {};
    }
    this.editingComment[courseId][commentIndex] = true;
  }

  saveComment(courseId: number, commentIndex: number): void {
    if (this.editingComment[courseId]?.[commentIndex]) {
      this.editingComment[courseId][commentIndex] = false;
      this.saveComments();
    }
  }

  addComment(courseId: number): void {
    if (!this.newComments[courseId]?.trim()) return;

    const newComment = { user: 'User', text: this.newComments[courseId].trim() };

    if (!this.comments[courseId]) {
      this.comments[courseId] = [];
    }
    this.comments[courseId].unshift(newComment);
    this.saveComments();
    this.newComments[courseId] = '';
    this.visibleComments[courseId] = Math.min(this.comments[courseId].length, 3);
  }

  deleteComment(courseId: number, commentIndex: number): void {
    if (this.comments[courseId]) {
      this.comments[courseId].splice(commentIndex, 1);
      this.saveComments();
    }
  }

  getComments(courseId: number): { user: string, text: string }[] {
    return this.comments[courseId]?.slice(0, this.visibleComments[courseId] || 3) || [];
  }

  showMoreComments(courseId: number): void {
    if (this.comments[courseId]) {
      this.visibleComments[courseId] = Math.min(this.comments[courseId].length, (this.visibleComments[courseId] || 3) + 3);
    }
  }

  generateAvatar(userName: string): string {
    return userName.charAt(0).toUpperCase();
  }

  saveComments(): void {
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }

  loadComments(): void {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      this.comments = JSON.parse(storedComments);
    }
  }

  updateCommentInput(courseId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.newComments[courseId] = inputElement.value;
  }

// Chatbot
  sendMessage() {
    if (this.userMessage.trim() === '') return;

    this.messages.push({ text: this.userMessage, sender: 'user' });

    this.chatbotService.sendMessage(this.userMessage).subscribe(response => {
      this.messages.push({ text: response.reply, sender: 'bot' });
    });

    this.userMessage = '';
  }

// Meteo

  getWeather(city: string): void {
    this.meteoService.getWeather(city).subscribe(
      (data) => {
        this.weatherData = data;
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }

  getWeatherInfo(): string {
    if (this.weatherData) {
      const weatherDescription = this.weatherData.weather[0].description;
      const iconUrl = `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}.png`;
      return `
        <div>
          <img src="${iconUrl}" alt="${weatherDescription}" />
          <p>Temperature: ${this.weatherData.main.temp}°C, Weather: ${weatherDescription}</p>
        </div>
      `;
    }
    return 'Weather data not available';
  }

  getWeatherIcon(): string {
    if (this.weatherData && this.weatherData.weather && this.weatherData.weather[0].icon) {
      return `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}.png`;
    }
    return '';
  }

// Envoi de SMS via Twilio

  sendSms() {
    if (this.toPhoneNumber && this.messageBody) {
      this.twilioService.sendSms(this.toPhoneNumber, this.messageBody).subscribe(
        (response: string) => {
          alert(response);
        },
        (error) => {
          alert('Failed to send SMS: ' + error.message);
        }
      );
    } else {
      alert('Please fill in both phone number and message body');
    }
  }
}
