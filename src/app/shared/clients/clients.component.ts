import { Component } from '@angular/core';
import { EventService, Event } from "src/app/shared/services/event.service";
import QRCode from 'qrcode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import FileSaver from "file-saver";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  events: Event[] = [];
  isEditing: boolean = false;
  editingEventId?: number;
  searchQuery: string = '';
  qrCodeUrls: { [key: number]: string } = {};
  showQRCode: { [key: number]: boolean } = {};
  externalEvents: any[] = [];
  showExternal: boolean = false;


  newEvent: Partial<Event> = {
    eventName: '',
    eventDescription: '',
    organizer: '',
    startDate: new Date(),
    endDate: new Date(),
    maxParticipants: 0,
    registred: 0,
    status: 'YET_TO_START'
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadExternalEvents();
  }
  loadExternalEvents(): void {
    this.eventService.getExternalEvents().subscribe({
      next: (data) => {
        console.log(data);
        this.externalEvents = data;
      },
      error: (err) => console.error("Error loading external events", err)
    });
  }

  toggleExternalView(): void {
    this.showExternal = !this.showExternal;
    if (this.showExternal && this.externalEvents.length === 0) {
      this.loadExternalEvents();
    }
  }



  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (response: Event[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize today to midnight

        // ✅ Filter to only future or today's events
        this.events = response.filter(event => {
          const eventDate = new Date(event.startDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });
      },
      (error) => console.error('Error fetching events:', error)
    );
  }

  searchEvents(): void {
    if (this.searchQuery.trim() === '') {
      this.loadEvents();
    } else {
      this.eventService.searchEventsByName(this.searchQuery).subscribe(
        (data: Event[]) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          this.events = data.filter(event => {
            const eventDate = new Date(event.startDate);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          });
        },
        (error) => console.error('Error fetching search results:', error)
      );
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.loadEvents();
  }

  generateQRCode(eventId: number | undefined): void {
    if (eventId === undefined) {
      console.error("Event ID is undefined");
      return;
    }

    if (this.showQRCode[eventId]) {
      this.showQRCode[eventId] = false;
      return;
    }

    this.eventService.getEventQRCode(eventId).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.qrCodeUrls[eventId] = reader.result as string;
          this.showQRCode[eventId] = true;
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error("Error fetching QR Code:", error);
      }
    });
  }

  hideQRCode(eventId: number | undefined): void {
    if (eventId === undefined) return;
    this.qrCodeUrls[eventId] = '';
  }

  extractFilename(path: string | undefined | null): string {
    if (!path) return '';
    return path.split(/[/\\]/).pop() || '';
  }

  isQRCodeVisible(eventId: number | undefined): boolean {
    return !!(eventId && this.showQRCode[eventId]);
  }

  participate(eventId: number): void {
    this.eventService.participateInEvent(eventId).subscribe({
      next: (pdfBlob: Blob) => {
        const filename = `event-pass-${eventId}.pdf`;
        FileSaver.saveAs(pdfBlob, filename);
      },
      error: (err) => {
        console.error('❌ Backend error:', err.error);
        console.error('Full error:', err);
        alert('Error: ' + (err.error?.message || 'Check console for more details.'));
      }

    });
  }

}
