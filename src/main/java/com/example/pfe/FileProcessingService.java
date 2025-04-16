package com.example.pfe;

import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
@Service
public class FileProcessingService {

    public String extractTextFromBytes(byte[] fileBytes) {
        try {
            AutoDetectParser parser = new AutoDetectParser();
            BodyContentHandler handler = new BodyContentHandler(-1); // Pas de limite de taille
            Metadata metadata = new Metadata();
            ParseContext context = new ParseContext();

            try (ByteArrayInputStream inputStream = new ByteArrayInputStream(fileBytes)) {
                parser.parse(inputStream, handler, metadata, context);
                return handler.toString();
            }
        } catch (IOException | TikaException | SAXException e) {
            throw new RuntimeException("Erreur lors de l'extraction du texte du fichier", e);
        }
    }
}
