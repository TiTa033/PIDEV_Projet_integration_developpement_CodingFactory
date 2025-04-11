import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtPayload, jwtDecode } from 'jwt-decode'; // ✅ Correct import
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/v1/auth';
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  constructor(private http: HttpClient) {}
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      console.error("❌ User ID not found in localStorage!");
      return null;
    }
  
    const parsedId = parseInt(userId, 10);
    console.log("✅ Retrieved userId:", parsedId);
    return parsedId;
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false; // ❌ No token, user is not authenticated

    try {
      const decoded: JwtPayload & { exp?: number } = jwtDecode(token);
      if (decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now; // ✅ Token is valid (not expired)
      }
      return false;
    } catch (error) {
      console.error('❌ Invalid token:', error);
      return false;
    }
  }

  getAllusers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiUrl}/all`);
    }
  
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((response: any) => {
        console.log("🔵 Login response:", response); // Debugging
  
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log("✅ Token saved!");
          const decodedToken: any = jwtDecode(response.access_token);
          localStorage.setItem('userId', decodedToken.userId.toString());
          
          // Decode the token
          const decoded: any = jwtDecode(response.access_token);
          if (decoded && decoded.userId) {
            localStorage.setItem('userId', decoded.userId.toString());
            console.log("✅ User ID saved:", decoded.userId);
          }
  
          // ✅ Store username (if backend sends it)
          if (response.firstname) {
            localStorage.setItem('username', response.firstname);
            console.log("✅ Username saved:", response.firstname);
          } else {
            console.warn("⚠️ Username not found in response!");
          }
        }
      })
    );
  }
  
  
  // ✅ Function to Get Username from Local Storage
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
  getUserProfile(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return new Observable(observer => { observer.error("User ID not found!"); observer.complete(); });

    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      tap((userData) => {
        if (userData.profileImage) {
          localStorage.setItem('profileImage', userData.profileImage); // ✅ Save image path
        }
      })
    );
  }

  getProfileImage(): string | null {
    return localStorage.getItem('profileImage'); // ✅ Retrieve profile image
  }
  
  
  
  changePassword(currentPassword: string, newPassword: string, confirmationPassword: string): Observable<any> {
    const userId = this.getUserId();  // ✅ Ensure userId is retrieved
  
    if (!userId) {
      console.error('❌ User ID not found in localStorage! Cannot change password.');
      return new Observable(observer => {
        observer.error('❌ User ID not found!');
        observer.complete();
      });
    }
  
    const requestBody = {
      userId: userId,  // ✅ Ensure userId is included
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmationPassword: confirmationPassword
    };
  
    console.log("📤 Sending PATCH request to change password with:", requestBody); // Debugging request
  
    return this.http.patch(`${this.apiUrl}/change-password`, requestBody, {
      headers: this.getAuthHeaders() // ✅ Ensure Authorization header is included
    });
  }
  
  
  
  
  
  
  
  
  

  logout(): void {
    localStorage.removeItem('token');
  }

  /*isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }*/

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Attach token to every request
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
        const decoded: JwtPayload & { userId?: number } = jwtDecode(token);
        return decoded.userId ?? null; // ✅ Ensure userId exists
    } catch (error) {
        console.error('Error decoding token', error);
        return null;
    }
}

}


