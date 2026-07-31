package in.gov.cdsco.document.controller;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/docs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // For demo
public class DocumentController {

    private final MinioClient minioClient;

    @Value("${minio.default-bucket}")
    private String defaultBucket;

    @PostConstruct
    public void initBucket() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(defaultBucket).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(defaultBucket).build());
                log.info("Created MinIO bucket: {}", defaultBucket);
            }
        } catch (Exception e) {
            log.error("Error initializing MinIO bucket", e);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "docType", defaultValue = "GENERAL") String docType) {
        
        try (InputStream is = file.getInputStream()) {
            String objectKey = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
            
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(defaultBucket)
                    .object(objectKey)
                    .stream(is, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
                    
            return ResponseEntity.ok(Map.of(
                "fileName", file.getOriginalFilename(),
                "objectKey", objectKey,
                "url", "/api/v1/docs/download/" + objectKey
            ));
        } catch (Exception e) {
            log.error("Upload failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
