
package com.banksphere.controller;

import com.banksphere.dto.ComplaintResponse;
import com.banksphere.dto.ComplaintStatusRequest;
import com.banksphere.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/complaints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminComplaintController {

    private final ComplaintService complaintService;

    public AdminComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Admin: View all complaints
    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints());
    }

    // Admin: Update complaint status
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long complaintId,
            @Valid @RequestBody ComplaintStatusRequest request) {

        ComplaintResponse response =
                complaintService.updateComplaintStatus(
                        complaintId,
                        request.getStatus());

        return ResponseEntity.ok(response);
    }
}
