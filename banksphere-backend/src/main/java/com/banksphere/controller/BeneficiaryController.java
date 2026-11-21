
package com.banksphere.controller;

import com.banksphere.dto.BeneficiaryRequest;
import com.banksphere.dto.BeneficiaryResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.BeneficiaryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;
    private final UserRepository userRepository;

    public BeneficiaryController(
            BeneficiaryService beneficiaryService,
            UserRepository userRepository) {

        this.beneficiaryService = beneficiaryService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));
    }

    // Add beneficiary
    @PostMapping
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request,
            Authentication authentication) {

        User customer = getAuthenticatedUser(authentication);

        BeneficiaryResponse response =
                beneficiaryService.addBeneficiary(customer, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all beneficiaries
    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>> getBeneficiaries(
            Authentication authentication) {

        User customer = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                beneficiaryService.getBeneficiaries(customer.getId()));
    }

    // Update beneficiary
    @PutMapping("/{id}")
    public ResponseEntity<BeneficiaryResponse> updateBeneficiary(
            @PathVariable Long id,
            @RequestBody BeneficiaryRequest request,
            Authentication authentication) {

        User customer = getAuthenticatedUser(authentication);

        String nickname = request.getNickname() != null ? request.getNickname() : request.getBeneficiaryName();
        BeneficiaryResponse response = beneficiaryService.updateBeneficiary(id, customer.getId(), nickname);

        return ResponseEntity.ok(response);
    }

    // Delete beneficiary
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiary(
            @PathVariable Long id,
            Authentication authentication) {

        User customer = getAuthenticatedUser(authentication);

        beneficiaryService.deleteBeneficiary(id, customer.getId());

        return ResponseEntity.noContent().build();
    }
}
