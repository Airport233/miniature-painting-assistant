package com.minipaint.service;

import com.minipaint.dto.LoginRequest;
import com.minipaint.dto.RegisterRequest;
import com.minipaint.model.User;
import com.minipaint.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("dev")
@AutoConfigureMockMvc
@Transactional
class AuthServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @MockBean
    private JavaMailSender javaMailSender;

    @Test
    void shouldSaveAndFindUserByEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("hashed_password");
        user.setNickname("Tester");
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getNickname()).isEqualTo("Tester");
    }

    @Test
    void shouldReturnEmptyForUnknownEmail() {
        Optional<User> found = userRepository.findByEmail("nobody@example.com");
        assertThat(found).isEmpty();
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@example.com");
        req.setPassword("password123");
        req.setNickname("NewUser");

        authService.register(req);

        Optional<User> user = userRepository.findByEmail("new@example.com");
        assertThat(user).isPresent();
        assertThat(user.get().getPasswordHash()).isNotEqualTo("password123");
        assertThat(user.get().isEmailVerified()).isFalse();
    }

    @Test
    void shouldFailDuplicateRegistration() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("dup@example.com");
        req.setPassword("password123");
        req.setNickname("First");
        authService.register(req);

        RegisterRequest req2 = new RegisterRequest();
        req2.setEmail("dup@example.com");
        req2.setPassword("password456");
        req2.setNickname("Second");

        assertThatThrownBy(() -> authService.register(req2))
                .isInstanceOf(RuntimeException.class);
    }
}
