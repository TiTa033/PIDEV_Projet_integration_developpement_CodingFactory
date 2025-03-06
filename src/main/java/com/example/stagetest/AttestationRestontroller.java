package com.example.stagetest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/attestations")
@CrossOrigin(origins = "http://localhost:4200")
public class AttestationRestontroller {
    @Autowired
    private AttestationService attestationService;

    @GetMapping("/{stageId}/download")
    public ResponseEntity<byte[]> downloadAttestation(@PathVariable Long stageId) throws IOException {
        byte[] pdf = attestationService.genererAttestation(stageId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attestation_stage.pdf")
                .body(pdf);
    }
}
