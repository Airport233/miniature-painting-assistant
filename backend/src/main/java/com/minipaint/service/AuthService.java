package com.minipaint.service;

import com.minipaint.dto.LoginRequest;
import com.minipaint.dto.LoginResponse;
import com.minipaint.dto.RegisterRequest;
import com.minipaint.model.User;
import com.minipaint.model.VerificationToken;
import com.minipaint.repository.UserRepository;
import com.minipaint.repository.VerificationTokenRepository;
import com.minipaint.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, VerificationTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setNickname(req.getNickname());
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(token);
        vt.setType("EMAIL_VERIFY");
        vt.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        tokenRepository.save(vt);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (vt.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }
        User user = vt.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.delete(vt);
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email not verified");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new LoginResponse(token,
                new LoginResponse.UserInfo(user.getId(), user.getNickname(), user.getEmail()));
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        tokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(token);
        vt.setType("PASSWORD_RESET");
        vt.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        tokenRepository.save(vt);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (vt.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }
        User user = vt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(vt);
    }
}
