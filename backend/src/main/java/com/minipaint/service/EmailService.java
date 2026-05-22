package com.minipaint.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String baseUrl;

    public EmailService(JavaMailSender mailSender, @Value("${app.base-url}") String baseUrl) {
        this.mailSender = mailSender;
        this.baseUrl = baseUrl;
    }

    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Verify your email — Miniature Painting Assistant");
        msg.setText("Click to verify: " + baseUrl + "/api/auth/verify-email?token=" + token);
        mailSender.send(msg);
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Reset your password — Miniature Painting Assistant");
        msg.setText("Click: " + baseUrl + "/reset-password?token=" + token + "\nToken valid 24 hours.");
        mailSender.send(msg);
    }
}
