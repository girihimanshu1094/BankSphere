package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminTransactionResponse {

    private Long id;
    private String transactionReference;
    private String senderAccountNumber;
    private String senderName;
    private String receiverAccountNumber;
    private String receiverName;
    private BigDecimal amount;
    private String description;
    private String status;
    private LocalDateTime transactionDate;

    public AdminTransactionResponse(
            Long id,
            String transactionReference,
            String senderAccountNumber,
            String senderName,
            String receiverAccountNumber,
            String receiverName,
            BigDecimal amount,
            String description,
            String status,
            LocalDateTime transactionDate) {
        this.id = id;
        this.transactionReference = transactionReference;
        this.senderAccountNumber = senderAccountNumber;
        this.senderName = senderName;
        this.receiverAccountNumber = receiverAccountNumber;
        this.receiverName = receiverName;
        this.amount = amount;
        this.description = description;
        this.status = status;
        this.transactionDate = transactionDate;
    }

    public Long getId() {
        return id;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public String getSenderAccountNumber() {
        return senderAccountNumber;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getReceiverAccountNumber() {
        return receiverAccountNumber;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
}
