import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from 'src/app/shared/services/event.service';
import { FormsModule } from '@angular/forms';
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isEditing: boolean = false;
  editingEventId?: number;
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedImage?: File;
  currentPage: number = 1;
  itemsPerPage: number = 2;


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

  constructor(private eventService: EventService,private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadStats();
  }

  // ✅ Load all events
  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (response) => {
        this.events = response;
        this.filteredEvents = [...response]; // Initialize filtered events
      },
      (error) => console.error('Error fetching events:', error)
    );
  }


  // ✅ Add event
  addEvent(): void {
    if (this.newEvent.eventName && this.newEvent.organizer && this.selectedImage) {
      // Retrieve the user ID and username (use AuthService to get them from localStorage)
      const userId = this.authService.getUserId();
      const username = this.authService.getUsername(); // Get the username from AuthService or localStorage

      if (userId && username) {
        // Add the username to the newEvent object
        this.newEvent.createdByUser = username;

        // Now call the EventService's addEvent method with the userID and username
        this.eventService.addEvent(this.newEvent as Event, this.selectedImage).subscribe(
          (response) => {
            this.events.push(response);  // Add the new event to the list
            this.filterByStatus();  // Apply any filters if active
            this.resetForm();  // Reset the form after submission
          },
          (error) => console.error('Error adding event:', error)  // Handle error if any
        );
      } else {
        alert("No user ID or Username found. Please log in.");
      }
    } else {
      alert("Please fill all required fields and choose an image.");
    }
  }



  // ✅ Edit event (prefill form)
  editEvent(event: Event): void {
    this.isEditing = true;
    this.editingEventId = event.id;
    this.newEvent = { ...event };
  }

  // ✅ Update event
  updateEvent(): void {
    if (this.editingEventId) {
      this.eventService.updateEvent(this.editingEventId, this.newEvent as Event).subscribe(
        (updatedEvent) => {
          const index = this.events.findIndex(event => event.id === this.editingEventId);
          if (index !== -1) this.events[index] = updatedEvent;
          this.filterByStatus(); // Refresh filtered list
          this.resetForm();
        },
        (error) => console.error('Error updating event:', error)
      );
    }
  }

  // ✅ Delete event
  deleteEvent(eventId: number): void {
    if (confirm("Are you sure you want to delete this event?")) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.events = this.events.filter(event => event.id !== eventId);
          this.filterByStatus(); // Refresh filtered list
        },
        (error) => console.error('Error deleting event:', error)
      );
    }
  }

  // ✅ Search events
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

          this.filterByStatus(); // Apply status filter on search result
        },
        (error) => console.error('Error fetching search results:', error)
      );
    }
  }

  // ✅ Reset form
  resetForm(): void {
    this.newEvent = {
      eventName: '',
      eventDescription: '',
      organizer: '',
      startDate: new Date(),
      endDate: new Date(),
      maxParticipants: 0,
      registred: 0,
      status: 'YET_TO_START'
    };
    this.isEditing = false;
    this.editingEventId = undefined;
    this.selectedImage = undefined;
  }

  // ✅ Handle image selection
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // ✅ Filter by status
  filterByStatus(): void {
    if (this.selectedStatus === '') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.status === this.selectedStatus);
    }
    this.currentPage = 1;
  }

  // ✅ Reset status filter
  resetStatusFilter(): void {
    this.selectedStatus = '';
    this.filteredEvents = [...this.events];
    this.currentPage = 1;
  }

  // ✅ Paginated display of filtered events
  get paginatedEvents(): Event[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // ✅ Handle page change
  goToPage(page: number): void {
    this.currentPage = page;
  }

  // ✅ Total pages based on filtered list
  get totalPages(): number {
    return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }
  eventStats: { [key: string]: number } = {};

  loadStats(): void {
    this.eventService.getEventStatistics().subscribe(
      (stats) => this.eventStats = stats,
      (error) => console.error("Failed to load stats", error)
    );
  }

}
