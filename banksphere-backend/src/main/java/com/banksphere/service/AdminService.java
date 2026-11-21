package com.banksphere.service;

import com.banksphere.dto.*;
import com.banksphere.entity.Account;
import com.banksphere.entity.Complaint;
import com.banksphere.entity.Loan;
import com.banksphere.entity.Transaction;
import com.banksphere.entity.User;
import com.banksphere.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final LoanRepository loanRepository;
    private final ComplaintRepository complaintRepository;
    private final AccountService accountService;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AdminService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            LoanRepository loanRepository,
            ComplaintRepository complaintRepository,
            AccountService accountService,
            PasswordEncoder passwordEncoder,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.loanRepository = loanRepository;
        this.complaintRepository = complaintRepository;
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .count();

        List<Account> accounts = accountRepository.findAll();
        long totalAccounts = accounts.size();

        BigDecimal totalDeposits = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalTransactionsCount = transactionRepository.count();
        long pendingLoansCount = loanRepository.countByStatus(Loan.LoanStatus.PENDING);
        long pendingComplaintsCount = complaintRepository.countByStatus(Complaint.ComplaintStatus.OPEN)
                + complaintRepository.countByStatus(Complaint.ComplaintStatus.IN_PROGRESS);

        return new AdminDashboardStatsResponse(
                totalCustomers,
                totalAccounts,
                totalTransactionsCount,
                pendingLoansCount,
                pendingComplaintsCount,
                totalDeposits);
    }

    @Transactional(readOnly = true)
    public List<AdminCustomerResponse> getAllCustomers() {
        List<User> users = userRepository.findAll();
        List<Account> accounts = accountRepository.findAll();

        Map<Long, Account> accountByUser = accounts.stream()
                .collect(Collectors.toMap(
                        a -> a.getUser().getId(),
                        a -> a,
                        (existing, replacement) -> existing));

        return users.stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .map(user -> {
                    Account account = accountByUser.get(user.getId());
                    return new AdminCustomerResponse(
                            user.getId(),
                            user.getFullName(),
                            user.getEmail(),
                            user.getPhone(),
                            user.getRole().name(),
                            user.isEnabled(),
                            account != null ? account.getAccountNumber() : "N/A",
                            account != null ? account.getAccountType().name() : "N/A",
                            account != null ? account.getBalance() : BigDecimal.ZERO,
                            user.isEnabled() ? "Active" : "Blocked",
                            user.getCreatedAt());
                })
                .toList();
    }

    @Transactional
    public AdminCustomerResponse updateCustomerStatus(Long userId, Boolean enabled, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setEnabled(enabled != null && enabled);
        userRepository.save(user);

        Account account = accountRepository.findByUserId(userId).orElse(null);
        if (account != null) {
            account.setStatus(user.isEnabled() ? Account.AccountStatus.ACTIVE : Account.AccountStatus.BLOCKED);
            accountRepository.save(account);
        }

        notificationService.createNotification(
                user,
                user.isEnabled() ? "Account Unblocked" : "Account Suspended",
                user.isEnabled()
                        ? "Your banking account access has been restored."
                        : "Your banking account access has been placed on hold: " + (reason != null ? reason : "Security/Administrative review"));

        return new AdminCustomerResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.isEnabled(),
                account != null ? account.getAccountNumber() : "N/A",
                account != null ? account.getAccountType().name() : "N/A",
                account != null ? account.getBalance() : BigDecimal.ZERO,
                user.isEnabled() ? "Active" : "Blocked",
                user.getCreatedAt());
    }

    @Transactional
    public AdminCustomerResponse createCustomer(AdminCreateCustomerRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String phone = request.getPhone() != null && !request.getPhone().isBlank()
                ? request.getPhone().trim().replaceAll("\\D", "")
                : String.valueOf(System.currentTimeMillis()).substring(3);

        if (userRepository.existsByPhone(phone)) {
            phone = String.valueOf(System.currentTimeMillis()).substring(3);
        }

        User user = new User();
        user.setFullName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode("Password@123"));
        user.setRole(User.Role.CUSTOMER);
        user.setEnabled(true);
        userRepository.save(user);

        Account account = accountService.createSavingsAccount(user);
        if (request.getInitialDeposit() != null && request.getInitialDeposit().compareTo(BigDecimal.ZERO) > 0) {
            account.setBalance(request.getInitialDeposit());
            accountRepository.save(account);
        }

        return new AdminCustomerResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.isEnabled(),
                account.getAccountNumber(),
                account.getAccountType().name(),
                account.getBalance(),
                "Active",
                user.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public List<AdminAccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(account -> new AdminAccountResponse(
                        account.getId(),
                        account.getAccountNumber(),
                        account.getAccountType().name(),
                        account.getBalance(),
                        account.getStatus().name(),
                        account.getUser().getId(),
                        account.getUser().getFullName(),
                        account.getUser().getEmail(),
                        account.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminTransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc().stream()
                .map(t -> new AdminTransactionResponse(
                        t.getId(),
                        t.getTransactionReference(),
                        t.getSenderAccount().getAccountNumber(),
                        t.getSenderAccount().getUser().getFullName(),
                        t.getReceiverAccount().getAccountNumber(),
                        t.getReceiverAccount().getUser().getFullName(),
                        t.getAmount(),
                        t.getDescription(),
                        t.getStatus().name(),
                        t.getTransactionDate()))
                .toList();
    }
}
