package com.example.gestionevent.service;

import com.example.gestionevent.entity.Event;
import com.example.gestionevent.entity.EventStatus;
import com.example.gestionevent.repository.EventRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

@Service
@AllArgsConstructor
public class EventServiceImpl implements IEventService{

    @Autowired
    EventRepository eventRepository;
    public Event addEvent(Event event, MultipartFile imageFile) {
        try {
            // Save image
            String uploadDir = "uploads/events/";
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imageFile.getBytes());

            // Set image path to event
            event.setImagePath(fileName);
            return eventRepository.save(event);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }


    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public Event updateEvent(Long eventId, Event eventDetails) {
        Optional<Event> existingEvent = eventRepository.findById(eventId);
        if (existingEvent.isPresent()) {
            Event eventToUpdate = existingEvent.get();
            eventToUpdate.setEventName(eventDetails.getEventName());
            eventToUpdate.setEventDescription(eventDetails.getEventDescription());
            eventToUpdate.setOrganizer(eventDetails.getOrganizer());
            eventToUpdate.setStartDate(eventDetails.getStartDate());
            eventToUpdate.setEndDate(eventDetails.getEndDate());
            eventToUpdate.setMaxParticipants(eventDetails.getMaxParticipants());
            eventToUpdate.setRegistred(eventDetails.getRegistred());
            eventToUpdate.setStatus(eventDetails.getStatus());

            return eventRepository.save(eventToUpdate); // Save updated event
        } else {
            throw new RuntimeException("Event not found");
        }
    }

    public List<Event> searchEventByName(String name) {
        return eventRepository.findByEventNameContaining(name);
    }
    public byte[] generateQRCodeForEvent(Long eventId) throws WriterException, IOException {
        // Find Event by ID
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (eventOptional.isEmpty()) {
            throw new RuntimeException("Event not found");
        }

        Event event = eventOptional.get();
        // Prepare event details to be encoded in the QR code
        String eventDetails = "Event Name: " + event.getEventName() + "\n"
                + "Organizer: " + event.getOrganizer() + "\n"
                + "Start Date: " + event.getStartDate() + "\n"
                + "Description: " + event.getEventDescription();

        // Generate QR code using ZXing
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(eventDetails, BarcodeFormat.QR_CODE, 200, 200);

        // Convert QR code to image
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ImageIO.write(qrImage, "PNG", outputStream);

        // Return the image as byte array (PNG format)
        return outputStream.toByteArray();
    }
    public Map<String, Long> getEventStatusStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("YET_TO_START", eventRepository.countByStatus(EventStatus.YET_TO_START));
        stats.put("IN_PROGRESS", eventRepository.countByStatus(EventStatus.IN_PROGRESS));
        stats.put("ENDED", eventRepository.countByStatus(EventStatus.ENDED));
        stats.put("DELAYED", eventRepository.countByStatus(EventStatus.DELAYED));
        return stats;
    }
    public List<Map<String, String>> runPythonScraper() {
        List<Map<String, String>> articles = new ArrayList<>();

        try {
            String pythonScriptPath = "C:/scrapping/web_scrapping_edf.py";
            String pythonExecutablePath = "C:/Users/benti/AppData/Local/Programs/Python/Python313/python.exe";

            System.out.println("Python script path: " + pythonScriptPath);

            ProcessBuilder pb = new ProcessBuilder(pythonExecutablePath, pythonScriptPath);
            pb.directory(new File("C:/scrapping"));
            pb.redirectErrorStream(true); // Merges stderr with stdout

            System.out.println("Running command: " + String.join(" ", pb.command()));

            Process process = pb.start();

            // Only one reader since stderr is redirected to stdout
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            // ✅ Wait for process, then always log output even on error
            boolean finished = process.waitFor(60, TimeUnit.SECONDS);
            if (!finished) {
                process.destroy();
                throw new RuntimeException("Python script timed out.");
            }

            int exitCode = process.exitValue();
            System.out.println("📄 Full Python script output:\n" + output.toString());
            System.out.println("⚙️ Exit code: " + exitCode);

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed with exit code: " + exitCode);
            }

            // Extract the first line of JSON from the output
            String jsonOutput = output.toString().split("\n")[0];

            if (jsonOutput == null || jsonOutput.trim().isEmpty() || jsonOutput.equals("[]")) {
                System.out.println("❌ No articles fetched or empty output from the Python script.");
                return articles;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            articles = objectMapper.readValue(jsonOutput, new TypeReference<List<Map<String, String>>>() {});

        } catch (Exception e) {
            System.out.println("❌ Error running Python scraper: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error running Python scraper: " + e.getMessage(), e);
        }

        return articles;
    }

    public byte[] participateInEvent(Long eventId, Integer userId, String username) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isEmpty()) {
            throw new RuntimeException("Event not found");
        }

        Event event = optionalEvent.get();

        // Avoid duplicate participation
        if (event.getRegisteredUserIds().contains(userId)) {
            throw new RuntimeException("User already registered for this event");
        }

        // Check if event has reached max capacity
        if (event.getRegistred() >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }

        // Register user
        event.getRegisteredUserIds().add(userId);
        event.setRegistred(event.getRegistred() + 1);
        eventRepository.save(event);

        // Generate personalized PDF pass
        return generatePdfPass(event, username);
    }

    private byte[] generatePdfPass(Event event, String username) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Generate random 8-digit pass number
            int passNumber = (int)(Math.random() * 90000000) + 10000000;

            // Fonts
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, BaseColor.WHITE);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.BLACK);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.WHITE);

            // Title with background color
            PdfPTable titleTable = new PdfPTable(1);
            titleTable.setWidthPercentage(100);
            titleTable.setSpacingBefore(10);
            PdfPCell titleCell = new PdfPCell(new Paragraph("🎫 Event Pass", titleFont));
            titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            titleCell.setBackgroundColor(BaseColor.DARK_GRAY);
            titleCell.setBorder(0);
            titleTable.addCell(titleCell);
            document.add(titleTable);

            // Space
            document.add(new Paragraph(" "));

            // Event Details Table
            PdfPTable eventDetailsTable = new PdfPTable(2);
            eventDetailsTable.setWidthPercentage(100);
            eventDetailsTable.setSpacingBefore(20);

            // Pass Number
            eventDetailsTable.addCell(new PdfPCell(new Paragraph("Pass No:", headerFont)));
            eventDetailsTable.addCell(new PdfPCell(new Paragraph(String.valueOf(passNumber), normalFont)));

            // Name
            eventDetailsTable.addCell(new PdfPCell(new Paragraph("Name:", headerFont)));
            eventDetailsTable.addCell(new PdfPCell(new Paragraph(username, normalFont)));

            // Event Name
            eventDetailsTable.addCell(new PdfPCell(new Paragraph("Event:", headerFont)));
            eventDetailsTable.addCell(new PdfPCell(new Paragraph(event.getEventName(), normalFont)));

            // Organizer
            eventDetailsTable.addCell(new PdfPCell(new Paragraph("Organizer:", headerFont)));
            eventDetailsTable.addCell(new PdfPCell(new Paragraph(event.getOrganizer(), normalFont)));

            // Date
            eventDetailsTable.addCell(new PdfPCell(new Paragraph("Event Date:", headerFont)));
            eventDetailsTable.addCell(new PdfPCell(new Paragraph(event.getStartDate().toString(), normalFont)));

            // Description
            eventDetailsTable.addCell(new PdfPCell(new Paragraph("Description:", headerFont)));
            eventDetailsTable.addCell(new PdfPCell(new Paragraph(event.getEventDescription(), normalFont)));

            // Style first column cells
            for (int i = 0; i < eventDetailsTable.getRows().size(); i++) {
                PdfPCell cell = eventDetailsTable.getRow(i).getCells()[0];
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setPadding(8);
                cell.setBorderWidth(1);
            }

            document.add(eventDetailsTable);

            // Space
            document.add(new Paragraph(" "));

            // Footer
            document.add(new Paragraph("Thank you for participating in the event!", normalFont));

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }










}
