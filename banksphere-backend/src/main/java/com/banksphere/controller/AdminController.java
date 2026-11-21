package com.banksphere.controller;

import com.banksphere.dto.*;
import com.banksphere.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<AdminCustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @PutMapping("/customers/{customerId}/status")
    public ResponseEntity<AdminCustomerResponse> updateCustomerStatus(
            @PathVariable Long customerId,
            @Valid @RequestBody AdminCustomerStatusRequest request) {
        return ResponseEntity.ok(
                adminService.updateCustomerStatus(customerId, request.getEnabled(), request.getReason()));
    }

    @PostMapping("/customers")
    public ResponseEntity<AdminCustomerResponse> createCustomer(
            @Valid @RequestBody AdminCreateCustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createCustomer(request));
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AdminAccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<AdminTransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }
}
