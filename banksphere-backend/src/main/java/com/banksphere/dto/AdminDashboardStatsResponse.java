package com.banksphere.dto;

import java.math.BigDecimal;

public class AdminDashboardStatsResponse {

    private long totalCustomers;
    private long totalAccounts;
    private long totalTransactionsCount;
    private long pendingLoansCount;
    private long pendingComplaintsCount;
    private BigDecimal totalDeposits;

    public AdminDashboardStatsResponse(
            long totalCustomers,
            long totalAccounts,
            long totalTransactionsCount,
            long pendingLoansCount,
            long pendingComplaintsCount,
            BigDecimal totalDeposits) {
        this.totalCustomers = totalCustomers;
        this.totalAccounts = totalAccounts;
        this.totalTransactionsCount = totalTransactionsCount;
        this.pendingLoansCount = pendingLoansCount;
        this.pendingComplaintsCount = pendingComplaintsCount;
        this.totalDeposits = totalDeposits;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public long getTotalAccounts() {
        return totalAccounts;
    }

    public long getTotalTransactionsCount() {
        return totalTransactionsCount;
    }

    public long getPendingLoansCount() {
        return pendingLoansCount;
    }

    public long getPendingComplaintsCount() {
        return pendingComplaintsCount;
    }

    public BigDecimal getTotalDeposits() {
        return totalDeposits;
    }
}
