package com.minipaint.dto;

import java.time.Instant;

public class ApiError {

    private int status;
    private String message;
    private Instant timestamp;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public Instant getTimestamp() { return timestamp; }
}
