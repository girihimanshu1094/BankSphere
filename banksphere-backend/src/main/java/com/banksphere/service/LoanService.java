package com.banksphere.service;

import com.banksphere.dto.LoanRequest;
import com.banksphere.dto.LoanResponse;
import com.banksphere.dto.AdminLoanResponse;
import com.banksphere.entity.Loan;
import com.banksphere.entity.User;
import com.banksphere.repository.LoanRepository;
import org.springframework.stereotype.Service;
import com.banksphere.service.NotificationService;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final NotificationService notificationService;

    public LoanService(LoanRepository loanRepository, NotificationService notificationService) {
        this.loanRepository = loanRepository;
        this.notificationService = notificationService;
    }

    // Admin method: retrieve all loans with applicant info
    public List<AdminLoanResponse> getAllLoansForAdmin() {
        return loanRepository.findAll()
                .stream()
                .map(this::toAdminDto)
                .toList();
    }

    // Helper to map Loan entity to AdminLoanResponse DTO
    private AdminLoanResponse toAdminDto(Loan loan) {
        User user = loan.getUser();
        return new AdminLoanResponse(
                loan.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                loan.getLoanAmount(),
                loan.getInterestRate(),
                loan.getTenureMonths(),
                loan.getPurpose(),
                loan.getStatus().name(),
                loan.getApplicationDate()
        );
    }

    @Transactional
    public LoanResponse updateLoanDecision(Long loanId, Boolean approved) {
        // Find loan application
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan application not found"));

        // Only pending applications can be processed
        if (loan.getStatus() != Loan.LoanStatus.PENDING) {
            throw new IllegalArgumentException("This loan application has already been processed");
        }

        // Update loan status
        if (approved) {
            loan.setStatus(Loan.LoanStatus.APPROVED);
        } else {
            loan.setStatus(Loan.LoanStatus.REJECTED);
        }

        // Save updated application
        Loan updatedLoan = loanRepository.save(loan);

        // Send notification to the customer
        String title;
        String message;
        if (approved) {
            title = "Loan Approved";
            message = "Congratulations! Your loan application of ₹" + loan.getLoanAmount() + " has been approved.";
        } else {
            title = "Loan Rejected";
            message = "Your loan application of ₹" + loan.getLoanAmount() + " has been rejected.";
        }
        notificationService.createNotification(loan.getUser(), title, message);

        return convertToResponse(updatedLoan);
    }

    // Apply for a loan
    @Transactional
    public LoanResponse applyForLoan(User user, LoanRequest request) {
        Loan loan = new Loan();
        loan.setUser(user);
        loan.setLoanAmount(request.getLoanAmount());
        loan.setInterestRate(new BigDecimal("10.50"));
        loan.setTenureMonths(request.getTenureMonths());
        loan.setPurpose(request.getPurpose().trim());
        loan.setStatus(Loan.LoanStatus.PENDING);
        Loan savedLoan = loanRepository.save(loan);
        return convertToResponse(savedLoan);
    }

    // View customer's loan applications
    @Transactional(readOnly = true)
    public List<LoanResponse> getMyLoans(Long userId) {
        return loanRepository.findByUser_IdOrderByApplicationDateDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Convert entity into response DTO (customer view)
    private LoanResponse convertToResponse(Loan loan) {
        return new LoanResponse(
                loan.getId(),
                loan.getLoanAmount(),
                loan.getInterestRate(),
                loan.getTenureMonths(),
                loan.getPurpose(),
                loan.getStatus().name(),
                loan.getApplicationDate()
        );
    }
}
