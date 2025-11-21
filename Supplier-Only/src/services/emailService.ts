// Frontend-only email notification service
// In a real application, this would connect to an email service API

interface VisitorRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  photo: string;
  checkInTime: Date;
}

interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  visitorData: VisitorRecord;
}

export class EmailService {
  // Admin email (configure as needed)
  private static readonly ADMIN_EMAIL = 'admin@vsts.com';

  /**
   * Simulate sending email notification to admin
   * In a real implementation, this would use a service like:
   * - SendGrid API
   * - EmailJS
   * - AWS SES
   * - Custom backend service
   */
  static async sendVisitorCheckInNotification(visitorData: VisitorRecord): Promise<boolean> {
    try {
      const notification: EmailNotification = {
        to: this.ADMIN_EMAIL,
        subject: `New Visitor Check-in: ${visitorData.name}`,
        body: this.generateEmailBody(visitorData),
        timestamp: new Date(),
        visitorData
      };

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store notification in localStorage for admin viewing
      const notifications = this.getStoredNotifications();
      notifications.push(notification);
      localStorage.setItem('vsts_email_notifications', JSON.stringify(notifications));

      console.log('📧 Email notification sent:', {
        to: notification.to,
        subject: notification.subject,
        timestamp: notification.timestamp,
        visitor: {
          name: visitorData.name,
          company: visitorData.company,
          email: visitorData.email,
          checkInTime: visitorData.checkInTime.toLocaleString()
        }
      });

      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  /**
   * Generate HTML email body for visitor check-in
   */
  private static generateEmailBody(visitor: VisitorRecord): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">VSTS Visitor Check-in Alert</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A new visitor has checked in</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${visitor.photo}" alt="${visitor.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #f3f4f6;">
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">Visitor Information</h2>
              <div style="space-y: 10px;">
                <p style="margin: 8px 0; color: #4b5563;"><strong>Name:</strong> <span style="color: #1f2937;">${visitor.name}</span></p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>Company:</strong> <span style="color: #1f2937;">${visitor.company}</span></p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>Email:</strong> <a href="mailto:${visitor.email}" style="color: #3b82f6; text-decoration: none;">${visitor.email}</a></p>
                <p style="margin: 8px 0; color: #4b5563;"><strong>Check-in Time:</strong> <span style="color: #1f2937;">${visitor.checkInTime.toLocaleString()}</span></p>
              </div>
            </div>

            <div style="background: #ecfdf5; border: 1px solid #d1fae5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; color: #065f46; font-weight: 500;">✅ Visitor photo captured successfully</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                View Visitor Management System
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>This is an automated notification from VSTS Visitor & Staff Tracking System</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get stored email notifications from localStorage
   */
  static getStoredNotifications(): EmailNotification[] {
    try {
      return JSON.parse(localStorage.getItem('vsts_email_notifications') || '[]');
    } catch (error) {
      console.error('Error reading stored notifications:', error);
      return [];
    }
  }

  /**
   * Get notification statistics
   */
  static getNotificationStats() {
    const notifications = this.getStoredNotifications();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayNotifications = notifications.filter(
      n => new Date(n.timestamp) >= today
    );

    return {
      total: notifications.length,
      today: todayNotifications.length,
      recent: notifications.slice(-5).reverse() // Last 5 notifications
    };
  }

  /**
   * Clear old notifications (older than 30 days)
   */
  static clearOldNotifications() {
    const notifications = this.getStoredNotifications();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNotifications = notifications.filter(
      n => new Date(n.timestamp) >= thirtyDaysAgo
    );

    localStorage.setItem('vsts_email_notifications', JSON.stringify(recentNotifications));
  }
}

// For development: expose service to window for testing
declare global {
  interface Window {
    VSTSEmailService: typeof EmailService;
  }
}

// Expose for admin debugging
if (typeof window !== 'undefined') {
  window.VSTSEmailService = EmailService;
}