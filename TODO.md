# TODO: Implement MessagesTab with Real-Time Notifications

## Backend Changes
- [ ] Create Notification model and migration (user_id, type, title, message, data, read_at, created_at)
- [ ] Create NotificationController with index (fetch user notifications) and markAsRead methods
- [ ] Update KycController approve/reject to create notifications
- [ ] Update LandTaxRegistrationController update to create notifications on status change
- [ ] Update MutationController update to create notifications on status change
- [ ] Create email notification classes (KycApproved, KycRejected, LandTaxApproved/Rejected/Flagged, MutationApproved/Rejected/Flagged)
- [ ] Add notification API routes

## Frontend Changes
- [ ] Add notification API functions to api.js
- [ ] Implement MessagesTab with notification list, polling every 30s, mark as read functionality
- [ ] Update Dashboard.jsx to fetch unread count and display badge on Messages tab
- [ ] Add translation keys for notification messages

## Followup Steps
- [ ] Run migrations
- [ ] Test notification creation on admin actions
- [ ] Test email notifications
- [ ] Test frontend polling and badge updates
