
package com.banksphere.service;

import com.banksphere.dto.NotificationResponse;
import com.banksphere.entity.Notification;
import com.banksphere.entity.User;
import com.banksphere.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Create notification
    @Transactional
    public void createNotification(
            User user,
            String title,
            String message) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    // Get customer's notifications
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(Long userId) {

        return notificationRepository
                .findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notification -> new NotificationResponse(
                        notification.getId(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.isRead(),
                        notification.getCreatedAt()
                ))
                .toList();
    }

    // Count unread notifications
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {

        return notificationRepository.countByUser_IdAndReadFalse(userId);
    }

    // Mark notification as read
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                    new IllegalArgumentException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You cannot access this notification");
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    // Mark all notifications as read
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> !n.isRead())
                .toList();
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
