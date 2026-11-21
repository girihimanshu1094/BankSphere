package com.banksphere.dto;

import jakarta.validation.constraints.NotNull;

public class AdminCustomerStatusRequest {

    @NotNull(message = "Enabled flag is required")
    private Boolean enabled;

    private String reason;

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
