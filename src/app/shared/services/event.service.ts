import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service'; // Import AuthService

export interface Event {
  id: number;
  eventName: string;
  eventDescription: string;
  organizer: string;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  registred: number;
  status: string;
  imagePath?: string; // Add this line for the image URL
  createdByUser?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8083/event/events'; // ✅ Updated base URL to match backend

  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  // Helper method to get the JWT token from AuthService
  getAuthToken(): string | null {
    const token = localStorage.getItem('token'); // Use 'token' here
    console.log('Retrieved token:', token);
    return token;
  }
  getUserId(): number | null {
    return this.authService.getUserId(); // Use AuthService to get the userID
  }

  // ✅ Get all events (no authentication needed)
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/getAllEvents`);
  }

  // ✅ Get event by ID (Optional, missing in controller but can be useful)
  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`);
  }

  // ✅ Add a new event (requires authentication)
  addEvent(event: Event, image: File): Observable<Event> {
    const userId = this.getUserId();
    const username = this.getUsername(); // Get username from local storage (or AuthService)

    if (!userId || !username) {
      console.error("❌ User ID or Username not found! Cannot add event.");
      return throwError('User ID or Username is missing');
    }

    // Add the username to the event data before sending it
    event.createdByUser = username; // Add the username to the event object

    const formData = new FormData();
    formData.append('event', new Blob([JSON.stringify(event)], { type: 'application/json' }));
    formData.append('image', image, image.name);

    const headers = new HttpHeaders({
      'userId': userId.toString()  // Pass userID in headers if needed
    });

    return this.http.post<Event>(`${this.apiUrl}/add-event`, formData, { headers });
  }

  getUsername(): string {
    // You can retrieve the username from the localStorage or AuthService
    return localStorage.getItem('username') || ''; // Or replace with this.authService.getUsername() if using AuthService
  }


  // ✅ Update an existing event (requires authentication)
  updateEvent(eventId: number, eventDetails: Event): Observable<Event> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.put<Event>(`${this.apiUrl}/updateEvent/${eventId}`, eventDetails, { headers });
  }

  // ✅ Delete an event (requires authentication)
  deleteEvent(eventId: number): Observable<void> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.delete<void>(`${this.apiUrl}/deleteEvent/${eventId}`, { headers });
  }

  // ✅ Search events by name (no authentication needed)
  searchEventsByName(name: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/searchByName?name=${name}`);
  }

  // ✅ Generate QR code for an event (no authentication needed)
  getEventQRCode(eventId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8083/event/events/events/${eventId}/qrcode`, {
      responseType: 'blob',
    });
  }

  // ✅ Get event statistics (requires authentication)
  getEventStatistics(): Observable<{ [key: string]: number }> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/statistics`, { headers });
  }

  // ✅ Get external scraped events (no authentication needed)
  getExternalEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scraped-events`);
  }
  participateInEvent(eventId: number): Observable<Blob> {
    const username = this.getUsername(); // get from localStorage
    const userId = this.getUserId();     // get and parse userId

    if (!username || userId === null || isNaN(userId)) {
      throw new Error('User information is missing or invalid.');
    }

    const headers = new HttpHeaders({
      'username': username,
      'userId': userId.toString()
    });

    return this.http.get(`${this.apiUrl}/participate/${eventId}`, {
      headers,
      responseType: 'blob'
    });
  }





}
