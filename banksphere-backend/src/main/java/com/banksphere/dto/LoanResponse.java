
package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanResponse {

    private Long id;
    private BigDecimal loanAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private String purpose;
    private String status;
    private LocalDateTime applicationDate;

    public LoanResponse(
            Long id,
            BigDecimal loanAmount,
            BigDecimal interestRate,
            Integer tenureMonths,
            String purpose,
            String status,
            LocalDateTime applicationDate) {

        this.id = id;
        this.loanAmount = loanAmount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.purpose = purpose;
        this.status = status;
        this.applicationDate = applicationDate;
    }

    public Long getId() {
        return id;
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
