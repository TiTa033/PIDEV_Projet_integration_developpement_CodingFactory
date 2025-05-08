package com.example.gestionbourses.controllers;

import com.example.gestionbourses.entities.Bourse;
import com.example.gestionbourses.services.IBourseService;
import com.google.zxing.WriterException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@EnableDiscoveryClient
@RequestMapping ("/bourse")
@AllArgsConstructor
public class BourseController {

    IBourseService bourseService;


   /* @PostMapping("/uploadImage")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return bourseService.uploadImage(file);
    }*/


    @PostMapping("/add-bourse")
    public Bourse addBourse(@RequestBody Bourse p) {
        return bourseService.addBourse(p);
    }


    @GetMapping("/retrieve-all-bourses")
    public List<Bourse> getBourses(){
        List<Bourse> listBourses = bourseService.getAllBourse();
        return listBourses;

    }

    @GetMapping("/retrieve-bourse/{bourse-id}")
    public Bourse retrieveBourse(@PathVariable("bourse-id") Long bourseId) {
        Bourse bourse = bourseService.retrieveBourse(bourseId);
        return bourse;
    }

    @PutMapping("/update/{idBourse}")
    public Bourse updateBourse(@PathVariable Long idBourse, @RequestBody Bourse b) {
        return bourseService.updateBourse(idBourse, b);
    }


    @DeleteMapping("/remove-bourse/{bourse-id}")
    public void deleteBourse(@PathVariable("bourse-id") Long idBourse) {
        bourseService.deleteBourse(idBourse);
    }


    @GetMapping(value = "/generate-qr/{bourse-id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQRCode(@PathVariable("bourse-id") Long bourseId)
            throws WriterException, IOException {
        byte[] qrImage = bourseService.generateQRCodeImage(bourseId);
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImage);
    }

    @GetMapping("/search")
    public List<Bourse> searchBourses(@RequestParam String nom) {
        return bourseService.searchBoursesByNom(nom);
    }

}
