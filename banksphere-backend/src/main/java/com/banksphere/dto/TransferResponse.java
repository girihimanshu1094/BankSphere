
package com.banksphere.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferResponse {

    private String transactionReference;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private BigDecimal remainingBalance;
    private String status;
    private String message;
    private LocalDateTime transactionDate;

    public TransferResponse(
            String transactionReference,
            String senderAccountNumber,
            String receiverAccountNumber,
            BigDecimal amount,
            BigDecimal remainingBalance,
            String status,
            String message,
            LocalDateTime transactionDate) {

        this.transactionReference = transactionReference;
        this.senderAccountNumber = senderAccountNumber;
        this.receiverAccountNumber = receiverAccountNumber;
        this.amount = amount;
        this.remainingBalance = remainingBalance;
        this.status = status;
        this.message = message;
        this.transactionDate = transactionDate;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public String getSenderAccountNumber() {
        return senderAccountNumber;
    }

    public String getReceiverAccountNumber() {
        return receiverAccountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
}
