
package com.banksphere.service;

import com.banksphere.dto.BeneficiaryRequest;
import com.banksphere.dto.BeneficiaryResponse;
import com.banksphere.entity.Account;
import com.banksphere.entity.Beneficiary;
import com.banksphere.entity.User;
import com.banksphere.repository.AccountRepository;
import com.banksphere.repository.BeneficiaryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;

    public BeneficiaryService(
            BeneficiaryRepository beneficiaryRepository,
            AccountRepository accountRepository) {

        this.beneficiaryRepository = beneficiaryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public BeneficiaryResponse addBeneficiary(
            User customer,
            BeneficiaryRequest request) {

        String accountNumber = request.getAccountNumber().trim();

        Account receiver = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found"));

        if (receiver.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Beneficiary account is not active");
        }

        Account ownAccount = accountRepository
                .findByUserId(customer.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer account not found"));

        if (ownAccount.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException(
                    "You cannot add your own account as a beneficiary");
        }

        if (beneficiaryRepository.existsByCustomer_IdAndAccountNumber(
                customer.getId(), accountNumber)) {
            throw new IllegalArgumentException("Beneficiary already exists");
        }

        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setCustomer(customer);
        beneficiary.setBeneficiaryName(receiver.getUser().getFullName());
        beneficiary.setAccountNumber(accountNumber);
        beneficiary.setNickname(
                request.getNickname() == null ||
                        request.getNickname().isBlank()
                                ? null
                                : request.getNickname().trim());

        Beneficiary saved = beneficiaryRepository.save(beneficiary);

        return new BeneficiaryResponse(
                saved.getId(),
                saved.getBeneficiaryName(),
                saved.getAccountNumber(),
                saved.getNickname(),
                saved.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public List<BeneficiaryResponse> getBeneficiaries(Long customerId) {

        return beneficiaryRepository
                .findByCustomer_IdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(beneficiary -> new BeneficiaryResponse(
                        beneficiary.getId(),
                        beneficiary.getBeneficiaryName(),
                        beneficiary.getAccountNumber(),
                        beneficiary.getNickname(),
                        beneficiary.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void deleteBeneficiary(Long beneficiaryId, Long customerId) {

        long deleted = beneficiaryRepository
                .deleteByIdAndCustomer_Id(beneficiaryId, customerId);

        if (deleted == 0) {
            throw new IllegalArgumentException(
                    "Beneficiary not found");
        }
    }

    @Transactional
    public BeneficiaryResponse updateBeneficiary(Long beneficiaryId, Long customerId, String nickname) {
        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() -> new IllegalArgumentException("Beneficiary not found"));

        if (!beneficiary.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("You cannot edit this beneficiary");
        }

        if (nickname != null) {
            beneficiary.setNickname(nickname.trim().isEmpty() ? null : nickname.trim());
        }

        Beneficiary updated = beneficiaryRepository.save(beneficiary);

        return new BeneficiaryResponse(
                updated.getId(),
                updated.getBeneficiaryName(),
                updated.getAccountNumber(),
                updated.getNickname(),
                updated.getCreatedAt());
    }

}
