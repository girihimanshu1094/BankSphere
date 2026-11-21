
package com.banksphere.dto;

import jakarta.validation.constraints.NotNull;

public class LoanDecisionRequest {

    @NotNull(message = "Decision is required")
    private Boolean approved;

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }
}
