import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/v1/auth';

  constructor(private http: HttpClient) {}

  // ✅ Attach token to every request
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ✅ Get logged-in user profile
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  // ✅ Update user profile
  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user, { headers: this.getAuthHeaders() });
  }

  // ✅ Upload profile image
 /* uploadProfileImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<string>(`${this.apiUrl}/profile/upload`, formData, {
      headers: this.getAuthHeaders()
    });
  }*/
    // ✅ Get userId from token
    getUserId(): number | null {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error("❌ User ID not found in localStorage!");
          return null;
        }

        console.log("✅ Retrieved userId from localStorage:", userId);
        return parseInt(userId, 10);
      }


  // ✅ Upload profile image (uses userId from token)
  uploadProfileImage(imageFile: File): Observable<any> {
    const userId = this.getUserId(); // ✅ Get userId from localStorage
    if (!userId) {
      console.error("❌ Cannot upload image: User ID not found!");
      return throwError(() => new Error("User ID not found!"));
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    console.log("🟢 Sending upload request for user ID:", userId);

    return this.http.post<any>(`${this.apiUrl}/${userId}/profile/upload`, formData);
}



}
