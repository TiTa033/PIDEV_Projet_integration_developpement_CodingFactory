import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  
})
export class ProfileComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmationPassword: string = '';
  user: User = { id: 0, firstname: '', lastname: '', email: '', profileImage: '' };
  selectedFile: File | null = null;
  userId: number = 0; // ✅ Store userId dynamically
  successMessage = '';
  errorMessage = '';
  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    setTimeout(() => {  
      const retrievedId = this.authService.getUserId();
      
      if (retrievedId === null) {
        this.errorMessage = '❌ User ID not found!';
        console.error(this.errorMessage);
        this.userId = 0; 
      } else {
        this.userId = retrievedId;
        console.log("✅ Retrieved userId:", this.userId);
      }
    }, 500); 
  }

  // ✅ Load profile
  loadProfile(): void {
    this.userService.getProfile().subscribe(
      (data) => this.user = data,
      (error) => this.errorMessage = 'Failed to load profile'
    );
  }

  // ✅ Handle file selection
 
  // ✅ Upload profile image
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      this.errorMessage = "❌ Please select an image!";
      return;
    }
  
    const userId = this.userService.getUserId();
    if (!userId) {
      this.errorMessage = "❌ User ID not found! Cannot upload image.";
      console.error(this.errorMessage);
      return;
    }
  
    console.log("🟢 Uploading image for user ID:", userId);
  
    this.userService.uploadProfileImage(this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = response.message;  // ✅ Read message from JSON response
        console.log("✅ Image uploaded successfully:", response.filePath);
      },
      error: (error) => {
        this.errorMessage = '❌ Failed to upload image';
        console.error(error);
      }
    });
}

  

  // ✅ Update profile
  updateProfile(): void {
    this.userService.updateProfile(this.user).subscribe(
      (response) => this.successMessage = 'Profile updated successfully!',
      (error) => this.errorMessage = 'Failed to update profile'
    );
  }
  changePassword() {
    if (this.newPassword !== this.confirmationPassword) {
      this.errorMessage = '❌ New passwords do not match!';
      return;
    }
  
    const requestPayload = {
      userId: this.authService.getUserId(),
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmationPassword: this.confirmationPassword
    };
  
    console.log("🔹 Sending change password request:", requestPayload);
  
    this.authService.changePassword(this.currentPassword, this.newPassword, this.confirmationPassword)
      .subscribe({
        next: (response) => {
          console.log("✅ Password changed successfully!", response);
          this.successMessage = '✅ Password changed successfully!';
          this.errorMessage = ''; // ✅ CLEAR ERROR MESSAGE AFTER SUCCESS
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmationPassword = '';
        },
        error: (error) => {
          console.error("❌ Error changing password:", error);
          this.errorMessage = error.error || '❌ Failed to change password!';
          this.successMessage = ''; // ✅ CLEAR SUCCESS MESSAGE IF ERROR
        }
      });
  }
  
  
  
}
