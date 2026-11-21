
package com.banksphere.controller;

import com.banksphere.dto.AccountResponse;
import com.banksphere.dto.DepositWithdrawRequest;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.AccountService;
import com.banksphere.entity.User;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    public AccountController(
            AccountService accountService,
            UserRepository userRepository) {

        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/my-account")
    public ResponseEntity<AccountResponse> getMyAccount(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        AccountResponse response = accountService.getAccountDetails(user.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit")
    public ResponseEntity<AccountResponse> deposit(
            @Valid @RequestBody DepositWithdrawRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        AccountResponse response = accountService.deposit(user.getId(), request.getAmount(), request.getDescription());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<AccountResponse> withdraw(
            @Valid @RequestBody DepositWithdrawRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);
        AccountResponse response = accountService.withdraw(user.getId(), request.getAmount(), request.getDescription());
        return ResponseEntity.ok(response);
    }
}
