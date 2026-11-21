
package com.banksphere.controller;

import com.banksphere.dto.TransferRequest;
import com.banksphere.dto.TransferResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.AccountService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    public TransferController(
            AccountService accountService,
            UserRepository userRepository) {

        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<TransferResponse> transferMoney(
            @Valid @RequestBody TransferRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        TransferResponse response =
                accountService.transferMoney(sender.getId(), request);

        return ResponseEntity.ok(response);
    }
}
