package com.banksphere.controller;

import com.banksphere.dto.LoanDecisionRequest;
import com.banksphere.dto.LoanResponse;
import com.banksphere.dto.AdminLoanResponse;
import com.banksphere.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/loans")
public class AdminLoanController {

    private final LoanService loanService;

    public AdminLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    // GET all loans for admin view
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminLoanResponse>> getAllLoans() {
        List<AdminLoanResponse> loans = loanService.getAllLoansForAdmin();
        return ResponseEntity.ok(loans);
    }

    // Update loan decision (approve/reject)
    @PutMapping("/{loanId}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanResponse> updateLoanDecision(
            @PathVariable Long loanId,
            @Valid @RequestBody LoanDecisionRequest request) {

        LoanResponse response = loanService.updateLoanDecision(loanId, request.getApproved());
        return ResponseEntity.ok(response);
    }
}
