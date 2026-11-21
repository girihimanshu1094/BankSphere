package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminAccountResponse {

    private Long id;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private Long userId;
    private String holderName;
    private String email;
    private LocalDateTime createdAt;

    public AdminAccountResponse(
            Long id,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String status,
            Long userId,
            String holderName,
            String email,
            LocalDateTime createdAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
        this.userId = userId;
        this.holderName = holderName;
        this.email = email;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getAccountType() {
        return accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public String getStatus() {
        return status;
    }

    public Long getUserId() {
        return userId;
    }

    public String getHolderName() {
        return holderName;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
