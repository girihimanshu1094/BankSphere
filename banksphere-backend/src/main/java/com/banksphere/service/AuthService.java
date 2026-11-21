
package com.banksphere.service;

import com.banksphere.dto.RegisterRequest;
import com.banksphere.dto.LoginRequest;
import com.banksphere.dto.AuthResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.banksphere.service.AccountService;
import org.springframework.transaction.annotation.Transactional;
import com.banksphere.entity.Account;


@Service
public class AuthService {

    private final AccountService accountService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AccountService accountService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.accountService = accountService;
}

    @Transactional 
    public String register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        String phone = request.getPhone().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "Email is already registered"
            );
        }

        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException(
                "Phone number is already registered"
            );
        }

        User user = new User();

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(
            passwordEncoder.encode(request.getPassword())
        );
        user.setRole(User.Role.CUSTOMER);

        userRepository.save(user);

        Account account = accountService.createSavingsAccount(user);

        return "Registration successful. Account Number: " + account.getAccountNumber();
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Invalid email or password"
                    )
                );

        if (!user.isEnabled() ||
                !passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
                )) {

            throw new IllegalArgumentException(
                "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
            token,
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().name(),
            "Login successful"
        );
    }
}
