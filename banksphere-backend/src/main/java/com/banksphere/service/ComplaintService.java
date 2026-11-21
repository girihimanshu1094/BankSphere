
package com.banksphere.service;

import com.banksphere.service.NotificationService;
import com.banksphere.dto.ComplaintRequest;
import com.banksphere.dto.ComplaintResponse;
import com.banksphere.entity.Complaint;
import com.banksphere.entity.User;
import com.banksphere.repository.ComplaintRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            NotificationService notificationService) {

        this.complaintRepository = complaintRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ComplaintResponse updateComplaintStatus(
            Long complaintId,
            Complaint.ComplaintStatus newStatus) {

        // Find complaint
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        // Update complaint status
        complaint.setStatus(newStatus);

        // Save updated complaint
        Complaint updated = complaintRepository.save(complaint);
        // Notify customer about complaint status update
        String title = "Complaint Status Updated";

        String message = "Your complaint '" + complaint.getSubject()
                + "' status has been updated to "
                + newStatus.name().replace("_", " ") + ".";

        notificationService.createNotification(
                complaint.getUser(),
                title,
                message);

        return convertToResponse(updated);
    }

    // Submit a complaint
    @Transactional
    public ComplaintResponse submitComplaint(
            User user,
            ComplaintRequest request) {

        Complaint complaint = new Complaint();

        complaint.setUser(user);
        complaint.setSubject(request.getSubject().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setStatus(Complaint.ComplaintStatus.OPEN);

        Complaint saved = complaintRepository.save(complaint);

        return convertToResponse(saved);
    }

    // View customer's complaints
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(Long userId) {

        return complaintRepository
                .findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Admin: View all complaints
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Convert entity into response DTO
    private ComplaintResponse convertToResponse(Complaint complaint) {

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getSubject(),
                complaint.getDescription(),
                complaint.getStatus().name(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt());
    }
}
