
package com.banksphere.repository;

import com.banksphere.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionReference(
            String transactionReference
    );

    List<Transaction> findBySenderAccountIdOrReceiverAccountIdOrderByTransactionDateDesc(
            Long senderAccountId,
            Long receiverAccountId
    );

    List<Transaction> findAllByOrderByTransactionDateDesc();
}
