
package com.banksphere.dto;

import com.banksphere.entity.Complaint;
import jakarta.validation.constraints.NotNull;

public class ComplaintStatusRequest {

    @NotNull(message = "Complaint status is required")
    private Complaint.ComplaintStatus status;

    public Complaint.ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(Complaint.ComplaintStatus status) {
        this.status = status;
    }
}
