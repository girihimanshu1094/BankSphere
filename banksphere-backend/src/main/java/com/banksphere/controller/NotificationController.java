
package com.banksphere.controller;

import com.banksphere.dto.NotificationResponse;
import com.banksphere.entity.User;
import com.banksphere.repository.UserRepository;
import com.banksphere.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // Get logged-in customer's notifications
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return ResponseEntity.ok(
                notificationService.getMyNotifications(user.getId()));
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return ResponseEntity.ok(
                notificationService.getUnreadCount(user.getId()));
    }

    // Mark a notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        notificationService.markAsRead(notificationId, user.getId());

        return ResponseEntity.ok("Notification marked as read");
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        notificationService.markAllAsRead(user.getId());

        return ResponseEntity.ok("All notifications marked as read");
    }

    // Find currently logged-in user
    private User getLoggedInUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }
}
