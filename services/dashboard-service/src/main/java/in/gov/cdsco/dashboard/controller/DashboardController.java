package in.gov.cdsco.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @GetMapping("/industry")
    public ResponseEntity<Map<String, Object>> getIndustryDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", 15);
        stats.put("pendingApplications", 3);
        stats.put("approvedApplications", 10);
        stats.put("rejectedApplications", 2);
        stats.put("activeCertificates", 8);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/officer")
    public ResponseEntity<Map<String, Object>> getOfficerDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("queueSize", 42);
        stats.put("processedToday", 12);
        stats.put("pendingRegistrations", 5);
        stats.put("applicationsByState", Map.of("Maharashtra", 120, "Gujarat", 85, "Telangana", 60, "Karnataka", 55));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", 1250);
        stats.put("activeOrganizations", 450);
        stats.put("systemHealth", "100%");
        stats.put("registryCount", Map.of("Drugs", 15000, "Devices", 3200, "BloodBanks", 850));
        return ResponseEntity.ok(stats);
    }
}
