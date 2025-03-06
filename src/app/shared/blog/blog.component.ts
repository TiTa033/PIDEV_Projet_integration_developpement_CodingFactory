import { Component, OnInit } from '@angular/core';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  publications: any[] = []; // Store publications
  newPublication = { titre: '', contenue: '' }; // Initialize newPublication (no id)
  isFormVisible = false;  // Flag to toggle form visibility
  editingPublication: any = null;  // To hold the publication being edited (with id)

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    this.publicationService.getPublications().subscribe((data) => {
      this.publications = data;
    });
  }

  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm(); // Reset the form if it's hidden
    }
  }

  // Save the publication (add new or update)
  savePublication(): void {
    if (this.editingPublication) {
      // Update publication
      const updatedPublication = {
        ...this.newPublication,
        id: this.editingPublication.id, // Add the id when editing
      };
      this.publicationService.updatePublication(updatedPublication).subscribe(() => {
        this.loadPublications();
        this.resetForm();
      });
    } else {
      // Add new publication
      this.publicationService.addPublication(this.newPublication).subscribe(() => {
        this.loadPublications();
        this.resetForm();
      });
    }
  }

  // Reset the form for adding new publication or clearing after update
  resetForm(): void {
    this.newPublication = { titre: '', contenue: '' }; // Reset form fields
    this.editingPublication = null; // Clear the editing publication
  }

  // Populate the form with data for editing
  editPublication(pub: any): void {
    this.newPublication.titre = pub.titre;
    this.newPublication.contenue = pub.contenue;
    this.editingPublication = pub; // Set the publication being edited
    this.isFormVisible = true; // Show the form
  }

  // Delete publication
  deletePublication(id: number): void {
    this.publicationService.deletePublication(id).subscribe(() => {
      this.loadPublications();
    });
  }
}
