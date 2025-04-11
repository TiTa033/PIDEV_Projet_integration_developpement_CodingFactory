import { Component, Renderer2 } from '@angular/core';
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { NgClass, NgIf } from "@angular/common";  
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    ScrollToModule,
    NgClass,
    NgIf,
    FormsModule,
    RouterModule
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  username: string = ''; // ✅ Store username
  isLoggedIn: boolean = false;
  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router) { }
  profileImage: string | null = null; // ✅ Store profile image
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    console.log("🔵 User is authenticated:", this.isLoggedIn);
    this.loadUsername(); // ✅ Load username on init

    const preloaderElement = document.getElementById('preloader');
    if (preloaderElement) {
      this.renderer.removeClass(preloaderElement, 'd-none');
    }
    setTimeout(() => {
      if (preloaderElement) {
        this.renderer.addClass(preloaderElement, 'd-none');
      }
    }, 1000);
  }
  curentsection: string = 'home'; // ✅ Define the property

  onSectionChange(event: any) {
    this.curentsection = event;
  }
  windoscroll(): void {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('nav-sticky');
      if (backToTop) {
        backToTop.style.display = 'block';
      }
    } else {
      navbar?.classList.remove('nav-sticky');
      if (backToTop) {
        backToTop.style.display = 'none';
      }
    }
  }

  loadUsername(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername; // ✅ Set username if available
    }
  }
  toggleMenu(): void {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.username = ''; // ✅ Clear username on logout
    this.profileImage = null;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
  loadUserData(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) this.username = storedUsername;

    this.profileImage = this.authService.getProfileImage(); // ✅ Get image URL

    // ✅ If no image in localStorage, fetch from API
    if (!this.profileImage) {
      this.authService.getUserProfile().subscribe(
        (userData) => {
          this.profileImage = userData.profileImage;
        },
        (error) => console.error("Error fetching user profile:", error)
      );
    }
  }
}
