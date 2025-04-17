import { Component, OnInit } from '@angular/core';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  publications: any[] = [];
    popularPublications: any[] = []; // Pour stocker les publications populaires

  newPublication = { titre: '', contenue: '' };
  isFormVisible = false;
  editingPublication: any = null;
  comments: { [key: number]: string } = {}; // Pour stocker les commentaires par publication

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {
    this.loadPublications();
    this.loadPopularPublications();
  }

  loadPublications(): void {
    this.publicationService.getPublications().subscribe((data) => {
      // Adapter les commentaires pour l'affichage dans Angular
      this.publications = data.map(pub => ({
        ...pub,
        comments: pub.commentaires || []
      }));
    });
  }

  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  savePublication(): void {
    if (this.editingPublication) {
      const updatedPublication = {
        ...this.newPublication,
        id: this.editingPublication.id,
      };
      this.publicationService.updatePublication(updatedPublication).subscribe(() => {
        this.loadPublications();
        this.resetForm();
      });
    } else {
      this.publicationService.addPublication(this.newPublication).subscribe(() => {
        this.loadPublications();
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.newPublication = { titre: '', contenue: '' };
    this.editingPublication = null;
  }

  editPublication(pub: any): void {
    this.newPublication.titre = pub.titre;
    this.newPublication.contenue = pub.contenue;
    this.editingPublication = pub;
    this.isFormVisible = true;
  }

  deletePublication(id: number): void {
    this.publicationService.deletePublication(id).subscribe(() => {
      this.loadPublications();
    });
  }

  like(pubId: number): void {
    this.publicationService.addLike(pubId).subscribe(() => this.loadPublications());
  }

  dislike(pubId: number): void {
    this.publicationService.addDislike(pubId).subscribe(() => this.loadPublications());
  }

  comment(pubId: number): void {
    const text = this.comments[pubId];
    if (text && text.trim() !== '') {
      this.publicationService.addComment(pubId, text).subscribe(() => {
        this.comments[pubId] = '';
        this.loadPublications();
      });
    }
  }
  loadPopularPublications(): void {
    this.publicationService.getMostPopularPublications().subscribe((data) => {
      this.popularPublications = data;
    });
  }
  downloadPDF(): void {
    this.publicationService.downloadPublicationsPdf().subscribe((pdfBlob: Blob) => {
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'publications.pdf';
      a.click();
  
      window.URL.revokeObjectURL(url);
    });
  }
  
}
