package com.example.gestionevent.controller;

import com.example.gestionevent.client.UserClient;
import com.example.gestionevent.entity.Event;
import com.example.gestionevent.entity.UserDTO;
import com.example.gestionevent.entity.UserEvent;
import com.example.gestionevent.repository.EventRepository;
import com.example.gestionevent.repository.UserEventRepository;
import com.example.gestionevent.service.IEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.WriterException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
@EnableDiscoveryClient

public class EventRestController {

    private final IEventService eventService;
    private final UserClient userClient;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    UserEventRepository userEventRepository;

    // ✅ Add Event with ResponseEntity
    @PostMapping(value = "/add-event", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Event> addEvent(
            @RequestPart("event") String eventJson,
            @RequestPart("image") MultipartFile imageFile) {

        try {
            // 👇 Debug logging to see what's coming in
            System.out.println("Received JSON: " + eventJson);
            System.out.println("Received file: " + imageFile.getOriginalFilename());

            // Parse JSON string to event object
            ObjectMapper objectMapper = new ObjectMapper();
            Event event = objectMapper.readValue(eventJson, Event.class);

            // 👇 Log parsed object to verify deserialization
            System.out.println("Parsed Event Object: " + event);

            // Save event with image using service method
            Event savedEvent = eventService.addEvent(event, imageFile);
            return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);

        } catch (IOException e) {
            // 👇 Print stack trace for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    




    @GetMapping("/event-image/{filename:.+}")
    public ResponseEntity<byte[]> getEventImage(@PathVariable String filename) {
        try {
            Path path = Paths.get("uploads/events/", filename);
            byte[] imageBytes = Files.readAllBytes(path);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }


    // ✅ Get All Events with ResponseEntity
    @GetMapping("/getAllEvents")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events); // 200 OK with the list of events
    }

    // ✅ Get Event by ID (Optional)


    // ✅ Delete Event with ResponseEntity
    @DeleteMapping("/deleteEvent/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build(); // 204 No Content (Successful Deletion)
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build(); // 500 Internal Server Error
        }
    }
    @PutMapping("/updateEvent/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        return eventService.updateEvent(id, eventDetails);
    }
    @GetMapping("/searchByName")
    public List<Event> searchEvents(@RequestParam String name) {
        return eventService.searchEventByName(name);
    }

    @GetMapping("/events/{id}/qrcode")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable Long id) {
        System.out.println("QR Code requested for Event ID: " + id); // Debug log
        try {
            byte[] qrCode = eventService.generateQRCodeForEvent(id);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrCode);
        } catch (Exception e) {
            System.err.println("Error generating QR Code: " + e.getMessage()); // Debug log
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getEventStatistics() {
        return ResponseEntity.ok(eventService.getEventStatusStats());
    }
    @GetMapping("/scraped-events")
    public ResponseEntity<List<Map<String, String>>> getScrapedEvents() {
        List<Map<String, String>> scrapedData = eventService.runPythonScraper();
        return ResponseEntity.ok(scrapedData);
    }

    @GetMapping("/participate/{eventId}")
    public ResponseEntity<byte[]> participateInEvent(
            @PathVariable Long eventId,
            @RequestHeader("userId") Integer userId,
            @RequestHeader("username") String username) {

        try {
            byte[] pdf = eventService.participateInEvent(eventId, userId, username);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header("Content-Disposition", "attachment; filename=\"event_pass.pdf\"")
                    .body(pdf);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }









}
