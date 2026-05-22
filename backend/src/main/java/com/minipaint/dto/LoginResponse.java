package com.minipaint.dto;

public class LoginResponse {

    private String token;
    private UserInfo user;

    public LoginResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserInfo getUser() { return user; }

    public static class UserInfo {
        private Long id;
        private String nickname;
        private String email;

        public UserInfo(Long id, String nickname, String email) {
            this.id = id;
            this.nickname = nickname;
            this.email = email;
        }

        public Long getId() { return id; }
        public String getNickname() { return nickname; }
        public String getEmail() { return email; }
    }
}
