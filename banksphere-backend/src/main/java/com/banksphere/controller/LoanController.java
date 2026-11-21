
package com.banksphere.controller;

import com.banksphere.dto.LoanRequest;
import com.banksphere.dto.LoanResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.LoanService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final UserRepository userRepository;

    public LoanController(
            LoanService loanService,
            UserRepository userRepository) {

        this.loanService = loanService;
        this.userRepository = userRepository;
    }

    // Apply for a loan
    @PostMapping
    public ResponseEntity<LoanResponse> applyForLoan(
            @Valid @RequestBody LoanRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        LoanResponse response =
                loanService.applyForLoan(user, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // View customer's loan applications
    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanResponse>> getMyLoans(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(
                loanService.getMyLoans(user.getId()));
    }
}
