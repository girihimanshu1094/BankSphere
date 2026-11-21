package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for admin view of loan applications. Contains loan details together with the
 * applicant's basic user information. No password or sensitive authentication data
 * is exposed.
 */
public class AdminLoanResponse {

    private Long loanId;
    private Long userId;
    private String fullName;
    private String email;
    private BigDecimal loanAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private String purpose;
    private String status;
    private LocalDateTime applicationDate;

    public AdminLoanResponse(Long loanId, Long userId, String fullName, String email,
                             BigDecimal loanAmount, BigDecimal interestRate,
                             Integer tenureMonths, String purpose, String status,
                             LocalDateTime applicationDate) {
        this.loanId = loanId;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.loanAmount = loanAmount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.purpose = purpose;
        this.status = status;
        this.applicationDate = applicationDate;
    }

    public Long getLoanId() {
        return loanId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }
}
