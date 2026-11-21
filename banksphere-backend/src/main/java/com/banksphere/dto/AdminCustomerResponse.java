package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminCustomerResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean enabled;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private LocalDateTime joinDate;

    public AdminCustomerResponse(
            Long id,
            String name,
            String email,
            String phone,
            String role,
            boolean enabled,
            String accountNumber,
            String accountType,
            BigDecimal balance,
            String status,
            LocalDateTime joinDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.enabled = enabled;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
        this.joinDate = joinDate;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getRole() {
        return role;
    }

    public boolean isEnabled() {
        return enabled;
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

    public LocalDateTime getJoinDate() {
        return joinDate;
    }
}
