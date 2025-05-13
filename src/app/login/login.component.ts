import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  year = new Date().getFullYear();
  profile_image:string=''
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          console.log("✅ Token saved in localStorage:", response.access_token);

          try {
            const decodedToken: any = jwtDecode(response.access_token);
            console.log("🔍 Decoded Token:", decodedToken);

            if (decodedToken.id_user) {
              localStorage.setItem('userId', decodedToken.id_user.toString());
              console.log("✅ User ID saved:", decodedToken.id_user);
            }

            if (decodedToken.name) {
              localStorage.setItem('username', decodedToken.name);
              console.log("✅ Username saved:", decodedToken.name);
            }

            // ✅ Save profile image from token if available
            if (decodedToken.profileImage) {
              localStorage.setItem('profileImage', decodedToken.profileImage);
              console.log("✅ Profile image saved:", decodedToken.profileImage);
            } else {
              // Optional: Set default image if not provided
              console.warn("⚠️ Profile image not found in token. Default used.");
            }

            const userRole = decodedToken.role;
            if (userRole === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/']);
            }

          } catch (error) {
            console.error("❌ Error decoding token:", error);
          }
        } else {
          console.error("❌ No token found in response!");
        }
      },
      error => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }


}
