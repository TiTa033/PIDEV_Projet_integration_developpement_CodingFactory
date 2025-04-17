import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-student-id',
  standalone: true,
  imports: [ReactiveFormsModule],  // Remove FormsModule as ReactiveFormsModule covers both.
  templateUrl: './upload-student-id.component.html',
  styleUrls: ['./upload-student-id.component.scss'],
})
export class UploadStudentIdComponent {
  idCardForm: FormGroup;

  // Property for feedback messages
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {
    this.idCardForm = new FormGroup({
      name: new FormControl('', Validators.required),
      specialty: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required),
    });
  }

  // Handle form submission
  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.idCardForm.value.name);
    formData.append('specialty', this.idCardForm.value.specialty);
    formData.append('image', this.idCardForm.value.image);
  
    this.http.post<any>('http://localhost:8088/api/candidatures/generate', formData).subscribe({
      next: (response) => {
        const filename = response.filename;  // Get the filename from the response
        
        // Construct the URL to access the file
        const fileUrl = `http://localhost:8088/api/candidatures/files/${filename}`;

  
        // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;  // Set the filename for the download
        link.click();  // Simulate a click to trigger the download
      },
      error: (err) => {
        console.error('Error generating ID card:', err);
      }
    });
  }
  

  // Handle image file change
  onImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.idCardForm.patchValue({
        image: event.target.files[0]
      });
    }
  }

}
