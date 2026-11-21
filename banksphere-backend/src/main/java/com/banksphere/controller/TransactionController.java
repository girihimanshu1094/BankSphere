
package com.banksphere.controller;

import com.banksphere.dto.TransactionResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.AccountService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    public TransactionController(
            AccountService accountService,
            UserRepository userRepository) {

        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponse>> getTransactionHistory(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        List<TransactionResponse> history =
                accountService.getTransactionHistory(user.getId());

        return ResponseEntity.ok(history);
    }
}
