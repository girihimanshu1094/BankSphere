
package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private String transactionReference;
    private String type;
    private String otherAccountNumber;
    private BigDecimal amount;
    private String description;
    private String status;
    private LocalDateTime transactionDate;

    public TransactionResponse(
            String transactionReference,
            String type,
            String otherAccountNumber,
            BigDecimal amount,
            String description,
            String status,
            LocalDateTime transactionDate) {

        this.transactionReference = transactionReference;
        this.type = type;
        this.otherAccountNumber = otherAccountNumber;
        this.amount = amount;
        this.description = description;
        this.status = status;
        this.transactionDate = transactionDate;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public String getType() {
        return type;
    }

    public String getOtherAccountNumber() {
        return otherAccountNumber;
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
