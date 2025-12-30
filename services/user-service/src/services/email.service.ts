import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    // Create a reusable transporter object using SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send a magic login link email
   * @param email Recipient email address
   * @param link Magic login link
   */
  async sendMagicLink(email: string, link: string) {
    try {
      await this.transporter.sendMail({
        from: `"Healix" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Login Link',
        html: `
          <p>Hello,</p>
          <p>Click the link below to login:</p>
          <a href="${link}">${link}</a>
          <p>This link expires in 10 minutes. If you didn't request this, ignore this email.</p>
        `,
      });
      console.log(`Magic link sent to ${email}`);
    } catch (err) {
      console.error('Error sending magic link email:', err);
      throw new Error('Could not send email');
    }
  }
}
