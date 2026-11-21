
package com.banksphere.repository;

import com.banksphere.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeneficiaryRepository
        extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCustomer_IdOrderByCreatedAtDesc(
            Long customerId
    );

    boolean existsByCustomer_IdAndAccountNumber(
            Long customerId,
            String accountNumber
    );

    long deleteByIdAndCustomer_Id(
            Long id,
            Long customerId
    );
}
