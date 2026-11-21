
package com.banksphere.controller;

import com.banksphere.dto.ComplaintRequest;
import com.banksphere.dto.ComplaintResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    public ComplaintController(
            ComplaintService complaintService,
            UserRepository userRepository) {

        this.complaintService = complaintService;
        this.userRepository = userRepository;
    }

    // Submit complaint
    @PostMapping
    public ResponseEntity<ComplaintResponse> submitComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        ComplaintResponse response =
                complaintService.submitComplaint(user, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // View customer's complaints
    @GetMapping("/my-complaints")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(
                complaintService.getMyComplaints(user.getId()));
    }
}
