
package com.banksphere.repository;

import com.banksphere.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUser_IdOrderByApplicationDateDesc(Long userId);

    long countByStatus(Loan.LoanStatus status);
}
