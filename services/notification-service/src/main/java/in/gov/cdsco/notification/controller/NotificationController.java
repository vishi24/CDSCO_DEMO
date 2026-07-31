package in.gov.cdsco.notification.controller;

import in.gov.cdsco.notification.entity.NotificationEntity;
import in.gov.cdsco.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    
    // Store active SSE connections by user ID
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationEntity>> getUserNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId));
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationRepository.findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(userId));
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notification.setReadAt(java.time.LocalDateTime.now());
            notificationRepository.save(notification);
        });
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/send")
    public ResponseEntity<NotificationEntity> sendNotification(@RequestBody NotificationEntity notification) {
        NotificationEntity saved = notificationRepository.save(notification);
        
        // Push via SSE if user is connected
        SseEmitter emitter = emitters.get(notification.getRecipientUserId());
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(saved));
            } catch (IOException e) {
                emitters.remove(notification.getRecipientUserId());
            }
        }
        
        return ResponseEntity.ok(saved);
    }

    // SSE Endpoint for real-time notifications
    @GetMapping("/stream/{userId}")
    public SseEmitter streamNotifications(@PathVariable UUID userId) {
        SseEmitter emitter = new SseEmitter(3600000L); // 1 hour timeout
        emitters.put(userId, emitter);
        
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));
        
        return emitter;
    }
}
