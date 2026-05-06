import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends a password reset email to the user
 * @param email - The recipient's email address
 * @param resetUrl - The password reset URL with token
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  // In test environment, just log to console
  if (process.env.NODE_ENV === 'test') {
    console.log(`[TEST MODE] Password reset email would be sent to: ${email}`);
    console.log(`[TEST MODE] Reset URL: ${resetUrl}`);
    return;
  }

  // In development, log to console (SMTP not configured yet)
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_HOST) {
    console.log('='.repeat(60));
    console.log('PASSWORD RESET EMAIL');
    console.log('='.repeat(60));
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('='.repeat(60));
    return;
  }

  // Production: send actual email via nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"RentIt Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - RentIt',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">Password Reset Request</h2>
        <p>You requested to reset your password for your RentIt account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #64748b; word-break: break-all;">${resetUrl}</p>
        <p style="color: #64748b; font-size: 14px; margin-top: 24px;">This link will expire in 1 hour.</p>
        <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
