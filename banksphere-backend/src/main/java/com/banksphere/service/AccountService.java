
package com.banksphere.service;

import com.banksphere.service.NotificationService;
import com.banksphere.entity.Account;
import com.banksphere.entity.User;
import com.banksphere.repository.AccountRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;

import com.banksphere.dto.TransferRequest;
import com.banksphere.dto.TransferResponse;
import com.banksphere.entity.Transaction;
import com.banksphere.repository.TransactionRepository;

import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

import com.banksphere.dto.AccountResponse;

import com.banksphere.dto.TransactionResponse;
import java.util.List;

@Service
public class AccountService {

        private final TransactionRepository transactionRepository;
        private final AccountRepository accountRepository;
        private final NotificationService notificationService;
        private final SecureRandom secureRandom = new SecureRandom();

        public AccountService(
                        AccountRepository accountRepository,
                        TransactionRepository transactionRepository,
                        NotificationService notificationService) {

                this.accountRepository = accountRepository;
                this.transactionRepository = transactionRepository;
                this.notificationService = notificationService;
        }

        public AccountResponse getAccountDetails(Long userId) {

                Account account = accountRepository.findByUserId(userId)
                                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

                return new AccountResponse(
                                account.getAccountNumber(),
                                account.getAccountType().name(),
                                account.getBalance(),
                                account.getStatus().name(),
                                account.getCreatedAt());
        }

        @Transactional
        public AccountResponse deposit(Long userId, BigDecimal amount, String description) {
                if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new IllegalArgumentException("Deposit amount must be greater than zero");
                }

                Account account = accountRepository.findByUserId(userId)
                                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

                account = accountRepository.findByIdForUpdate(account.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

                if (account.getStatus() != Account.AccountStatus.ACTIVE) {
                        throw new IllegalArgumentException("Account is not active");
                }

                account.setBalance(account.getBalance().add(amount));
                accountRepository.save(account);

                Transaction transaction = new Transaction();
                transaction.setTransactionReference(
                                "DEP-" + UUID.randomUUID().toString()
                                                .replace("-", "").substring(0, 10).toUpperCase());
                transaction.setSenderAccount(account);
                transaction.setReceiverAccount(account);
                transaction.setAmount(amount);
                transaction.setDescription(description == null || description.isBlank() ? "Cash Deposit" : description.trim());
                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
                transactionRepository.save(transaction);

                notificationService.createNotification(
                                account.getUser(),
                                "Amount Credited",
                                "₹" + amount.toPlainString() + " successfully deposited to " + account.getAccountNumber() + ".");

                return new AccountResponse(
                                account.getAccountNumber(),
                                account.getAccountType().name(),
                                account.getBalance(),
                                account.getStatus().name(),
                                account.getCreatedAt());
        }

        @Transactional
        public AccountResponse withdraw(Long userId, BigDecimal amount, String description) {
                if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new IllegalArgumentException("Withdrawal amount must be greater than zero");
                }

                Account account = accountRepository.findByUserId(userId)
                                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

                account = accountRepository.findByIdForUpdate(account.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

                if (account.getStatus() != Account.AccountStatus.ACTIVE) {
                        throw new IllegalArgumentException("Account is not active");
                }

                if (account.getBalance().compareTo(amount) < 0) {
                        throw new IllegalArgumentException("Insufficient funds in the selected account");
                }

                account.setBalance(account.getBalance().subtract(amount));
                accountRepository.save(account);

                Transaction transaction = new Transaction();
                transaction.setTransactionReference(
                                "WTH-" + UUID.randomUUID().toString()
                                                .replace("-", "").substring(0, 10).toUpperCase());
                transaction.setSenderAccount(account);
                transaction.setReceiverAccount(account);
                transaction.setAmount(amount);
                transaction.setDescription(description == null || description.isBlank() ? "Cash Withdrawal" : description.trim());
                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
                transactionRepository.save(transaction);

                notificationService.createNotification(
                                account.getUser(),
                                "Amount Debited",
                                "₹" + amount.toPlainString() + " debited from " + account.getAccountNumber() + ".");

                return new AccountResponse(
                                account.getAccountNumber(),
                                account.getAccountType().name(),
                                account.getBalance(),
                                account.getStatus().name(),
                                account.getCreatedAt());
        }

        @Transactional(readOnly = true)
        public List<TransactionResponse> getTransactionHistory(Long userId) {

                // Find customer's bank account
                Account account = accountRepository.findByUserId(userId)
                                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

                // Find sent and received transactions
                List<Transaction> transactions = transactionRepository
                                .findBySenderAccountIdOrReceiverAccountIdOrderByTransactionDateDesc(
                                                account.getId(),
                                                account.getId());

                // Convert transactions into response DTOs
                return transactions.stream()
                                .map(transaction -> {

                                        boolean isSender = transaction.getSenderAccount()
                                                        .getId().equals(account.getId());

                                        // Determine transaction type: deposits are self-transfers (sender == receiver) and should be shown as RECEIVED (credit)
                String type;
                if (transaction.getSenderAccount() != null && transaction.getReceiverAccount() != null &&
                    transaction.getSenderAccount().getId().equals(transaction.getReceiverAccount().getId())) {
                    type = "RECEIVED";
                } else {
                    type = isSender ? "SENT" : "RECEIVED";
                }

                                        String otherAccountNumber = isSender
                                                        ? transaction.getReceiverAccount().getAccountNumber()
                                                        : transaction.getSenderAccount().getAccountNumber();

                                        return new TransactionResponse(
                                                        transaction.getTransactionReference(),
                                                        type,
                                                        otherAccountNumber,
                                                        transaction.getAmount(),
                                                        transaction.getDescription(),
                                                        transaction.getStatus().name(),
                                                        transaction.getTransactionDate());
                                })
                                .toList();
        }

        @Transactional
        public TransferResponse transferMoney(
                        Long senderUserId,
                        TransferRequest request) {

                // 1. Find and lock sender's account
                Account sender = accountRepository.findByUserId(senderUserId)
                                .orElseThrow(() -> new IllegalArgumentException("Sender account not found"));

                sender = accountRepository.findByIdForUpdate(sender.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Sender account not found"));

                // 2. Find and lock receiver's account
                Account receiver = accountRepository
                                .findByAccountNumberForUpdate(
                                                request.getReceiverAccountNumber().trim())
                                .orElseThrow(() -> new IllegalArgumentException("Receiver account not found"));

                // 3. Validate accounts
                if (sender.getId().equals(receiver.getId())) {
                        throw new IllegalArgumentException(
                                        "You cannot transfer money to your own account");
                }

                if (sender.getStatus() != Account.AccountStatus.ACTIVE ||
                                receiver.getStatus() != Account.AccountStatus.ACTIVE) {
                        throw new IllegalArgumentException(
                                        "Both accounts must be active");
                }

                // 4. Validate amount
                if (request.getAmount() == null ||
                                request.getAmount().scale() > 2 ||
                                request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new IllegalArgumentException("Invalid transfer amount");
                }

                // 5. Check available balance
                if (sender.getBalance().compareTo(request.getAmount()) < 0) {
                        throw new IllegalArgumentException("Insufficient balance");
                }

                // 6. Update balances
                sender.setBalance(sender.getBalance().subtract(request.getAmount()));
                receiver.setBalance(receiver.getBalance().add(request.getAmount()));

                accountRepository.save(sender);
                accountRepository.save(receiver);

                // 7. Create transaction record
                Transaction transaction = new Transaction();

                transaction.setTransactionReference(
                                "TXN-" + UUID.randomUUID().toString()
                                                .replace("-", "").substring(0, 12).toUpperCase());

                transaction.setSenderAccount(sender);
                transaction.setReceiverAccount(receiver);
                transaction.setAmount(request.getAmount());
                transaction.setDescription(
                                request.getDescription() == null ||
                                                request.getDescription().isBlank()
                                                                ? "Money transfer"
                                                                : request.getDescription().trim());

                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);

                transactionRepository.save(transaction);
                // 8. Notify sender
                notificationService.createNotification(
                                sender.getUser(),
                                "Money Sent",
                                "You successfully transferred ₹" +
                                                request.getAmount().toPlainString() +
                                                " to account " + receiver.getAccountNumber());

                // 9. Notify receiver
                notificationService.createNotification(
                                receiver.getUser(),
                                "Money Received",
                                "You received ₹" +
                                                request.getAmount().toPlainString() +
                                                " from account " + sender.getAccountNumber());

                // 8. Return transfer confirmation
                return new TransferResponse(
                                transaction.getTransactionReference(),
                                sender.getAccountNumber(),
                                receiver.getAccountNumber(),
                                transaction.getAmount(),
                                sender.getBalance(),
                                transaction.getStatus().name(),
                                "Money transferred successfully",
                                transaction.getTransactionDate());
        }

        public Account createSavingsAccount(User user) {

                Account account = new Account();

                account.setAccountNumber(generateAccountNumber());
                account.setUser(user);
                account.setAccountType(Account.AccountType.SAVINGS);
                account.setBalance(BigDecimal.ZERO);
                account.setStatus(Account.AccountStatus.ACTIVE);

                return accountRepository.save(account);
        }

        private String generateAccountNumber() {

                String accountNumber;

                do {
                        long number = 100_000_000_000L
                                        + secureRandom.nextLong(900_000_000_000L);

                        accountNumber = String.valueOf(number);

                } while (accountRepository.existsByAccountNumber(accountNumber));

                return accountNumber;
        }
}
